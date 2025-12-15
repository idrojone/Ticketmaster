import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Z_MODAL_DATA } from '@shared/components/dialog/dialog.service';
import { ConciertoAdmin } from 'src/app/core/models/dashboard-admin/ConciertosAdmin.model';
import { GenerosAdminService } from 'src/app/core/services/DashboardAdmin/GenerosAdmin.service';

@Component({
  selector: 'app-conciertos-edit-dialog',
  template: `
    <form [formGroup]="form" class="grid gap-4">
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
        <label for="id_genero" class="text-sm font-medium">Género</label>
        <select z-input formControlName="id_genero" id="id_genero">
          <option value="" disabled>Seleccione un género</option>
          <option *ngFor="let genero of GenerosList()" [value]="genero.id_genero">{{ genero.name }}</option>
        </select>
      </div>

      <div class="grid gap-3">
        <label for="descripcion" class="text-sm font-medium">Descripción</label>
        <textarea z-input formControlName="descripcion" id="descripcion" rows="3"></textarea>
      </div>

      <div class="grid grid-cols-3 gap-3">
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
      </div>

      <div class="grid gap-3">
        <label for="status" class="text-sm font-medium">Estado</label>
        <select z-input formControlName="status" id="status" class="cursor-pointer">
          <option value="PENDING">Pendiente</option>
          <option value="APPROVED">Aprobado</option>
          <option value="REJECTED">Rechazado</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <input z-input type="checkbox" formControlName="is_active" id="is_active" />
        <label for="is_active" class="text-sm font-medium cursor-pointer">Activo</label>
      </div>
    </form>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ConciertosEditDialogComponent implements OnInit {
  private zData: ConciertoAdmin = inject(Z_MODAL_DATA);
  private GeneroService = inject(GenerosAdminService);
  public GenerosList = signal<Array<any>>([]);

  form = new FormGroup({
    nombre: new FormControl(''),
    artista: new FormControl(''),
    lugar: new FormControl(''),
    ciudad: new FormControl(''),
    id_genero: new FormControl(''),
    descripcion: new FormControl(''),
    precio: new FormControl(0),
    aforo: new FormControl(0),
    duracion: new FormControl(0),
    status: new FormControl({ value: 'PENDING', disabled: true }),
    is_active: new FormControl({ value: false, disabled: true })
  });

  constructor() {
    this.GeneroService.GetAllGenerosAdmin().subscribe({
      next: (generos) => {
        this.GenerosList.set(generos);
        console.log("Géneros cargados:", generos);
      }
    });
  }

  ngOnInit() {
    if (this.zData) {
      this.form.patchValue({
        nombre: this.zData.nombre || '',
        artista: this.zData.artista || '',
        lugar: this.zData.lugar || '',
        ciudad: this.zData.ciudad || '',
        id_genero: this.zData.id_genero || '',
        descripcion: this.zData.descripcion || '',
        precio: this.zData.precio || 0,
        aforo: this.zData.aforo || 0,
        duracion: this.zData.duracion || 0,
        status: this.zData.status || 'PENDING',
        is_active: this.zData.is_active || false
      });
    }
  }
}


