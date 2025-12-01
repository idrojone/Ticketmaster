import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartItem } from 'src/app/core/models/cart-item.model';
import { ConciertoCarrito } from 'src/app/core/models/conciertos.model';
import { MerchandisingCarrito } from 'src/app/core/models/dashboard-empresa/Merchandising.model';

@Component({
  selector: 'app-total-carrito',
  imports: [CommonModule, RouterModule],
  templateUrl: './total-carrito.html',
  styleUrl: './total-carrito.css'
})
export class TotalCarrito {
  conciertos = input<ConciertoCarrito[]>([]);
  merchandising = input<MerchandisingCarrito[]>([]);

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

  procederAlPago() {
    console.log('Proceder al pago con total:', this.total());
  }
}
