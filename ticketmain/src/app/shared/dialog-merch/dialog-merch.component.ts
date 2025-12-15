import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente simple de diálogo para mostrar merchandising
 * Compatible con Zard UI Dialog
 */
@Component({
  selector: 'app-dialog-merch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog-merch.component.html',
  styleUrls: ['./dialog-merch.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DialogMerchComponent {
  
  // Productos de merchandising de ejemplo
  // Aquí puedes recibir datos del concierto más adelante
  productos = [
    { 
      id: 1,
      nombre: 'Camiseta Oficial', 
      precio: 25, 
      descripcion: 'Camiseta oficial del tour',
      emoji: '👕'
    },
    { 
      id: 2,
      nombre: 'Gorra del Tour', 
      precio: 15, 
      descripcion: 'Gorra edición limitada',
      emoji: '🧢'
    },
    { 
      id: 3,
      nombre: 'Poster Firmado', 
      precio: 10, 
      descripcion: 'Poster con firma del artista',
      emoji: '📜'
    },
    { 
      id: 4,
      nombre: 'Taza Conmemorativa', 
      precio: 12, 
      descripcion: 'Taza del concierto',
      emoji: '☕'
    }
  ];

  /**
   * Función para seleccionar un producto
   * Aquí puedes añadir lógica para añadir al carrito
   */
  seleccionarProducto(producto: any): void {
    console.log('Producto seleccionado:', producto);
    // TODO: Aquí puedes añadir la lógica para añadir al carrito
  }
}
