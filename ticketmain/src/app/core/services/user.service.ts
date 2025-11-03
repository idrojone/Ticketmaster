import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, distinctUntilChanged, map, Observable } from "rxjs";
import { User } from "../models/user.model";
import { ApiService } from "./api.service";
import { JwtService } from "./jwt.service";

@Injectable ({
    providedIn: 'root'
})

export class UserService {
    private currentUserSubject = new BehaviorSubject<User>({} as User);
    public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuth = this.isAuthenticatedSubject.asObservable();

    private apiService = inject(ApiService);
    private jwtService = inject(JwtService);
    private router = inject(Router);

    private isPopulating = false;
   
    populate() {
     
        if (this.isPopulating) {
            return;
        }

        const accessToken = this.jwtService.getAccessToken();
        if (accessToken) {
            
            this.isPopulating = true;
            this.apiService.get("/api/user").subscribe({
                next: (data) => {
                    console.log('Usuario autenticado:', data.user.username);
                    this.setAuth({ ...data.user, accessToken: accessToken });
                    this.isPopulating = false;
                },
                error: (err) => {
                    console.log('Access Token inválido o expirado');
                    this.purgeAuth();
                    this.isPopulating = false;
                }
            });
        } else {
            this.purgeAuth();
        }
    }

    setAuth(user: User) {
        // console.log('Estableciendo autenticación para el usuario:', user);
        this.jwtService.saveAccessToken(user.accessToken);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
    }

    purgeAuth() {

        this.jwtService.destroyAccessToken();
        this.currentUserSubject.next({} as User);
        this.isAuthenticatedSubject.next(false);
    }

    attemptAuth(type: string, credentials: any): Observable<User> {
        const route = (type === 'login') ? '/login' : '/register';
        console.log(`Intentando autenticación (${type}) con credenciales:`, credentials);
        return this.apiService.post(`/api${route}`, { user: credentials }, true)
        .pipe(map(
            data => {
                // console.log('Autenticación exitosa. Datos del usuario recibidos:', data.user);
                this.setAuth(data.user);
                return data;
            }
        ));
    }

    getUserProfile(username: string | null): Observable<User> {
        return this.apiService.get(`/api/user/${username}`)
            .pipe(map(data => {
                return data.user;
            }));
    }

    getCurrentUser(): User {
        return this.currentUserSubject.value;
    }

    update(user: User): Observable<User> {
        return this.apiService
            .put('/api/user', { user })
            .pipe(map(data => {
                this.currentUserSubject.next(data.user);
                return data.user;
            }));
    }

    logout() {
        this.purgeAuth();
        this.router.navigate(['/login']);
    }
}