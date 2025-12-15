import { Component, inject, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Z_MODAL_DATA } from '@shared/components/dialog/dialog.service';
import { CategoriaMerchandising } from 'src/app/core/models/dashboard-empresa/CategoriaMerchandising.model';

@Component({
  selector: 'app-categorias-edit-dialog',
  template: `
    <form [formGroup]="form" class="grid gap-4">
      <div class="grid gap-3">
        <label for="nombre" class="text-sm font-medium">Nombre de la Categoría</label>
        <input z-input formControlName="nombre" id="nombre" />
      </div>

      <div class="grid gap-3">
        <label for="descripcion" class="text-sm font-medium">Descripción</label>
        <textarea z-input formControlName="descripcion" id="descripcion" rows="4"></textarea>
      </div>

      <div class="grid gap-3">
        <label for="imagen" class="text-sm font-medium">URL de Imagen</label>
        <input z-input formControlName="imagen" id="imagen" type="url" />
      </div>

      <div class="grid gap-3">
        <label for="status" class="text-sm font-medium">Estado</label>
        <select z-input formControlName="status" id="status" class="cursor-pointer">
          <option value="PENDING">Pendiente</option>
          <option value="ACCEPTED">Aceptado</option>
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoriasEditDialogComponent implements OnInit {
  private zData: CategoriaMerchandising = inject(Z_MODAL_DATA);

  form = new FormGroup({
    nombre: new FormControl(''),
    descripcion: new FormControl(''),
    imagen: new FormControl(''),
    status: new FormControl({ value: 'PENDING', disabled: false }),
    is_active: new FormControl({ value: false, disabled: false })
  });

  ngOnInit() {
    if (this.zData) {
      this.form.patchValue({
        nombre: this.zData.nombre || '',
        descripcion: this.zData.descripcion || '',
        imagen: this.zData.imagen || '',
        status: this.zData.status || 'PENDING',
        is_active: this.zData.is_active || false
      });
    }
  }
}
