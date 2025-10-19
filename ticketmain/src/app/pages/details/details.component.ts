import { Component, OnInit, AfterViewInit, importProvidersFrom, inject, signal, computed } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Carousel } from "@shared/carousel/carousel";
import { Concierto } from "src/app/core/models/conciertos.model";
import { ConciertosService } from "src/app/core/services/conciertos.service";
import { ZardCalendarComponent } from "@shared/components/calendar/calendar.component";
import * as L from 'leaflet';
import { Comment } from "src/app/core/models/comment.model";
import { ArticleComments } from "@shared/article-comments/article-comments";
import { UserService } from "src/app/core/services/user.service";
import { ProfileService } from "src/app/core/services/profile.service";
import Swal from 'sweetalert2';


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
    private profileService = inject(ProfileService);

    constructor() {
        this.slug = this.route.snapshot.paramMap.get('slug');
        this._loadConcierto();
        // this._loadComments();
    }

    private _loadConcierto():void {
        this.isLoading.set(true);
        this.conciertoService.getConcierto(this.slug!).subscribe({
            next: (concierto) => {
                this.concierto.set(concierto);
                this.isLoading.set(false);
                this._loadMap(concierto);
            },
            error: (error) => {
                console.error('Error loading concierto:', error);
                this.isLoading.set(false);
            }
        });
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
        
        if (!currentUser) {
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

        // this.profileService.toggleFavorite(this.slug!).subscribe({
        //     next: (isFav) => {
        //         this.isFavorite.set(isFav);
        //     },
        //     error: (error) => {
        //         console.error('Error toggling favorite:', error);
        //     }
        // });

        Swal.fire({
            icon: 'success',
            title: this.isFavorite() ? '¡Añadido a favoritos!' : 'Eliminado de favoritos',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
        });
    }

}