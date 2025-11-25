import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from 'src/app/core/models/cart-item.model';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-card-carrito',
  imports: [CommonModule],
  templateUrl: './card-carrito.html',
  styleUrl: './card-carrito.css'
})
export class CardCarrito {
  @Input() producto!: CartItem;
  
  private cartService = inject(CartService);

  incrementarCantidad(): void {
    this.cartService.updateQuantity(
      this.producto.id, 
      this.producto.type, 
      this.producto.cantidad + 1
    );
  }

  decrementarCantidad(): void {
    if (this.producto.cantidad > 1) {
      this.cartService.updateQuantity(
        this.producto.id, 
        this.producto.type, 
        this.producto.cantidad - 1
      );
    }
  }

  eliminarProducto(): void {
    this.cartService.removeItem(this.producto.id, this.producto.type);
  }
}
