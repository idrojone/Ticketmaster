import { Component, inject, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriasEmpresaService } from 'src/app/core/services/DashboardEmpresa/CategoriasEmpresa.service';
import { CategoriaMerchandising } from 'src/app/core/models/dashboard-empresa/CategoriaMerchandising.model';
import { ZardDialogService } from '@shared/components/dialog/dialog.service';
import { CategoriasEditDialogComponent } from '@shared/categorias-edit-dialog/categorias-edit-dialog.component';
import { AddCategoria } from '@shared/add-categoria/add-categoria';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorias-empresa',
  templateUrl: './categorias-empresa.html',
  styleUrl: './categorias-empresa.css',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoriasEmpresa implements OnInit {
  private categoriasService = inject(CategoriasEmpresaService);
  private dialogService = inject(ZardDialogService);
  
  categorias = signal<CategoriaMerchandising[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    
    this.categoriasService.GetAllCategoriasEmpresa().subscribe({
      next: (data) => {
        this.categorias.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error al cargar las categorías');
        this.isLoading.set(false);
        console.error('Error:', error);
        Swal.fire('Error', 'No se pudieron cargar las categorías. Inténtalo de nuevo más tarde.', 'error');
      }
    });
  }

  openAddDialog() {
    this.dialogService.create({
      zTitle: 'Añadir Categoría',
      zDescription: 'Crea una nueva categoría de merchandising',
      zContent: AddCategoria,
      zOkText: 'Crear',
      zOnOk: (instance: any) => {
        const formData = instance.form?.value;
        if (formData) {
          this.categoriasService.PostCategoriaEmpresa(formData).subscribe({
            next: (data) => {
              console.log('Categoría creada:', data);
              this.loadCategorias();
              Swal.fire('Éxito', 'Categoría creada correctamente.', 'success');
            },
            error: (error) => {
              this.errorMessage.set('Error al crear la categoría');
              console.error('Error:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo crear la categoría. Inténtalo de nuevo más tarde.'
              })
            }
          });
        }
      },
      zWidth: '500px'
    });
  }

  openEditDialog(categoria: CategoriaMerchandising) {
    this.dialogService.create({
      zTitle: 'Editar Categoría',
      zDescription: 'Realiza cambios a los detalles de la categoría.',
      zContent: CategoriasEditDialogComponent,
      zData: { ...categoria },
      zOkText: 'Guardar Cambios',
      zOnOk: (instance: any) => {
        const formData = instance.form?.value;
        if (formData) {
          this.updateCategoria({ ...categoria, ...formData });
        }
      },
      zWidth: '500px'
    });
  }

  private updateCategoria(categoria: CategoriaMerchandising) {
    this.categoriasService.PutCategoriaEmpresa(categoria.id, categoria).subscribe({
      next: (data) => {
        console.log('Categoría actualizada:', data);
        this.loadCategorias();
        Swal.fire('Éxito', 'Categoría actualizada correctamente.', 'success');
      },
      error: (error) => {
        this.errorMessage.set('Error al actualizar la categoría');
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo actualizar la categoría. Inténtalo de nuevo más tarde.'
        });
      }
    });
  }

  deleteCategoria(id: string): void {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoriasService.DeleteCategoriaEmpresa(id).subscribe({
        next: () => {
          this.loadCategorias();
          Swal.fire('Éxito', 'Categoría eliminada correctamente.', 'success');
        },
        error: (error) => {
          this.errorMessage.set('Error al eliminar la categoría');
          console.error('Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'No se pudo eliminar la categoría. Inténtalo de nuevo más tarde.'
          });
        }
      });
    }
  }

  toggleStatus(id: string, currentStatus: string): void {
    let newStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    
    // Ciclo: PENDING -> ACCEPTED -> REJECTED -> PENDING
    if (currentStatus === 'PENDING') {
      newStatus = 'ACCEPTED';
    } else if (currentStatus === 'ACCEPTED') {
      newStatus = 'REJECTED';
    } else {
      newStatus = 'PENDING';
    }
    
    this.categoriasService.PatchCategoriaStatus(id, newStatus).subscribe({
      next: () => {
        this.loadCategorias();
        Swal.fire('Éxito', `El estado de la categoría ha sido cambiado a ${newStatus}.`, 'success');
      },
      error: (error) => {
        this.errorMessage.set('Error al cambiar el estado');
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo cambiar el estado. Inténtalo de nuevo más tarde.'
        });
      }
    });
  }

  toggleActivate(id: string, currentActive: boolean): void {
    this.categoriasService.PatchCategoriaActivate(id, !currentActive).subscribe({
      next: () => {
        this.loadCategorias();
        Swal.fire('Éxito', `La categoría ha sido ${!currentActive ? 'activada' : 'desactivada'}.`, 'success');
      },
      error: (error) => {
        this.errorMessage.set('Error al activar/desactivar');
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo cambiar el estado de activación. Inténtalo de nuevo más tarde.'
        });
      }
    });
  }
}
