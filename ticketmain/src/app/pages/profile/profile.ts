import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, signal } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { Subject } from 'rxjs';
import { AuthRoutingModule } from "../auth/auth-routing.module";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import {  } from 'src/app/core/models/profile.model';
import { ProfileService } from 'src/app/core/services/profile.service';

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

  public following= signal<boolean>(false);

  public editable= signal<boolean>(false);
  public isLoading= signal(true);
  public encontrarUsuario= signal<boolean>(false);


  private userService = inject(UserService);
  private activatedRoute = inject(ActivatedRoute);
  private profileService = inject(ProfileService);

  //pendiente ver el destroy
  private destroy$ = new Subject<void>();

  // Signal para manejar el tab activo
  activeTab = signal<TabType>('favorites');

  slug: string = this.activatedRoute.snapshot.paramMap.get('username')!;

  constructor() {
    this._loadUser();
    // this._checkFollowingStatus();

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
        this._checkFollowingStatus();
      },
      error: (error) => {
        console.error('❌ Error al cargar el perfil:', error);
        this.encontrarUsuario.set(true);
        this.isLoading.set(false);
      }
    });
  }

  _checkFollowingStatus(): void {
    const currentUser = this.userService.getCurrentUser();
    
    if (!this.usuario() || !currentUser) {
      this.following.set(false);
      return;
    }

    this.profileService.getProfile(this.username()!).subscribe({
      next: (profileData) => {
        console.log('🔍 Datos del perfil obtenidos para comprobar following:', profileData)

      },
      error: (error) => {
        console.error('❌ Error al obtener datos del perfil para comprobar following:', error);
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

  toggleFollowUser(): void {
    if (!this.usuario()) {
      console.log('No hay usuario cargado');
      return;
    }

    const username = this.usuario()!.username;

    if (this.following()) {
      // Dejar de seguir al usuario
      this.profileService.unfollowUser(username).subscribe({
        next: (profile) => {
          console.log(`Has dejado de seguir a ${username}`);
          // Recargar el estado de following
          this._checkFollowingStatus();
        },
        error: (error) => {
          console.error('Error al dejar de seguir al usuario:', error);
        }
      });
    } else {
      // Seguir al usuario
      this.profileService.followUser(username).subscribe({
        next: (profile) => {
          console.log(`Ahora sigues a ${username}`);
          // Recargar el estado de following
          this._checkFollowingStatus();
        },
        error: (error) => {
          console.error('Error al seguir al usuario:', error);
        }
      });
    }
  }

  // hook en angular que se ejecuta en el momento antes de que el componente se destruya
  ngOnDestroy() {
    // this.destroy$.next(); 
    // this.destroy$.complete();
  }

}
