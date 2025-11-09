import { Component, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostConciertoAdmin } from 'src/app/core/models/dashboard-admin/ConciertosAdmin.model';
import { ZardDatePickerComponent } from '@shared/components/date-picker/date-picker.component';


@Component({
  selector: 'app-add-concierto',
  template: `
    <form [formGroup]="form" class="grid grid-cols-2 gap-6">
      <div class="grid gap-3">
        <label for="nombre" class="text-sm font-medium">Nombre del Concierto</label>
        <input z-input formControlName="nombre" id="nombre" />
      </div>

      <div class="grid gap-3">
        <label for="artista" class="text-sm font-medium">Artista</label>
        <input z-input formControlName="artista" id="artista" />
      </div>

      <div class="grid gap-3">
        <label for="lugar" class="text-sm font-medium">Lugar</label>
        <input z-input formControlName="lugar" id="lugar" />
      </div>

      <div class="grid gap-3">
        <label for="ciudad" class="text-sm font-medium">Ciudad</label>
        <input z-input formControlName="ciudad" id="ciudad" />
      </div>

      <div class="grid gap-3">
        <label for="fecha" class="text-sm font-medium">Fecha del Evento</label>
        <div class="relative">
          <input 
            z-input 
            type="date" 
            formControlName="fecha" 
            id="fecha"
            (change)="onDateInputChange($event)"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
        @if (selectedDate() && selectedDateFormatted()) {
          <div class="text-xs text-blue-600 mt-1">
            📅 {{ selectedDateFormatted() }}
          </div>
        }
      </div>

      <div class="grid gap-3">
        <label for="id_genero" class="text-sm font-medium">Género</label>
        <input z-input formControlName="id_genero" id="id_genero" />
      </div>

      <div class="grid gap-3 col-span-2">
        <label for="descripcion" class="text-sm font-medium">Descripción</label>
        <textarea z-input formControlName="descripcion" id="descripcion" rows="3"></textarea>
      </div>

      <div class="grid gap-3">
        <label for="latitud" class="text-sm font-medium">Latitud</label>
        <input z-input type="number" formControlName="latitud" id="latitud" />
      </div>

      <div class="grid gap-3">
        <label for="longitud" class="text-sm font-medium">Longitud</label>
        <input z-input type="number" formControlName="longitud" id="longitud" />
      </div>

      <div class="grid gap-3">
        <label for="precio" class="text-sm font-medium">Precio</label>
        <input z-input type="number" formControlName="precio" id="precio" />
      </div>

      <div class="grid gap-3">
        <label for="aforo" class="text-sm font-medium">Aforo</label>
        <input z-input type="number" formControlName="aforo" id="aforo" />
      </div>

      <div class="grid gap-3">
        <label for="duracion" class="text-sm font-medium">Duración (h)</label>
        <input z-input type="number" formControlName="duracion" id="duracion" />
      </div>

      <div class="grid gap-3 col-span-2">
        <label for="imagenArtista" class="text-sm font-medium">URL Imagen Artista</label>
        <input z-input formControlName="imagenArtista" id="imagenArtista" />
      </div>
    </form>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddConcierto implements OnInit {

  selectedDate = signal<Date | null>(null);
  selectedDateFormatted = signal<string>('');

  form = new FormGroup({
    nombre: new FormControl('', Validators.required),
    artista: new FormControl('', Validators.required),
    lugar: new FormControl('', Validators.required),
    ciudad: new FormControl('', Validators.required),
    fecha: new FormControl('', Validators.required),
    id_genero: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    latitud: new FormControl(0, Validators.required),
    longitud: new FormControl(0, Validators.required),
    precio: new FormControl(0, [Validators.required, Validators.min(0)]),
    aforo: new FormControl(0, [Validators.required, Validators.min(1)]),
    duracion: new FormControl(0, [Validators.required, Validators.min(1)]),
    imagenArtista: new FormControl('', Validators.required)
  });

  ngOnInit() {
    // Inicializar valores por defecto si es necesario
  }

  onDateChange(date: Date | null) {
    this.selectedDate.set(date);
    if (date) {
      // Convertir a string ISO para el formulario
      this.form.get('fecha')?.setValue(date.toISOString());
    }
  }

  onDateInputChange(event: any) {
    const dateValue = event.target.value;
    if (dateValue) {
      const date = new Date(dateValue);
      this.selectedDate.set(date);
      this.form.get('fecha')?.setValue(date.toISOString());
      
      // Formatear fecha para mostrar
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      this.selectedDateFormatted.set(date.toLocaleDateString('es-ES', options));
    }
  }

}
