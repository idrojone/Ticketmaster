import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { CartItem } from 'src/app/core/models/cart-item.model';
import { CardCarrito } from '../card-carrito/card-carrito';
import { TotalCarrito } from '../total-carrito/total-carrito';

@Component({
  selector: 'app-list-carrito',
  imports: [
    CommonModule,
    RouterModule,
    CardCarrito,
    TotalCarrito
  ],
  templateUrl: './list-carrito.html',
  styleUrl: './list-carrito.css'
})
export class ListCarrito {
  public carrito = signal<CartItem[]>([]);
  public precioTotal = signal<number | null>(null);

  public loading= signal(false)

  private cartService = inject(CartService);

  constructor() {
    this.LoadCarrito();
  }

  //Cargamos los productos del carrito
  private async LoadCarrito() {
    this.loading.set(true);
    
    // Suscribirse a los cambios del carrito
    this.cartService.cartItems$.subscribe(items => {
      this.carrito.set(items);
      this.calcularPrecioTotal(items);
      this.loading.set(false);
    });
    
    // Cargar items iniciales
    const items = this.cartService.getCartItems();
    this.carrito.set(items);
    this.calcularPrecioTotal(items);
    this.loading.set(false);
  }

  private async calcularPrecioTotal(carrito: CartItem[]){
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    this.precioTotal.set(total);
  }
  
}
