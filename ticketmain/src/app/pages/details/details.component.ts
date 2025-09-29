import { Component, OnInit, importProvidersFrom, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Carousel } from "@shared/carousel/carousel";
import { Concierto } from "src/app/core/models/conciertos.model";
import { ConciertosService } from "src/app/core/services/conciertos.service";
import { ZardCalendarComponent } from "@shared/components/calendar/calendar.component";


@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css'],
    standalone: true,
    imports: [Carousel, ZardCalendarComponent]
})

export class DetailsComponent  implements OnInit {

    concierto?: Concierto;
    slug: string | null = null;

    private route = inject(ActivatedRoute);
    private conciertoService = inject(ConciertosService);

    ngOnInit() {
        this.slug = this.route.snapshot.paramMap.get('slug');
        const url = this.route.snapshot.url;
        const tipo = url[1]?.path; 
        console.log('Tipo:', tipo, 'Slug:', this.slug);

        this.loadDetails(tipo);
    }

    loadDetails(tipo: string) {
        if (tipo === 'concierto') {
            this.loadConciertoDetails();
        } else if (tipo === 'festival') {
            // Lógica futura para festivales
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
        });
    }
       
}