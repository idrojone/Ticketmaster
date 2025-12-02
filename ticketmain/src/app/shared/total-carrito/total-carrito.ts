import { Component, computed, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartItem } from 'src/app/core/models/cart-item.model';
import { ConciertoCarrito } from 'src/app/core/models/conciertos.model';
import { MerchandisingCarrito } from 'src/app/core/models/dashboard-empresa/Merchandising.model';
import { Signal } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { CartService } from 'src/app/core/services/cart.service';
import Swal from 'sweetalert2';
import STRIPE_PK from 'src/environments/stripe';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-total-carrito',
  imports: [CommonModule, RouterModule],
  templateUrl: './total-carrito.html',
  styleUrl: './total-carrito.css'
})
export class TotalCarrito {
  conciertos = input<ConciertoCarrito[]>([]);
  merchandising = input<MerchandisingCarrito[]>([]);
  idcarrito = input<string | null>(null);

  stripe: Stripe | null = null;
  cardElement: any;
  cardMounted = false;
  cardComplete = false;
  processingPayment = false; 
  paymentError = '';    
  
  usuario: any;

  private cartService = inject(CartService);
  private router = inject(Router);
  private userService = inject(UserService);

  async ngOnInit() {
    // this.stripe = await loadStripe('pk_test_51SUk4KQ3zmGQt5EBckMmmy6QZWk5hV4NF1wwpPKX5AH9B4ANk5NBIfAAeC6ENDtYbWkh707CKaDqvKX79WA1lPjn00s1m4b1C0');
    this.stripe = await loadStripe(STRIPE_PK);
    this.usuario = this.userService.getCurrentUser()
    console.log(this.usuario);

    if (!this.stripe) {
      console.error('Error al cargar Stripe');
      this.paymentError = 'Error al cargar el sistema de pagos. Recarga la página.';
      return;
    }

    const elements = this.stripe.elements();
    
    this.cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      }
    });

    this.cardElement.mount('#card-element');
    this.cardMounted = true;

    this.cardElement.on('change', (event: any) => {
      this.cardComplete = event.complete;
      this.paymentError = event.error ? event.error.message : '';
    });
  }

  subtotal = computed(() => {
    let totalConciertos = 0;
    for (let i = 0; i < this.conciertos().length; i++) {
      totalConciertos += this.conciertos()[i].precio * this.conciertos()[i].cantidad;
    }
    
    let totalMerchandising = 0;
    for (let i = 0; i < this.merchandising().length; i++) {
      totalMerchandising += this.merchandising()[i].precio * this.merchandising()[i].cantidad;
    }

    return totalConciertos + totalMerchandising;
  });
  
  descuento = computed(() => {
    return 0;
  });
  
  gastosGestion = computed(() => {
    return 0;
  });
  
  total = computed(() => {
    return this.subtotal() - this.descuento() + this.gastosGestion();
  });

  cantidadConciertos = computed(() => {
    return this.conciertos().length;
  });
  
  cantidadMerchandising = computed(() => {
    return this.merchandising().length;
  });

  async procederAlPago() {
    if (!this.cardComplete) {
      this.paymentError = 'Por favor, completa los datos de tu tarjeta';
      return;
    }

    if (!this.stripe || !this.cardElement) {
      this.paymentError = 'Error: Stripe no está cargado correctamente';
      return;
    }

    if (!this.idcarrito()) {
      this.paymentError = 'Error: No se encontró el carrito';
      return;
    }

    this.processingPayment = true;
    this.paymentError = '';

    console.log('Proceder al pago con:', this.idcarrito());
    const payload = {
      cartId: this.idcarrito()
    };

    this.cartService.payCarrito(payload).subscribe({
      next: async (res) => {
        console.log('Respuesta del servidor:', res);
        const { clientSecret } = res.data;
        
        const result = await this.stripe!.confirmCardPayment(clientSecret, {
          payment_method: {
            card: this.cardElement
          }
        });

        console.log('Resultado del pago:', result);

        this.processingPayment = false;

        if (result.error) {
          this.paymentError = result.error.message || 'Error al procesar el pago';
          Swal.fire({
            icon: 'error',
            title: 'Error al pagar',
            text: result.error.message || 'Hubo un error al procesar el pago.',
            showConfirmButton: false,
            timer: 2000
          });
        } else if (result.paymentIntent.status === 'succeeded' ) {

          this.verificarEstadoOrden(res.data.order.carritoId);

        }
      },
      error: (err) => {
        console.error('Error del backend:', err);
        this.processingPayment = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'Hubo un error al crear la orden.',
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  }

  async verificarEstadoOrden(orderID : string , intentos : number = 0, maxIntentos : number = 10){

    try{

      const status = await this.cartService.getEstadoOrden(orderID).toPromise();

      if(status === 'PAID'){

        //SWAL FIRE CORRECTO
        Swal.fire({
          icon: 'success',
          title: '¡Pago exitoso!',
          text: '¿Qué deseas hacer ahora?',
          showCancelButton: true,
          confirmButtonText: 'Hacer otro pedido',
          cancelButtonText: 'Ir a mi perfil',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#6c757d',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/shop']);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.router.navigate(['/profile/me/' + this.usuario.username]);
          }
        });

      }else if(status === 'PAYMENT_FAILED'){

        //SWAL FIRE FALLIDO
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al procesar el pago, contacta con el soporte.',
          showConfirmButton: false,
          timer: 2000
        });

      }else if (intentos < maxIntentos){
        
        setTimeout(() => {
          this.verificarEstadoOrden(orderID, intentos + 1, maxIntentos);
        }, 1000);

      }else{

        //SWAL FIRE TU PAGO ESTA SIENDO PROCESADO
        Swal.fire({
          icon: 'warning',
          title: 'Tu pago esta siendo procesado',
          text: 'Por favor, espera a que se complete el pago.',
          showConfirmButton: true,
          timer: 2000,
          confirmButtonText: ' Ir a mi perfil'
        }).then((result) => {
          if(result.isConfirmed){
            this.router.navigate(['/profile/me/' + this.usuario.username]);
          }
        })

      }

    } catch (error) {
      console.error('Error al verificar el estado de la orden:', error);
      //Si aun quedan intentos iterar
      if(intentos < maxIntentos){
        setTimeout(() => {
          this.verificarEstadoOrden(orderID, intentos + 1, maxIntentos);
        }, 1000);
      }
    }
    
  }
}
