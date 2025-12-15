import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-categoria',
  template: `
    <form [formGroup]="form" class="grid gap-6">
      <div class="grid gap-3">
        <label for="nombre" class="text-sm font-medium">Nombre de la Categoría</label>
        <input z-input formControlName="nombre" id="nombre" />
      </div>

      <div class="grid gap-3 col-span-2">
        <label for="descripcion" class="text-sm font-medium">Descripción</label>
        <textarea z-input formControlName="descripcion" id="descripcion" rows="4"></textarea>
      </div>

      <div class="grid gap-3">
        <label for="imagen" class="text-sm font-medium">URL de Imagen (opcional)</label>
        <input z-input formControlName="imagen" id="imagen" type="url" />
      </div>
    </form>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddCategoria implements OnInit {
  form = new FormGroup({
    nombre: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    imagen: new FormControl('')
  });

  ngOnInit() {
    // Inicializar valores por defecto si es necesario
  }
}
