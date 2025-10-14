import { Component, OnInit, AfterViewInit, importProvidersFrom, inject } from "@angular/core";
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

        
    concierto?: Concierto;
    slug: string | null = null;
    private map?: L.Map;

    private route = inject(ActivatedRoute);
    private conciertoService = inject(ConciertosService);

    get conciertoFecha(): Date | null {
        return this.concierto?.fecha ? new Date(this.concierto.fecha) : null;
    }

    ngOnInit() {
        this.slug = this.route.snapshot.paramMap.get('slug');
        const url = this.route.snapshot.url;
        const tipo = url[1]?.path; 
        console.log('Tipo:', tipo, 'Slug:', this.slug);

        this.loadDetails(tipo);
    }

    ngAfterViewInit() {
        // El mapa se carga ahora después de obtener los datos del concierto
    }

    loadDetails(tipo: string) {
        if (tipo === 'concierto') {
            this.loadConciertoDetails();
        } else if (tipo === 'artista') {
            // Lógica futura para artista
        } 
    }

    loadConciertoDetails() {
        this.conciertoService.getConcierto(this.route.snapshot.paramMap.get('slug')!).pipe(
            catchError((error: any) => {
                console.error('Error fetching concierto data', error);
                return throwError(() => error);
            })
        ).subscribe((concierto: Concierto) => {
            console.log('Concierto data:', concierto);
            this.concierto = concierto;
            // Cargar el mapa después de obtener los datos
            this.loadmap();
        });
    }

    loadmap() {
        this.map = L.map('map').setView([this.concierto?.latitud || 0, this.concierto?.longitud || 0], 13);

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

        if (this.concierto?.latitud && this.concierto?.longitud) {
            L.marker([this.concierto.latitud, this.concierto.longitud], { icon: customIcon })
                .addTo(this.map)
                .bindPopup(this.concierto.nombre || 'Concierto')
                .openPopup();
        }
    }
}