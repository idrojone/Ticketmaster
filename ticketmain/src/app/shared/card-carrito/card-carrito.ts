import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from 'src/app/core/models/cart-item.model';
import { OnInit } from '@angular/core';
import { ConciertoCarrito } from 'src/app/core/models/conciertos.model';
import { CartService } from 'src/app/core/services/cart.service';


@Component({
  selector: 'app-card-carrito',
  templateUrl: './card-carrito.html',
  styleUrl: './card-carrito.css'
})
export class CardCarrito implements OnInit {
  @Input() concierto!: ConciertoCarrito;
  @Output() carritoActualizado = new EventEmitter<void>();

  private cartService = inject(CartService);

  ngOnInit(): void {
    console.log(this.concierto);
  }

  incrementarCantidad(): void {
    this.cartService.carritoMaster(
      [
        {
          slug: this.concierto.slug,
          cantidad: 1
        }
      ],
      []
    )
    .subscribe({
      next: (carrito) => {
        // console.log(carrito);
        this.carritoActualizado.emit();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  decrementarCantidad(): void {
    this.cartService.carritoMaster(
      [
        {
          slug: this.concierto.slug,
          cantidad: -1
        }
      ],
      []
    )
    .subscribe({
      next: (carrito) => {
        // console.log(carrito);
        this.carritoActualizado.emit();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  eliminarProducto(): void {
    let cantidadEliminar : any = this.concierto.cantidad; 
    this.cartService.carritoMaster(
      [
        {
          slug: this.concierto.slug,
          cantidad: -cantidadEliminar
        }
      ],
      []
    )
    .subscribe({
      next: (carrito) => {
        // console.log(carrito);
        this.carritoActualizado.emit();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

}
