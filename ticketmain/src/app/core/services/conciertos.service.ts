import { inject, Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { map, Observable, tap } from "rxjs";
import { Concierto } from "../models/conciertos.model";

@Injectable({
    providedIn: 'root'
})
export class ConciertosService {
    apiService = inject(ApiService);

    get_all_conciertos(): Observable<Concierto[]> {
        return this.apiService.get('/api/conciertos').pipe(
            tap((data) => console.log(data)),
            map((response: any) => response as Concierto[])
        );
    }

}