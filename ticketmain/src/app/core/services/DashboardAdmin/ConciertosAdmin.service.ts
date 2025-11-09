import { inject, Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { map, Observable, tap } from "rxjs";
import { ConciertoAdmin, PostConciertoAdmin, PutConciertoAdmin , PatchConciertoActivate , PatchConciertoStatus} from "../../models/dashboard-admin/ConciertosAdmin.model";

@Injectable({
    providedIn: 'root'
})
export class ConciertosAdminService {
    private ApiService = inject(ApiService);

    GetAllConciertosAdmin(params?: any):Observable<ConciertoAdmin[]> {
        return this.ApiService.get('/conciertos', params ? params : {}, false , "dashboard").pipe(
            tap((data) => console.log('Datos recibidos:', data)),
            map((response: any) => response.conciertos as ConciertoAdmin[])
        );
    }

    PostConciertoAdmin(concierto: PostConciertoAdmin):Observable<ConciertoAdmin> {
        return this.ApiService.post('/conciertos', concierto, false , "dashboard").pipe(
            map((response: any) => response.data as ConciertoAdmin)
         );
    }

    GetConciertoAdmin(slug : string , params?: any):Observable<ConciertoAdmin> {
        return this.ApiService.get(`/conciertos/${slug}`,  params ? params : {}, false , "dashboard").pipe(
            map((response: any) => response.data as ConciertoAdmin)
        );
    }

    PutConciertoAdmin(slug : string , concierto: PutConciertoAdmin):Observable<ConciertoAdmin> {
        return this.ApiService.put(`/conciertos/${slug}`, concierto , "dashboard").pipe(
            map((response: any) => response.data as ConciertoAdmin)
         );
    }

    DeleteConciertoAdmin(slug : string, params?: any):Observable<any> {
        return this.ApiService.delete(`/conciertos/${slug}` , "dashboard").pipe(
            map((response: any) => response)
        );
    }

    PatchConciertoActivate(slug : string , patch: boolean):Observable<ConciertoAdmin> {
        return this.ApiService.patch(`/conciertos/${slug}/activate`, { "is_active": patch } , false , "dashboard").pipe(
            map((response: any) => response.data as ConciertoAdmin)
         );
    }

    PatchConciertoStatus(slug : string , status: string):Observable<ConciertoAdmin> {
        return this.ApiService.patch(`/conciertos/${slug}/status`, { "status": status } , false , "dashboard").pipe(
            map((response: any) => response.data as ConciertoAdmin)
        );
    }

}