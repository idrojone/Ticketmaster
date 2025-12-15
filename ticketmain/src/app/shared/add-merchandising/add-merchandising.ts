import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriasEmpresaService } from 'src/app/core/services/DashboardEmpresa/CategoriasEmpresa.service';

@Component({
  selector: 'app-add-merchandising',
  template: `
    <form [formGroup]="form" class="grid gap-6">
      <div class="grid gap-3">
        <label for="nombre" class="text-sm font-medium">Nombre del Producto</label>
        <input z-input formControlName="nombre" id="nombre" />
      </div>

      <div class="grid gap-3 col-span-2">
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
        <label for="imagen" class="text-sm font-medium">URL de Imagen (opcional)</label>
        <input z-input formControlName="imagen" id="imagen" type="url" />
      </div>
    </form>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddMerchandising implements OnInit {
  private categoriasService = inject(CategoriasEmpresaService);
  categorias = signal<any[]>([]);

  form = new FormGroup({
    nombre: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    precio: new FormControl(0, [Validators.required, Validators.min(0)]),
    stock: new FormControl(0, [Validators.required, Validators.min(0)]),
    categoriaId: new FormControl('', Validators.required),
    imagen: new FormControl('')
  });

  ngOnInit() {
    this.loadCategorias();
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
