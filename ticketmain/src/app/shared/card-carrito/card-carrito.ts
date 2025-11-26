import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from 'src/app/core/models/cart-item.model';

@Component({
  selector: 'app-card-carrito',
  imports: [CommonModule],
  templateUrl: './card-carrito.html',
  styleUrl: './card-carrito.css'
})
export class CardCarrito {
  @Input() producto!: CartItem;

  incrementarCantidad(): void {
    // TODO: Implementar con el nuevo CartService que usa API
    console.log('Incrementar cantidad:', this.producto.id);
  }

  decrementarCantidad(): void {
    // TODO: Implementar con el nuevo CartService que usa API
    console.log('Decrementar cantidad:', this.producto.id);
  }

  eliminarProducto(): void {
    // TODO: Implementar con el nuevo CartService que usa API
    console.log('Eliminar producto:', this.producto.id);
  }
}
