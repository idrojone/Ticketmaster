import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';

@Component({
  selector: 'app-total-carrito',
  imports: [CommonModule, RouterModule],
  templateUrl: './total-carrito.html',
  styleUrl: './total-carrito.css'
})
export class TotalCarrito {
  private cartService = inject(CartService);

  // Signals computadas para los cálculos
  subtotal = computed(() => this.cartService.getTotal());
  descuento = signal(0); // Puede implementarse lógica de descuentos
  gastosGestion = computed(() => {
    const subtotalValue = this.subtotal();
    // 2% de gastos de gestión
    return subtotalValue * 0.02;
  });
  
  total = computed(() => {
    return this.subtotal() - this.descuento() + this.gastosGestion();
  });

  procederAlPago(): void {
    // Implementar lógica de pago
    console.log('Procediendo al pago...');
    // TODO: Redirigir a página de checkout
  }
}
