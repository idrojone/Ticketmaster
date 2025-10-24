import { inject, Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { map, Observable, tap } from "rxjs";
import { Concierto } from "../models/conciertos.model";

@Injectable({
    providedIn: 'root'
})
export class ConciertosService {
    apiService = inject(ApiService);
    get_all_conciertos(params?: any): Observable<Concierto[]> {
        return this.apiService.get('/api/conciertos', params ? params : {}).pipe(
            // tap((data) => console.log(data)),
            map((response: any) => response as Concierto[])
        );
    }

    getConcierto(slug: string): Observable<Concierto> {
        return this.apiService.get(`/api/conciertos/${slug}`).pipe(
            tap((data) => console.log(data)),
            map((response: any) => response as Concierto)
        );
    }

    get_conciertos_by_genero(slug: string): Observable<Concierto[]> {
        console.log(slug, 'servicio');
        return this.apiService.get(`/api/conciertos/genero/${slug}`).pipe(
            tap((data) => console.log(data, slug, 'servicio')),
            map((response: any) => response as Concierto[])
        );
    }

    get_all_ciudades(params?: any): Observable<string[]> {
        return this.apiService.get('/api/ciudades', params ? params : {}).pipe(
            // tap((data) => console.log(data)),
            map((response: any) => response as string[])
        );
    }

    // Métodos para gestionar likes
    likeConcierto(slug: string): Observable<any> {
        return this.apiService.post(`/api/conciertos/like/${slug}`).pipe(
            tap((data) => console.log('Like añadido:', data)),
            map((response: any) => response)
        );
    }

    unlikeConcierto(slug: string): Observable<any> {
        return this.apiService.delete(`/api/conciertos/unlike/${slug}`).pipe(
            tap((data) => console.log('Like eliminado:', data)),
            map((response: any) => response)
        );
    }

    // getLikesConcierto(slug: string): Observable<{ slug: string, likes: number, hasLiked: boolean }> {
    //     return this.apiService.get(`/api/conciertos/likes/${slug}`).pipe(
    //         tap((data) => console.log('Likes del concierto:', data)),
    //         map((response: any) => response as { slug: string, likes: number, hasLiked: boolean })
    //     );
    // }

}