import { inject, Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { map, Observable, tap } from "rxjs";
import { 
  Merchandising, 
  PostMerchandising, 
  PutMerchandising,
  PatchMerchandisingActivate,
  PatchMerchandisingStatus
} from "../../models/dashboard-empresa/Merchandising.model";

@Injectable({
  providedIn: 'root'
})
export class MerchandisingEmpresaService {
  private ApiService = inject(ApiService);

  GetAllMerchandisingEmpresa(params?: any): Observable<Merchandising[]> {
    return this.ApiService.get('/merchandising', params ? params : {}, false, "empresa").pipe(
      tap((data) => console.log('Merchandising recibido:', data)),
      map((response: any) => response as Merchandising[])
    );
  }

  PostMerchandisingEmpresa(merchandising: PostMerchandising): Observable<Merchandising> {
    return this.ApiService.post('/merchandising', merchandising, false, "empresa").pipe(
      map((response: any) => response as Merchandising)
    );
  }

  GetMerchandisingEmpresa(id: string, params?: any): Observable<Merchandising> {
    return this.ApiService.get(`/merchandising/${id}`, params ? params : {}, false, "empresa").pipe(
      map((response: any) => response as Merchandising)
    );
  }

  PutMerchandisingEmpresa(id: string, merchandising: PutMerchandising): Observable<Merchandising> {
    return this.ApiService.patch(`/merchandising/${id}`, merchandising, false, "empresa").pipe(
      map((response: any) => response as Merchandising)
    );
  }

  DeleteMerchandisingEmpresa(id: string): Observable<any> {
    return this.ApiService.delete(`/merchandising/${id}`, "empresa").pipe(
      map((response: any) => response)
    );
  }

  PatchMerchandisingActivate(id: string, patch: boolean): Observable<Merchandising> {
    return this.ApiService.patch(`/merchandising/${id}`, { "is_active": patch }, false, "empresa").pipe(
      map((response: any) => response as Merchandising)
    );
  }

  PatchMerchandisingStatus(id: string, status: string): Observable<Merchandising> {
    return this.ApiService.patch(`/merchandising/${id}`, { "status": status }, false, "empresa").pipe(
      map((response: any) => response as Merchandising)
    );
  }
}
