import { Injectable, inject } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { ApiService } from "./api.service";
import { UserTypeService } from "./user-type.service";

@Injectable({
    providedIn: 'root'
})
export class JwtService {
    private apiService = inject(ApiService);
    private userTypeService = inject(UserTypeService);


    getAccessToken(): string  { 
        return window.localStorage['jwtToken'];
    }

    saveAccessToken(token: string) {
        window.localStorage['jwtToken'] = token;
    }

    destroyAccessToken() {
        window.localStorage.removeItem('jwtToken');
    }

    refreshToken(): Observable<string> {
        // Lógica para refrescar el token
        if (this.userTypeService.getUserType() === 'USER') {
            console.log('🔄 Llamando a /api/refresh...');
            return this.apiService.post('/api/refresh', {}, true).pipe(
                map((response: any) => {
                    if (!response || !response.accessToken) {
                        throw new Error('No accessToken in response');
                    }
                    return response.accessToken;
                })
            );
        }
        return new Observable<string>();
        
    }
}