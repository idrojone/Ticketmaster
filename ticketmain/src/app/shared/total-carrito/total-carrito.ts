import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-total-carrito',
  imports: [CommonModule, RouterModule],
  templateUrl: './total-carrito.html',
  styleUrl: './total-carrito.css'
})
export class TotalCarrito {
  // TODO: Integrar con el nuevo CartService basado en API
  subtotal = signal(0);
  descuento = signal(0);
  gastosGestion = computed(() => {
    const subtotalValue = this.subtotal();
    return subtotalValue * 0.02;
  });
  
  total = computed(() => {
    return this.subtotal() - this.descuento() + this.gastosGestion();
  });

  procederAlPago(): void {
    console.log('Procediendo al pago...');
    // TODO: Implementar lógica de pago con API
  }
}
