import { Component, OnInit, AfterViewInit, importProvidersFrom, inject, signal, computed } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Carousel } from "@shared/carousel/carousel";
import { Concierto } from "src/app/core/models/conciertos.model";
import { ConciertosService } from "src/app/core/services/UserServices/conciertos.service";
import { ZardCalendarComponent } from "@shared/components/calendar/calendar.component";
import * as L from 'leaflet';
import { Comment } from "src/app/core/models/comment.model";
import { ArticleComments } from "@shared/article-comments/article-comments";
import { UserService } from "src/app/core/services/user.service";
import { ProfileService } from "src/app/core/services/profile.service";
import Swal from 'sweetalert2';
import { CartService } from "src/app/core/services/cart.service";
import { DialogMerchComponent } from "@shared/dialog-merch/dialog-merch.component";


@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css'],
    standalone: true,
    imports: [CommonModule, 
              Carousel, 
              ZardCalendarComponent,
              ArticleComments]
})

export class DetailsComponent {
    public isLoading= signal(true);
    public concierto=signal<Concierto | null>(null);
    public conciertoFecha = computed(() => {
        const concierto = this.concierto();
        return concierto?.fecha ? new Date(concierto.fecha) : null;
    });

    public loadingComentarios = signal(true);
    public comentarios = signal<Comment | null>(null);
    public hayComentarios = signal(false);
    public isFavorite = signal(false);
        
    slug: string | null = null;
    private map?: L.Map;

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private conciertoService = inject(ConciertosService);
    private userService = inject(UserService);
    private cartService = inject(CartService);

    constructor() {
        this.slug = this.route.snapshot.paramMap.get('slug');
        this._loadConcierto();
    }

    private _loadConcierto():void {
        this.isLoading.set(true);
        this.conciertoService.getConcierto(this.slug!).subscribe({
            next: (concierto) => {
                this.concierto.set(concierto);
                this.isLoading.set(false);
                this._loadMap(concierto);
                this._loadLikeStatus();
            },
            error: (error) => {
                console.error('Error loading concierto:', error);
                this.isLoading.set(false);
            }
        });
    }
    
    private _loadLikeStatus() {
        const currentUser = this.userService.getCurrentUser();
        const currentConcierto = this.concierto();

        console.log("Concierto ID: " + currentConcierto?._id);
        console.log('Usuario actual:', currentUser);
        console.log('Concierto actual:', currentConcierto);

        // Verificar que el usuario exista, no esté vacío y tenga el array de favoritos
        if (currentUser && 
            Object.keys(currentUser).length > 0 && 
            currentUser.username &&
            currentConcierto && 
            currentUser.favouriteConciertos?.includes(currentConcierto.slug || '')) {
            this.isFavorite.set(true);
        } else {
            this.isFavorite.set(false);
        }
    }

    private _loadMap(concierto: Concierto): void {
        console.log('Cargando mapa...');
        console.log('Concierto actual para el mapa:', this.concierto());
        console.log('Concierto recibido para el mapa:', concierto);
        if (!concierto) return;


        setTimeout(() => {
            if (this.map) {
                this.map.remove(); 
            }

            this.map = L.map('map').setView([concierto.latitud || 0, concierto.longitud || 0], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);

            const customIcon = L.icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            if (concierto.latitud && concierto.longitud) {
                L.marker([concierto.latitud, concierto.longitud], { icon: customIcon })
                    .addTo(this.map)
                    .bindPopup(concierto.nombre || 'Concierto')
                    .openPopup();
            }
        }, 100);
    }

    toggleFavorite(): void {
        const currentUser = this.userService.getCurrentUser();

        console.log('Usuario actual al togglear favorito:', currentUser);

        // Verificar si el usuario no existe, es null, undefined o está vacío
        if (!currentUser || Object.keys(currentUser).length === 0 || !currentUser.username) {
            Swal.fire({
                icon: 'warning',
                title: 'Debes iniciar sesión',
                text: 'Para añadir conciertos a tus favoritos, primero debes iniciar sesión',
                confirmButtonText: 'Ir a login',
                showCancelButton: true,
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    const returnUrl = this.router.url;
                    this.router.navigate(['/auth/login'], { 
                        queryParams: { returnUrl: returnUrl } 
                    });
                }
            });
            return;
        }

        if (this.isFavorite()) {
            this.conciertoService.unlikeConcierto(this.slug!).subscribe({
                next: () => {
                    this.isFavorite.set(false);
                },
                error: (error) => {
                    console.error('Error toggling favorite status:', error);
                }
            });
        } else {
            this.conciertoService.likeConcierto(this.slug!).subscribe({
                next: () => {
                    this.isFavorite.set(true);
                },
                error: (error) => {
                    console.error('Error toggling favorite status:', error);
                }
            });
        }

        Swal.fire({
            icon: 'success',
            title: this.isFavorite() ? '¡Elimimado de favoritos!' : 'Añadido a favoritos',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
        });
    }

    async anadirCarrito(): Promise<void> {
        console.log("Añadiendo al carrito");
        this.cartService.carritoMaster(
            [
                {
                    "slug": this.slug!,
                    "cantidad": 1
                }
            ]
        ).subscribe({
            next: (res) => {
                console.log(res);
                Swal.fire({
                    icon: 'success',
                    title: '¡Concierto añadido al carrito!',
                    text: '¿Quieres seguir comprando o ir al carrito?',
                    showCancelButton: true,
                    confirmButtonText: 'Ir al carrito',
                    cancelButtonText: 'Seguir comprando'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.router.navigate(['/cart']);
                    } else {
                        this.router.navigate(['/shop']);
                    }
                });
            },
            error: (err) => {
                console.log(err);
            }
        })
    }

    async dialogMerch() {
        // const dialogRef = this.dialogService.openDialog(DialogMerchComponent);
        // const result = await dialogRef.afterClosed().toPromise();
    }

}