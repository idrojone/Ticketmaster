import { Component, signal, computed, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartItem } from 'src/app/core/models/cart-item.model';

@Component({
  selector: 'app-total-carrito',
  imports: [CommonModule, RouterModule],
  templateUrl: './total-carrito.html',
  styleUrl: './total-carrito.css'
})
export class TotalCarrito {
  // @Input() carrito: CartItem[] = [];

  
}
