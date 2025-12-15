import { Component, inject, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MerchandisingEmpresaService } from 'src/app/core/services/DashboardEmpresa/MerchandisingEmpresa.service';
import { Merchandising } from 'src/app/core/models/dashboard-empresa/Merchandising.model';
import { ZardDialogService } from '@shared/components/dialog/dialog.service';
import { MerchandisingEditDialogComponent } from '@shared/merchandising-edit-dialog/merchandising-edit-dialog.component';
import { AddMerchandising } from '@shared/add-merchandising/add-merchandising';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-merchandising-empresa',
  templateUrl: './merchandising-empresa.html',
  styleUrl: './merchandising-empresa.css',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MerchandisingEmpresa implements OnInit {
  private merchandisingService = inject(MerchandisingEmpresaService);
  private dialogService = inject(ZardDialogService);
  
  merchandising = signal<Merchandising[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.loadMerchandising();
  }

  loadMerchandising(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    
    this.merchandisingService.GetAllMerchandisingEmpresa().subscribe({
      next: (data) => {
        this.merchandising.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Error al cargar el merchandising');
        this.isLoading.set(false);
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Hubo un error al cargar el merchandising.',
        });
      }
    });
  }

  openAddDialog() {
    this.dialogService.create({
      zTitle: 'Añadir Producto',
      zDescription: 'Crea un nuevo producto de merchandising',
      zContent: AddMerchandising,
      zOkText: 'Crear',
      zOnOk: (instance: any) => {
        const formData = instance.form?.value;
        if (formData) {
          this.merchandisingService.PostMerchandisingEmpresa(formData).subscribe({
            next: (data) => {
              console.log('Producto creado:', data);
              this.loadMerchandising();
              Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'El producto ha sido creado exitosamente.',
              });
            },
            error: (error) => {
              this.errorMessage.set('Error al crear el producto');
              console.error('Error:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Hubo un error al crear el producto.',
              });
            }
          });
        }
      },
      zWidth: '500px'
    });
  }

  openEditDialog(producto: Merchandising) {
    this.dialogService.create({
      zTitle: 'Editar Producto',
      zDescription: 'Realiza cambios a los detalles del producto.',
      zContent: MerchandisingEditDialogComponent,
      zData: { ...producto },
      zOkText: 'Guardar Cambios',
      zOnOk: (instance: any) => {
        const formData = instance.form?.value;
        if (formData) {
          this.updateMerchandising({ ...producto, ...formData });
        }
      },
      zWidth: '500px'
    });
  }

  private updateMerchandising(producto: Merchandising) {
    this.merchandisingService.PutMerchandisingEmpresa(producto.id, producto).subscribe({
      next: (data) => {
        console.log('Producto actualizado:', data);
        this.loadMerchandising();
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'El producto ha sido actualizado exitosamente.',
        });
      },
      error: (error) => {
        this.errorMessage.set('Error al actualizar el producto');
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Hubo un error al actualizar el producto.',
        });
      }
    });
  }

  deleteMerchandising(id: string): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.merchandisingService.DeleteMerchandisingEmpresa(id).subscribe({
        next: () => {
          this.loadMerchandising();
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'El producto ha sido eliminado exitosamente.',
          });
        },
        error: (error) => {
          this.errorMessage.set('Error al eliminar el producto');
          console.error('Error:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Hubo un error al eliminar el producto.',
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
    
    this.merchandisingService.PatchMerchandisingStatus(id, newStatus).subscribe({
      next: () => {
        this.loadMerchandising();
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: `El estado del producto ha sido cambiado a ${newStatus}.`,
        });
      },
      error: (error) => {
        this.errorMessage.set('Error al cambiar el estado');
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Hubo un error al cambiar el estado.',
        });
      }
    });
  }

  toggleActivate(id: string, currentActive: boolean): void {
    this.merchandisingService.PatchMerchandisingActivate(id, !currentActive).subscribe({
      next: () => {
        this.loadMerchandising();
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: `El producto ha sido ${!currentActive ? 'activado' : 'desactivado'} exitosamente.`,
        });
      },
      error: (error) => {
        this.errorMessage.set('Error al activar/desactivar');
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Hubo un error al activar/desactivar el producto.',
        });
      }
    });
  }
}
