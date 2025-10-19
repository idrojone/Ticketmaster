import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, signal } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { Subject } from 'rxjs';
import { AuthRoutingModule } from "../auth/auth-routing.module";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ZardButtonComponent } from '@shared/components/button/button.component';

// Tipo para las tabs disponibles
type TabType = 'favorites' | 'history' | 'reviews';

@Component({
  selector: 'app-profile',
  imports: [
    ZardButtonComponent,
    AuthRoutingModule,
    RouterLink
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  standalone: true
})
export class Profile implements OnInit, OnDestroy {
  
  // Usario llenado
  public usuario= signal<User | null>(null);

  //Usuario de la ruta
  public username= signal<string | null>(null);

  //Test
  public perfil= signal<Profile | null>(null);

  public editable= signal<boolean>(false);
  public isLoading= signal(true);
  public encontrarUsuario= signal<boolean>(false);


  private userService = inject(UserService);
  private activatedRoute = inject(ActivatedRoute);

  //pendiente ver el destroy
  private destroy$ = new Subject<void>();

  // Signal para manejar el tab activo
  activeTab = signal<TabType>('favorites');

  constructor() {
    this._loadUser();
  }

  ngOnInit() {

  }

  private _loadUser(): void {
    this.isLoading.set(true);

    // Pillamos el usuario desde la ruta
    this.username.set(this.activatedRoute.snapshot.paramMap.get('username'));

    //si no hay username en la ruta, no encontramos usuario
    if (this.username() === null) {
      this.encontrarUsuario.set(true);
      this.isLoading.set(false);
      return;
    }

    //Toca comprobar si el usuario logeado es el mismo que el del perfil
    if (this.userService.getCurrentUser()?.username === this.username()) {
      //true para editar el perfil
      this.editable.set(true);
    }


    //Cargamos el perfil del usuario desde la ruta
    this.userService.getUserProfile(this.username()).subscribe({
      next: (user) => {
        this.usuario.set(user);
        this.isLoading.set(false);
        console.log('✅ Usuario cargado:', user);
      },
      error: (error) => {
        console.error('❌ Error al cargar el perfil:', error);
        this.encontrarUsuario.set(true);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Cambia el tab activo (preparado para implementación futura)
   */
  changeTab(tab: TabType): void {
    this.activeTab.set(tab);
    console.log(`📑 Tab changed to: ${tab}`);
  }

  // hook en angular que se ejecuta en el momento antes de que el componente se destruya
  ngOnDestroy() {
    // this.destroy$.next(); 
    // this.destroy$.complete();
  }

}
