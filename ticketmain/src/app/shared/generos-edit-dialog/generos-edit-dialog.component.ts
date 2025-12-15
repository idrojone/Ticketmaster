import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Z_MODAL_DATA } from '@shared/components/dialog/dialog.service';
import { GeneroAdmin } from 'src/app/core/models/dashboard-admin/GenerosAdmin.model';

@Component({
  selector: 'app-generos-edit-dialog',
  template: `
    <form [formGroup]="form" class="grid gap-4">
      <div class="grid gap-3">
        <label for="name" class="text-sm font-medium">Nombre del Género</label>
        <input z-input formControlName="name" id="name" />
      </div>

      <div class="grid gap-3">
        <label for="description" class="text-sm font-medium">Descripción</label>
        <textarea z-input formControlName="description" id="description" rows="4"></textarea>
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class GenerosEditDialogComponent implements OnInit {
  private zData: GeneroAdmin = inject(Z_MODAL_DATA);

  form = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    status: new FormControl({ value: 'PENDING', disabled: true }),
    is_active: new FormControl({ value: false, disabled: true })
  });

  ngOnInit() {
    if (this.zData) {
      this.form.patchValue({
        name: this.zData.name || '',
        description: this.zData.description || '',
        status: this.zData.status || 'PENDING',
        is_active: this.zData.is_active || false
      });
    }
  }
}
