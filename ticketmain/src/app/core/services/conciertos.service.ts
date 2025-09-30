import { inject, Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { map, Observable, tap } from "rxjs";
import { Concierto } from "../models/conciertos.model";

@Injectable({
    providedIn: 'root'
})
export class ConciertosService {
    apiService = inject(ApiService);
    get_all_conciertos(params: any): Observable<Concierto[]> {
        return this.apiService.get('/api/conciertos', params  ).pipe(
            tap((data) => console.log(data)),
            map((response: any) => response as Concierto[])
        );
    }

    getConcierto(slug: string): Observable<Concierto> {
        return this.apiService.get(`/api/conciertos/${slug}`).pipe(
            tap((data) => console.log(data)),
            map((response: any) => response as Concierto)
        );
    }

}