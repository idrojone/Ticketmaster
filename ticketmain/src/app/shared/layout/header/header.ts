import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { AuthRoutingModule } from "src/app/pages/auth/auth-routing.module";
import { ZardDividerComponent } from '../../components/divider/divider.component';
import { ZardDropdownModule } from '../../components/dropdown/dropdown.module';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-header',
  imports: [
    AuthRoutingModule,
    RouterLink,
    ZardDropdownModule,
    ZardDividerComponent
],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true
})
export class Header implements OnInit {

  private userService = inject(UserService);
  private cd = inject(ChangeDetectorRef);
  private router = inject(Router); 

  currentUser?: User;
  loggedIn: boolean = false;


  ngOnInit() {
    // Llamar populate() solo UNA VEZ al inicio
    this.userService.populate();

    // Suscribirse a los cambios del usuario
    this.userService.currentUser.subscribe(
      (userData) => {
        if (userData && Object.keys(userData).length > 0) {
          this.currentUser = userData;
          this.loggedIn = true;
        } else {
          this.currentUser = undefined;
          this.loggedIn = false;
        }
        this.cd.markForCheck();
      }
    );
  }

  logout() {
    this.userService.purgeAuth();
    this.router.navigateByUrl('/');
    // Mostrar mensaje de éxito con SweetAlert2
    Swal.fire({
      icon: 'success',
      title: '¡Cierre de sesión exitoso!',
      text: 'Has cerrado sesión correctamente.',
      confirmButtonText: 'Continuar'
    });
  }

}
