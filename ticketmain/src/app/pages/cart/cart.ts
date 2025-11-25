import { Component, inject, signal } from '@angular/core';
import { CartService } from 'src/app/core/services/cart.service';
import { ListCarrito } from 'src/app/shared/list-carrito/list-carrito';

@Component({
  selector: 'app-cart',
  imports: [
    ListCarrito
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart {

}
