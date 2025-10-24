import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class JwtService {
    getAccessToken(): string  { 
        return window.localStorage['jwtToken'];
    }

    saveAccessToken(token: string) {
        window.localStorage['jwtToken'] = token;
    }

    destroyAccessToken() {
        window.localStorage.removeItem('jwtToken');
    }
}