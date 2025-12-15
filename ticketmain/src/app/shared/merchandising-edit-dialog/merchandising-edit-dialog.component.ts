import { Component, inject, OnInit, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Z_MODAL_DATA } from '@shared/components/dialog/dialog.service';
import { Merchandising } from 'src/app/core/models/dashboard-empresa/Merchandising.model';
import { CategoriasEmpresaService } from 'src/app/core/services/DashboardEmpresa/CategoriasEmpresa.service';

@Component({
  selector: 'app-merchandising-edit-dialog',
  template: `
    <form [formGroup]="form" class="grid gap-4">
      <div class="grid gap-3">
        <label for="nombre" class="text-sm font-medium">Nombre del Producto</label>
        <input z-input formControlName="nombre" id="nombre" />
      </div>

      <div class="grid gap-3">
        <label for="descripcion" class="text-sm font-medium">Descripción</label>
        <textarea z-input formControlName="descripcion" id="descripcion" rows="4"></textarea>
      </div>

      <div class="grid gap-3">
        <label for="precio" class="text-sm font-medium">Precio (€)</label>
        <input z-input formControlName="precio" id="precio" type="number" step="0.01" min="0" />
      </div>

      <div class="grid gap-3">
        <label for="stock" class="text-sm font-medium">Stock</label>
        <input z-input formControlName="stock" id="stock" type="number" min="0" />
      </div>

      <div class="grid gap-3">
        <label for="categoriaId" class="text-sm font-medium">Categoría</label>
        <select z-input formControlName="categoriaId" id="categoriaId" class="cursor-pointer">
          <option value="">Seleccione una categoría</option>
          @for(categoria of categorias(); track categoria.id) {
            <option [value]="categoria.id">{{ categoria.nombre }}</option>
          }
        </select>
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
export class MerchandisingEditDialogComponent implements OnInit {
  private zData: Merchandising = inject(Z_MODAL_DATA);
  private categoriasService = inject(CategoriasEmpresaService);
  
  categorias = signal<any[]>([]);

  form = new FormGroup({
    nombre: new FormControl(''),
    descripcion: new FormControl(''),
    precio: new FormControl(0),
    stock: new FormControl(0),
    categoriaId: new FormControl(''),
    imagen: new FormControl(''),
    status: new FormControl({ value: 'PENDING', disabled: false }),
    is_active: new FormControl({ value: false, disabled: false })
  });

  ngOnInit() {
    this.loadCategorias();
    
    if (this.zData) {
      this.form.patchValue({
        nombre: this.zData.nombre || '',
        descripcion: this.zData.descripcion || '',
        precio: this.zData.precio || 0,
        stock: this.zData.stock || 0,
        categoriaId: this.zData.categoriaId || '',
        imagen: this.zData.imagen || '',
        status: this.zData.status || 'PENDING',
        is_active: this.zData.is_active || false
      });
    }
  }

  private loadCategorias() {
    this.categoriasService.GetAllCategoriasEmpresa().subscribe({
      next: (categorias) => {
        this.categorias.set(categorias);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }
}
