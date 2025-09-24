import { inject, Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from "./api.service";
import { map } from "rxjs";
import { Genero } from "../models/generos.model";

@Injectable({
    providedIn: 'root'
})
export class GenerosService {
    http = inject(HttpClient);

    constructor(private ApiService: ApiService) { }

    get_generos() {
        return this.ApiService.get('/api/generos', {}).pipe(
            map((response: any) => {
                return response.generos as Genero[];
            })
        );
    }

}