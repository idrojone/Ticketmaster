import { Component, inject, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenerosAdminService } from 'src/app/core/services/DashboardAdmin/GenerosAdmin.service';
import { GeneroAdmin } from 'src/app/core/models/dashboard-admin/GenerosAdmin.model';
import { ZardDialogService } from '@shared/components/dialog/dialog.service';
import { GenerosEditDialogComponent } from '@shared/generos-edit-dialog/generos-edit-dialog.component';
import { AddGenero } from '@shared/add-genero/add-genero';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-generos',
  templateUrl: './generos.html',
  styleUrl: './generos.css',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardGeneros {
  public IsLoading = signal(false);
  public GeneroAdmin = signal([] as GeneroAdmin[]);

  private GenerosAdminService = inject(GenerosAdminService);
  private dialogService = inject(ZardDialogService);

  constructor() {
    this.LoadGeneros();
  }

  private LoadGeneros() {
    this.GenerosAdminService.GetAllGenerosAdmin().subscribe({
      next: (data) => {
        this.GeneroAdmin.set(data);
        console.log('GenerosAdmin:', data);
        this.IsLoading.set(true);
      },
      error: (error) => {
        console.error('Error loading GenerosAdmin:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los géneros. Inténtalo de nuevo más tarde.'
        })
      }
    });       
  }

  // Abrir dialog para editar
  openEditDialog(genero: GeneroAdmin) {
    this.dialogService.create({
      zTitle: 'Editar Género',
      zDescription: 'Realiza cambios a los detalles del género.',
      zContent: GenerosEditDialogComponent,
      zData: { ...genero },
      zOkText: 'Guardar Cambios',
      zOnOk: (instance: any) => {
        const formData = instance.form?.value;
        if (formData) {
          this.updateGenero({ ...genero, ...formData });
        }
      },
      zWidth: '500px'
    });
  }

  openAddDialog(){
    this.dialogService.create({
      zTitle: 'Añadir Género',
      zDescription: 'Crea un nuevo género',
      zContent: AddGenero,
      zOkText: 'Crear',
      zOnOk: (instance: any) => {
        const formData = instance.form?.value;
        console.log('Formulario de nuevo género:', formData);
        if (formData) {
          this.GenerosAdminService.PostGeneroAdmin(formData).subscribe({
            next: (data) => {
              console.log('Género creado:', data);
              this.LoadGeneros();
              Swal.fire('Éxito', 'Género creado correctamente.', 'success');
            },
            error: (error) => {
              console.error('Error creando género:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo crear el género. Inténtalo de nuevo más tarde.'
              })
            }
          });
        }
      },
      zWidth: '500px',
    });
  }

  private updateGenero(genero: GeneroAdmin) {
    this.GenerosAdminService.PutGeneroAdmin(genero.slug, genero).subscribe({
      next: (data) => {
        console.log('Género actualizado:', data);
        this.LoadGeneros();
        Swal.fire('Éxito', 'Género actualizado correctamente.', 'success');
      },
      error: (error) => {
        console.error('Error actualizando género:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo actualizar el género. Inténtalo de nuevo más tarde.'
        });
      }
    });
  }   

  updateStatus(status : string, genero: GeneroAdmin) {
    this.GenerosAdminService.PatchGeneroStatus(genero.slug, status).subscribe({
      next: (data) => {
        console.log('Estado actualizado:', data);
        this.LoadGeneros();
        Swal.fire('Éxito', 'Estado actualizado correctamente.', 'success');
      },
      error: (error) => {
        console.error('Error actualizando estado:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo actualizar el estado. Inténtalo de nuevo más tarde.'
        });
      }
    });
  }

  toggleActivate(genero: GeneroAdmin) {
    const isActivate = genero.is_active;
    const newActiveState = !isActivate;

    this.GenerosAdminService.PatchGeneroActivate(genero.slug, newActiveState).subscribe({
      next: (data) => {
        console.log('Activación actualizada:', data);
        this.LoadGeneros();
        Swal.fire('Éxito', `El género ha sido ${newActiveState ? 'activado' : 'desactivado'}.`, 'success');
      },
      error: (error) => {
        console.error('Error actualizando activación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo actualizar la activación. Inténtalo de nuevo más tarde.'
        });
      }
    });
  }

  deleteGenero(genero: GeneroAdmin) {
    this.GenerosAdminService.DeleteGeneroAdmin(genero.slug).subscribe({
      next: (data) => {
        console.log('Género eliminado:', data);
        this.LoadGeneros();
        Swal.fire('Éxito', 'Género eliminado correctamente.', 'success');
      },
      error: (error) => {
        console.error('Error eliminando género:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo eliminar el género. Inténtalo de nuevo más tarde.'
        });
      }
    });
  }
}
