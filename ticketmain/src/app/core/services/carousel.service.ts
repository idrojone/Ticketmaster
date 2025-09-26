import { inject, Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { map, Observable, tap } from "rxjs";
import { GeneroCarrousel } from "../models/carousel.model";

@Injectable({
    providedIn: 'root'
})
export class CarouselService {
    apiService = inject(ApiService);

    get_carousel_data(): Observable<GeneroCarrousel[]> {
        return this.apiService.get('/api/carousel').pipe(
            // tap(response => console.log('Carousel data fetched:', response)),
            map((response: any) => response.data as GeneroCarrousel[])
        );
    }

}