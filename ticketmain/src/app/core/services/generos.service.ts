import { inject, Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from "./api.service";
import { map, Observable } from "rxjs";
import { Genero } from "../models/generos.model";

@Injectable({
    providedIn: 'root'
})
export class GenerosService {
    http = inject(HttpClient);
    apiService = inject(ApiService);

    // get_generos() {
    //     return this.apiService.get('/api/generos', {}).pipe(
    //         map((response: any) => {
    //             return response.data as Genero[];
    //         })
    //     );
    // }

    get_all_generos(): Observable<Genero[]> {
        return this.apiService.get('/api/generos').pipe(
            map((response: any) => response.data as Genero[])
        );
    }

}