import { inject, Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import map from "node_modules/lucide-angular/icons/map";

@Injectable({
    providedIn: 'root'
})
export class GenerosAdminService {
    private ApiService = inject(ApiService);

    GetAllGenerosAdmin(params?: any) {
        return this.ApiService.get('/generos', params ? params : {}, false , "dashboard").pipe(
            map((response: any) => response.generos)
        );
    }
}