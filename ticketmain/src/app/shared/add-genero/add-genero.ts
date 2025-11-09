import { Component, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostGeneroAdmin } from 'src/app/core/models/dashboard-admin/GenerosAdmin.model';


@Component({
  selector: 'app-add-genero',
  template: `
    <form [formGroup]="form" class="grid gap-6">
      <div class="grid gap-3">
        <label for="name" class="text-sm font-medium">Nombre del Género</label>
        <input z-input formControlName="name" id="name" />
      </div>

      <div class="grid gap-3 col-span-2">
        <label for="description" class="text-sm font-medium">Descripción</label>
        <textarea z-input formControlName="description" id="description" rows="4"></textarea>
      </div>
    </form>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddGenero implements OnInit {

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  ngOnInit() {
    // Inicializar valores por defecto si es necesario
  }
}
