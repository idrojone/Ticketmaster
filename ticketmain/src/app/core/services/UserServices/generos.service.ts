import { inject, Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { map, Observable } from "rxjs";
import { Genero } from "../../models/generos.model";

@Injectable({
    providedIn: 'root'
})
export class GenerosService {
    apiService = inject(ApiService);

    get_all_generos(): Observable<Genero[]> {
        return this.apiService.get('/api/generos').pipe(
            map((response: any) => response.data as Genero[])
        );
    }

}