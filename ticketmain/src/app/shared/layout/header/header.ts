import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { AuthRoutingModule } from "src/app/pages/auth/auth-routing.module";
import { ZardDividerComponent } from '../../components/divider/divider.component';
import { ZardDropdownModule } from '../../components/dropdown/dropdown.module';
import Swal from 'sweetalert2';
import { UserTypeService } from 'src/app/core/services/user-type.service';


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

  public user_type_signal = signal<string>('USER');
  private user_type= inject(UserTypeService);

  private userService = inject(UserService);
  private cd = inject(ChangeDetectorRef);
  private router = inject(Router);

  currentUser?: User;
  loggedIn: boolean = false;

  constructor(){
    this.load_type();
  }


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
    this.user_type.clearUserType();
    // Mostrar mensaje de éxito con SweetAlert2
    Swal.fire({
      icon: 'success',
      title: '¡Cierre de sesión exitoso!',
      text: 'Has cerrado sesión correctamente.',
      confirmButtonText: 'Continuar'
    });
  }

  private load_type():void {
    this.user_type.userType$.subscribe({
      next: (type) => {
        console.log('Tipo de usuario en header:', type);
        if (type === 'admin') {
          this.user_type_signal.set('admin');
          console.log("El signal esta actualmente " + this.user_type_signal());
        }else if (type === null || type === "USER") {
          this.user_type_signal.set('USER');
          console.log("El signal esta actualmente " + this.user_type_signal());
        } else if (type === 'empresa') {
          this.user_type_signal.set('empresa');
          console.log("El signal esta actualmente " + this.user_type_signal());
        }
      }
    });
  }

}
