import { inject, Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { map, Observable, tap } from "rxjs";
import { GeneroCarrousel } from "../models/carousel.model";
import { ConciertoCarrousel } from "../models/carousel.model";

@Injectable({
    providedIn: 'root'
})
export class CarouselService {
    apiService = inject(ApiService);

    get_carousel_data(): Observable<GeneroCarrousel[]> {
        return this.apiService.get('/api/carousel/generos').pipe(
            tap(response => console.log('Carousel data fetched:', response)),
            map((response: any) => response.generos as GeneroCarrousel[])
        );
    }

    get_carousel_conciertos(): Observable<ConciertoCarrousel[]> {
        return this.apiService.get('/api/carousel/conciertos').pipe(
            // tap(response => console.log('Carousel conciertos data fetched:', response)),
            map((response: any) => response.conciertos as ConciertoCarrousel[])
        );
    }

}