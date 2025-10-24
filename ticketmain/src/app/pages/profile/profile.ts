import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, signal } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthRoutingModule } from '../auth/auth-routing.module';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { } from 'src/app/core/models/profile.model';
import { ProfileService } from 'src/app/core/services/profile.service';
import Swal from 'sweetalert2';

// Tipo para las tabs disponibles
type TabType = 'favorites' | 'history' | 'reviews';

@Component({
    selector: 'app-profile',
    imports: [ZardButtonComponent, AuthRoutingModule, RouterLink],
    templateUrl: './profile.html',
    styleUrls: ['./profile.css'],
    standalone: true,
})
export class Profile implements OnInit, OnDestroy {
    // Usario llenado
    public usuario = signal<User | null>(null);

    //Usuario de la ruta
    public username = signal<string | null>(null);

    public following = signal<boolean>(false);

    public editable = signal<boolean>(false);

    public isLoading = signal(true);
    public encontrarUsuario = signal<boolean>(false);

    public followersCount = signal<number>(0);
    public commentsCount = signal<number>(0);

    public comentariosUsuario = signal<Array<any>>([]);
    public likesUsuario = signal<Array<any>>([]);

    private userService = inject(UserService);
    private activatedRoute = inject(ActivatedRoute);
    private profileService = inject(ProfileService);
    private router = inject(Router);

    //pendiente ver el destroy
    private destroy$ = new Subject<void>();

    // Signal para manejar el tab activo
    activeTab = signal<TabType>('favorites');

    slug: string = this.activatedRoute.snapshot.paramMap.get('username')!;

    constructor() {
        this._loadUser();
    }

    ngOnInit() {
        this.loadLikesUsuario();
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
        this.userService
        .getUserProfile(this.username())
        .pipe(takeUntil(this.destroy$)) // ← EVITA MEMORY LEAKS
        .subscribe({
            next: (user) => {
            this.usuario.set(user);
                
                this.isLoading.set(false);
                this._checkFollowingStatus();
                this.followersCount.set(user.followingUsers?.length || 0);
              
                this.countComentarios()
                    .then((count) => {
                        this.commentsCount.set(count);
                    })
                    .catch((err) => {
                        this.commentsCount.set(0);
                    });
            },
            error: (error) => {
                console.error('❌ Error al cargar el perfil:', error);
                this.encontrarUsuario.set(true);
                this.isLoading.set(false);
            },
        });
    }

    _checkFollowingStatus(): void {
        const currentUser = this.userService.getCurrentUser();

        const profileUser = this.usuario();

        // console.log(currentUser, 'usuario actual');
        // console.log(profileUser, 'usuario del perfil');

        if (profileUser?.followingUsers?.includes(currentUser?._id || '')) {
        // console.log('Siguiendo a este usuario');
        this.following.set(true);
        } else {
        // console.log('No siguiendo a este usuario');
        this.following.set(false);
        }
    }

    // Comentarios
    loadComentariosUsuario(): void {
        if (this.userService.getCurrentUser().username === null) {
            return;
        }

        this.profileService
        .getComentariosUsuario(this.slug)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
            next: (comentarios) => {
                console.log('Comentarios del usuario:', comentarios.comentarios);
                this.comentariosUsuario.set(comentarios.comentarios);
            },
            error: (error) => {
            console.error('Error al cargar los comentarios del usuario:', error);
            },
        });
    }

    countComentarios(): Promise<number> {
        return new Promise((resolve, reject) => {
            this.profileService
                .getComentariosUsuario(this.slug)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (comentarios) => {
                        const count = comentarios.comentarios.length;
                        resolve(count);
                    },
                    error: (error) => {
                        console.error('Error al cargar los comentarios del usuario:', error);
                        reject(error);
                    },
                });
        });
    }
    
    // Likes
    loadLikesUsuario(): void {
        this.profileService
        .getLikesUsuario(this.slug)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
            next: (likes) => {
            console.log('Likes del usuario:', likes);
            // Aquí puedes manejar los likes como necesites
            this.likesUsuario.set(likes.likes);
            // console.log(this.likesUsuario(), 'likes signal');
            },
            error: (error) => {
            console.error('Error al cargar los likes del usuario:', error);
            },
        });
    }

    changeTab(tab: TabType): void {
        this.loadLikesUsuario();
        this.activeTab.set(tab);
        // console.log(`📑 Tab changed to: ${tab}`);
        if (tab === 'reviews') {
            this.loadComentariosUsuario();
        } else if (tab === 'favorites') {
            this.loadLikesUsuario();
        }
    }

    toggleFollowUser(): void {
        if (!this.usuario()) {
        // console.log('No hay usuario cargado');
        return;
        }

        if (!this.userService.getCurrentUser().username) {
        Swal.fire({
            icon: 'warning',
            title: 'Acción no permitida',
            text: 'Debes estar logueado para seguir a un usuario',
        }).then(() => {
            const returnUrl = this.router.url;
            this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: returnUrl },
            });
        });
        }

        const usuario = this.usuario()!;

        if (this.following()) {
        // Dejar de seguir
        this.profileService
            .unfollowUser(usuario.username)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
            next: () => {
                // console.log(`Has dejado de seguir a ${usuario.username}`);
                this.following.set(false);
                // Decrementar el contador de seguidores
                this.followersCount.set(this.followersCount() - 1);
            },
            error: (error) => {
                console.error('Error al dejar de seguir:', error);
            },
            });
        } else {
        this.profileService.followUser(usuario.username).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                // console.log(`Has seguido a ${usuario.username}`);
                this.following.set(true);
                // Incrementar el contador de seguidores
                this.followersCount.set(this.followersCount() + 1);
            },
            error: (error) => {
                console.error('Error al seguir:', error);
            },
            });
        }
    }

    verDetallesConcierto(conciertoId: string): void {
        this.router.navigate(['/details/concierto/', conciertoId]);
    }

    // hook en angular que se ejecuta en el momento antes de que el componente se destruya
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
