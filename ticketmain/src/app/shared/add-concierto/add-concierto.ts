import { Component, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PostConciertoAdmin } from 'src/app/core/models/dashboard-admin/ConciertosAdmin.model';
import { ZardDatePickerComponent } from '@shared/components/date-picker/date-picker.component';
import { GenerosAdminService } from 'src/app/core/services/DashboardAdmin/GenerosAdmin.service';


@Component({
  selector: 'app-add-concierto',
  templateUrl: './add-concierto.html',
  styleUrl: './add-concierto.css',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddConcierto implements OnInit {
  public GenerosList = signal<Array<any>>([]);

  private GeneroService = inject(GenerosAdminService);

  constructor() {
    this.GeneroService.GetAllGenerosAdmin().subscribe({
      next: (generos) => {
        this.GenerosList.set(generos);
        console.log("Generos constructor" + generos);
      }
    });

    console.log("Generos NO constructor" + this.GenerosList());
  }

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
