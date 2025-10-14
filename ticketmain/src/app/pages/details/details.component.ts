import { Component, OnInit, AfterViewInit, importProvidersFrom, inject, signal, computed } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Carousel } from "@shared/carousel/carousel";
import { Concierto } from "src/app/core/models/conciertos.model";
import { ConciertosService } from "src/app/core/services/conciertos.service";
import { ZardCalendarComponent } from "@shared/components/calendar/calendar.component";
import * as L from 'leaflet';


@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css'],
    standalone: true,
    imports: [CommonModule, Carousel, ZardCalendarComponent]
})

export class DetailsComponent implements OnInit, AfterViewInit {
    public isLoading= signal(true);
    public concierto=signal<Concierto | null>(null);
    
    // Computed signal para convertir la fecha string a Date
    public conciertoFecha = computed(() => {
        const concierto = this.concierto();
        return concierto?.fecha ? new Date(concierto.fecha) : null;
    });
        
    // concierto?: Concierto;
    slug: string | null = null;
    private map?: L.Map;

    private route = inject(ActivatedRoute);
    private conciertoService = inject(ConciertosService);

    constructor() {
        this.slug = this.route.snapshot.paramMap.get('slug');
        this._loadConcierto();
        // this._loadMap();
    }

    // get conciertoFecha(): Date | null {
    //     return this.concierto?.fecha ? new Date(this.concierto.fecha) : null;
    // }

    ngOnInit() {
        // this.slug = this.route.snapshot.paramMap.get('slug');
        // const url = this.route.snapshot.url;
        // const tipo = url[1]?.path; 
        // console.log('Tipo:', tipo, 'Slug:', this.slug);

        // this.loadDetails(tipo);
    }

    ngAfterViewInit() {
        // El mapa se carga ahora después de obtener los datos del concierto
    }

    // loadDetails(tipo: string) {
    //     if (tipo === 'concierto') {
    //         this.loadConciertoDetails();
    //     } else if (tipo === 'artista') {
    //         // Lógica futura para artista
    //     } 
    // }

    // loadConciertoDetails() {
    //     this.conciertoService.getConcierto(this.route.snapshot.paramMap.get('slug')!).pipe(
    //         catchError((error: any) => {
    //             console.error('Error fetching concierto data', error);
    //             return throwError(() => error);
    //         })
    //     ).subscribe((concierto: Concierto) => {
    //         console.log('Concierto data:', concierto);
    //         this.concierto.set(concierto);
    //         // Cargar el mapa después de obtener los datos
    //         this.loadmap();
    //     });
    // }

    // loadmap() {
    //     const concierto = this.concierto();
    //     if (!concierto) return;

    //     this.map = L.map('map').setView([concierto.latitud || 0, concierto.longitud || 0], 13);

    //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //     }).addTo(this.map);

    //     const customIcon = L.icon({
    //         iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    //         shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    //         iconSize: [25, 41],
    //         iconAnchor: [12, 41],
    //         popupAnchor: [1, -34],
    //         shadowSize: [41, 41]
    //     });

    //     if (concierto.latitud && concierto.longitud) {
    //         L.marker([concierto.latitud, concierto.longitud], { icon: customIcon })
    //             .addTo(this.map)
    //             .bindPopup(concierto.nombre || 'Concierto')
    //             .openPopup();
    //     }
    // }

    private _loadConcierto():void {
        this.isLoading.set(true);
        this.conciertoService.getConcierto(this.slug!).subscribe({
            next: (concierto) => {
                this.concierto.set(concierto);
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Error loading concierto:', error);
                this.isLoading.set(false);
            }
        });
        this._loadMap(this.concierto());
    }

    private _loadMap(manel):void {
        console.log('Cargando mapa...');
        console.log('Concierto actual para el mapa:', this.concierto());
        const concierto = this.concierto();
        if (!concierto) return;

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
    }
}