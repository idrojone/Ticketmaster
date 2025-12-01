import { inject, Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MerchService {
    apiService = inject(ApiService);

    get_all_merch(id: string): Observable<Object> {  
        return this.apiService.get(`/merchandising/${id}`);
    }
    
}