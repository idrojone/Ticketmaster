import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { CartItem } from 'src/app/core/models/cart-item.model';
import { CardCarrito } from '../card-carrito/card-carrito';
import { TotalCarrito } from '../total-carrito/total-carrito';
import { ConciertoCarrito } from 'src/app/core/models/conciertos.model';
import { MerchandisingCarrito } from 'src/app/core/models/dashboard-empresa/Merchandising.model';

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
  public conciertos = signal<ConciertoCarrito[]>([]);
  public merchandising = signal<MerchandisingCarrito[]>([]);
  public idcarrito = signal<string | null>(null);

  public loading= signal(false)

  private cartService = inject(CartService);

  constructor() {
    this.LoadCarrito();
  }

  public async LoadCarrito() {
    // this.loading.set(true);
    this.cartService.getCarrito().subscribe({
      next: (res) => {
        console.log(res);
        this.carrito.set(res);
        this.conciertos.set(res.conciertos);
        this.merchandising.set(res.merchandising);
        this.idcarrito.set(res.carrito._id);
        },
      error: (err) => {
        console.log(err);
      }
    })
  }

  public precioTotalEmmiter(): any{
    
    // this.precioTotal.set( 

    // );
  }
}
