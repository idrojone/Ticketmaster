import { Injectable, inject } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { ApiService } from "./api.service";

@Injectable({
    providedIn: 'root'
})
export class JwtService {
    private apiService = inject(ApiService);

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
}