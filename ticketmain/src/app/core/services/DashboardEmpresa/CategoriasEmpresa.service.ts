import { inject, Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { map, Observable, tap } from "rxjs";
import { 
  CategoriaMerchandising, 
  PostCategoriaMerchandising, 
  PutCategoriaMerchandising,
  PatchCategoriaActivate,
  PatchCategoriaStatus
} from "../../models/dashboard-empresa/CategoriaMerchandising.model";

@Injectable({
  providedIn: 'root'
})
export class CategoriasEmpresaService {
  private ApiService = inject(ApiService);

  GetAllCategoriasEmpresa(params?: any): Observable<CategoriaMerchandising[]> {
    return this.ApiService.get('/categories', params ? params : {}, false, "empresa").pipe(
      tap((data) => console.log('Categorías recibidas:', data)),
      map((response: any) => response as CategoriaMerchandising[])
    );
  }

  PostCategoriaEmpresa(categoria: PostCategoriaMerchandising): Observable<CategoriaMerchandising> {
    return this.ApiService.post('/categories', categoria, false, "empresa").pipe(
      map((response: any) => response as CategoriaMerchandising)
    );
  }

  GetCategoriaEmpresa(id: string, params?: any): Observable<CategoriaMerchandising> {
    return this.ApiService.get(`/categories/${id}`, params ? params : {}, false, "empresa").pipe(
      map((response: any) => response as CategoriaMerchandising)
    );
  }

  PutCategoriaEmpresa(id: string, categoria: PutCategoriaMerchandising): Observable<CategoriaMerchandising> {
    return this.ApiService.patch(`/categories/${id}`, categoria, false, "empresa").pipe(
      map((response: any) => response as CategoriaMerchandising)
    );
  }

  DeleteCategoriaEmpresa(id: string): Observable<any> {
    return this.ApiService.delete(`/categories/${id}`, "empresa").pipe(
      map((response: any) => response)
    );
  }

  PatchCategoriaActivate(id: string, patch: boolean): Observable<CategoriaMerchandising> {
    return this.ApiService.patch(`/categories/${id}`, { "is_active": patch }, false, "empresa").pipe(
      map((response: any) => response as CategoriaMerchandising)
    );
  }

  PatchCategoriaStatus(id: string, status: string): Observable<CategoriaMerchandising> {
    return this.ApiService.patch(`/categories/${id}`, { "status": status }, false, "empresa").pipe(
      map((response: any) => response as CategoriaMerchandising)
    );
  }
}
