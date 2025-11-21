import { Component, inject, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConciertosAdminService } from 'src/app/core/services/DashboardAdmin/ConciertosAdmin.service';
import { ConciertoAdmin } from 'src/app/core/models/dashboard-admin/ConciertosAdmin.model';
import { ZardDialogService } from '@shared/components/dialog/dialog.service';
import { ConciertosEditDialogComponent } from '@shared/conciertos-edit-dialog/conciertos-edit-dialog.component';
import { AddConcierto } from '@shared/add-concierto/add-concierto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-conciertos',
  templateUrl: './conciertos.html',
  styleUrl: './conciertos.css',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardConciertos {
  public IsLoading = signal(false);
  public ConciertoAdmin = signal([] as ConciertoAdmin[]);

  private ConciertosAdminService = inject(ConciertosAdminService);
  private dialogService = inject(ZardDialogService);

  constructor() {
    this.LoadConciertos();
  }

  private LoadConciertos() {
    this.ConciertosAdminService.GetAllConciertosAdmin().subscribe({
      next: (data) => {
        this.ConciertoAdmin.set(data);
        console.log('ConciertosAdmin:', data);
        this.IsLoading.set(true);
      },
      error: (error) => {
        console.error('Error loading ConciertosAdmin:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Hubo un error al cargar los conciertos.',
        });
      }
    });       
  }

  // Abrir dialog para editar
  openEditDialog(concierto: ConciertoAdmin) {
    this.dialogService.create({
      zTitle: 'Editar Concierto',
      zDescription: 'Realiza cambios a los detalles del concierto.',
      zContent: ConciertosEditDialogComponent,
      zData: { ...concierto },
      zOkText: 'Guardar Cambios',
      zOnOk: (instance: any) => {
        const formData = instance.form?.value;
        if (formData) {
          this.updateConcierto({ ...concierto, ...formData });
        }
      },
      zWidth: '500px'
    });
  }

  openAddDialog(){
    this.dialogService.create({
      zTitle: 'Añadir Concierto',
      zDescription: 'Crea un nuevo concierto',
      zContent: AddConcierto,
      zOkText: 'Crear',
      zOnOk: (instance: any) => {
        const formData = instance.form?.value;
        if (formData) {
          formData.imagenesShow = [];
          formData.is_active = true;
          formData.status = 'PENDING';
          this.ConciertosAdminService.PostConciertoAdmin(formData).subscribe({
            next: (data) => {
              console.log('Concierto creado:', data);
              Swal.fire({
                icon: 'success',
                title: 'Concierto Creado',
                text: 'El concierto ha sido creado exitosamente.',
              });
              this.LoadConciertos();
            },
            error: (error) => {
              console.error('Error creando concierto:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Hubo un error al crear el concierto.',
              });
            }
          });
        }
      },
      zWidth: '600px',
    });
  }

  private updateConcierto(concierto: ConciertoAdmin) {
    this.ConciertosAdminService.PutConciertoAdmin(concierto.slug, concierto).subscribe({
      next: (data) => {
        console.log('Concierto actualizado:', data);
        Swal.fire({
          icon: 'success',
          title: 'Concierto Actualizado',
          text: 'El concierto ha sido actualizado exitosamente.',
        });
        this.LoadConciertos();
      },
      error: (error) => {
        console.error('Error actualizando concierto:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Hubo un error al actualizar el concierto.',
        });
      }
    });
  }   

  updateStatus(status : string, concierto: ConciertoAdmin) {
    this.ConciertosAdminService.PatchConciertoStatus(concierto.slug, status).subscribe({
      next: (data) => {
        console.log('Estado actualizado:', data);
        Swal.fire({
          icon: 'success',
          title: 'Estado Actualizado',
          text: 'El estado del concierto ha sido actualizado exitosamente.',
        });
        this.LoadConciertos();
      },
      error: (error) => {
        console.error('Error actualizando estado:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Hubo un error al actualizar el estado del concierto.',
        });
      }
    });
  }

  toggleActivate(concierto: ConciertoAdmin) {
    const isActivate = concierto.is_active;
    const newActiveState = !isActivate;

    this.ConciertosAdminService.PatchConciertoActivate(concierto.slug, newActiveState).subscribe({
      next: (data) => {
        console.log('Activación actualizada:', data);
        Swal.fire({
          icon: 'success',
          title: 'Activación Actualizada',
          text: 'La activación del concierto ha sido actualizada exitosamente.',
        });
        this.LoadConciertos();
      },
      error: (error) => {
        console.error('Error actualizando activación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Hubo un error al actualizar la activación del concierto.',
        });
      }
    });
  }
}
