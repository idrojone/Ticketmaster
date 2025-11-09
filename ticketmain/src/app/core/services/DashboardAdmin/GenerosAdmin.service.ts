import { inject, Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { map, Observable, tap } from "rxjs";
import { GeneroAdmin, PostGeneroAdmin, PutGeneroAdmin, PatchGeneroActivate, PatchGeneroStatus } from "../../models/dashboard-admin/GenerosAdmin.model";

@Injectable({
    providedIn: 'root'
})
export class GenerosAdminService {
    private ApiService = inject(ApiService);

    GetAllGenerosAdmin(params?: any): Observable<GeneroAdmin[]> {
        return this.ApiService.get('/generos', params ? params : {}, false, "dashboard").pipe(
            tap((data) => console.log('Datos recibidos:', data)),
            map((response: any) => response.generos as GeneroAdmin[])
        );
    }

    PostGeneroAdmin(genero: PostGeneroAdmin): Observable<GeneroAdmin> {
        console.log(genero);
        return this.ApiService.post('/generos', genero, false, "dashboard").pipe(
            map((response: any) => response.data as GeneroAdmin)
        );
    }

    GetGeneroAdmin(slug: string, params?: any): Observable<GeneroAdmin> {
        return this.ApiService.get(`/generos/${slug}`, params ? params : {}, false, "dashboard").pipe(
            map((response: any) => response.data as GeneroAdmin)
        );
    }

    PutGeneroAdmin(slug: string, genero: PutGeneroAdmin): Observable<GeneroAdmin> {
        return this.ApiService.put(`/generos/${slug}`, genero, "dashboard").pipe(
            map((response: any) => response.data as GeneroAdmin)
        );
    }

    DeleteGeneroAdmin(slug: string, params?: any): Observable<any> {
        return this.ApiService.delete(`/generos/${slug}`, "dashboard").pipe(
            map((response: any) => response)
        );
    }

    PatchGeneroActivate(slug: string, patch: boolean): Observable<GeneroAdmin> {
        return this.ApiService.patch(`/generos/${slug}/activate`, { "is_active": patch }, false, "dashboard").pipe(
            map((response: any) => response.data as GeneroAdmin)
        );
    }

    PatchGeneroStatus(slug: string, status: string): Observable<GeneroAdmin> {
        return this.ApiService.patch(`/generos/${slug}/status`, { "status": status }, false, "dashboard").pipe(
            map((response: any) => response.data as GeneroAdmin)
        );
    }
}