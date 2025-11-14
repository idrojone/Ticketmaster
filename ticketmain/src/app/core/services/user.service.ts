import { inject, Injectable } from "@angular/core";
import { Router, RouterLinkWithHref } from "@angular/router";
import { BehaviorSubject, distinctUntilChanged, elementAt, map, Observable, of } from "rxjs";
import { User } from "../models/user.model";
import { ApiService } from "./api.service";
import { JwtService } from "./jwt.service";
import { UserTypeService } from "./user-type.service";
import { jwtDecode } from "jwt-decode";
import { UserAdmin } from "../models/dashboard-admin/UserAdmin.model";


@Injectable ({
    providedIn: 'root'
})  
export class UserService {
    private currentUserSubject = new BehaviorSubject<User>({} as User);

    private currentUserAdminSubject = new BehaviorSubject<UserAdmin>({} as UserAdmin);

    public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

    public currentUserAdmin = this.currentUserAdminSubject.asObservable().pipe(distinctUntilChanged());

    private userTypeService = inject(UserTypeService);

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
        console.log("Access Token en populate: " + accessToken);
        
        if (accessToken) {
            try {
                let accessTokenDecoded = jwtDecode<any>(accessToken);
                console.log('Token decodificado:', accessTokenDecoded);

                this.isPopulating = true;

                // Verificar si es admin directamente del token decodificado
                if (accessTokenDecoded.role === 'admin') {
                    console.log('Admin detectado en token');
                    const adminUser: User = {
                        username: accessTokenDecoded.username,
                        email: accessTokenDecoded.email,
                        accessToken: accessToken,
                        bio: '',
                        image: ''
                    };
                    this.setAuth(adminUser);
                    this.userTypeService.setUserType('admin');
                    this.isPopulating = false;
                } else if (accessTokenDecoded.role === 'empresa') {
                    console.log('Empresa detectada en token');
                    const empresaUser: User = {
                        username: accessTokenDecoded.username,
                        email: accessTokenDecoded.email,
                        accessToken: accessToken,
                        bio: '',
                        image: ''
                    };
                    this.setAuth(empresaUser);
                    this.userTypeService.setUserType('empresa');
                    this.isPopulating = false;
                } else {
                    // Para usuarios regulares, obtener datos del endpoint
                    this.apiService.get("/api/user").subscribe({
                        next: (response) => {
                            console.log('Respuesta de /api/user:', response);
                            
                            const userData = response.user || response;
                            this.setAuth({ ...userData, accessToken: accessToken });
                            this.userTypeService.setUserType('USER');
                            this.isPopulating = false;
                        },
                        error: (err) => {
                            console.log('Error en /api/user:', err);
                            // Solo limpiar el token si es un error 401 (no autorizado, token inválido)
                            if (err?.status === 401 || err?.status === 403) {
                                console.log('Token inválido o expirado, limpiando...');
                                this.purgeAuth();
                            } else {
                                console.log('Error del servidor, manteniendo token:', err?.status);
                            }
                            this.isPopulating = false;
                        }
                    });
                }
            } catch (error) {
                console.log('Error decodificando token:', error);
                this.purgeAuth();
                this.isPopulating = false;
            }
        } else {
            this.purgeAuth();
        }
    }



    setAuth(user: User) {
        this.jwtService.saveAccessToken(user.accessToken);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
    }

    purgeAuth() {

        this.jwtService.destroyAccessToken();
        this.currentUserSubject.next({} as User);
        this.isAuthenticatedSubject.next(false);
        // this.userTypeService.clearUserType();
    }

    attemptAuth(type: string, credentials: any, user_rol?: any): Observable<User> {
        const route = (type === 'login') ? '/login' : '/register';

        return this.apiService.post(`/api${route}`, { user: credentials }, true)
            .pipe(
                map(data => {
                    if (data.rol && data.rol === 'admin') {
                        console.log('Intentando autenticación como admin:', data);
                        this.apiService.post(`/auth/login`, { user: credentials }, true, "dashboard")
                            .subscribe({
                                next: (adminData) => {
                                    console.log('Usuario admin autenticado:', adminData);
                                    this.setAuth(adminData.user);
                                    this.userTypeService.setUserType('admin');
                                }
                            });
                    } else if (data.rol && data.rol === 'empresa') {
                        console.log('Intentando autenticación como empresa:', data);
                        this.apiService.post(`/auth/login`, credentials,  true, "empresa")
                            .subscribe({
                                next: (empresaData) => {
                                    console.log('Usuario empresa autenticado:', empresaData);
                                    this.setAuth(empresaData.user);
                                    this.userTypeService.setUserType('empresa');
                                }
                            });
                    } else {
                        this.setAuth(data.user);
                        this.userTypeService.setUserType('USER');
                    }
                    return data.user;
                })
            );
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

        // this.userTypeService.clearUserType();
    }
}