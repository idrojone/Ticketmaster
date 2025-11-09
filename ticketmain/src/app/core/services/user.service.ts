import { inject, Injectable } from "@angular/core";
import { Router, RouterLinkWithHref } from "@angular/router";
import { BehaviorSubject, distinctUntilChanged, elementAt, map, Observable, of } from "rxjs";
import { User } from "../models/user.model";
import { ApiService } from "./api.service";
import { JwtService } from "./jwt.service";
import { UserTypeService } from "./user-type.service";
import { jwtDecode } from "jwt-decode";


@Injectable ({
    providedIn: 'root'
})  
export class UserService {
    private currentUserSubject = new BehaviorSubject<User>({} as User);
    public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

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
            console.log("Access Token en populate: " + accessToken);
            let accessTokenDecoded= jwtDecode<any>(accessToken);
            // console.log(accessTokenDecoded);

            this.isPopulating = true;
            this.apiService.get("/api/user").subscribe({
                next: (data) => {
                    console.log('Usuario autenticado:', data.user.username);
                    this.setAuth({ ...data.user, accessToken: accessToken });
                    // this.isPopulating = false;
                },
                error: (err) => {
                    console.log(accessTokenDecoded);
                    this.apiService.get(`/auth/user/${accessTokenDecoded.username}`, undefined, false, "dashboard").subscribe({
                        next: (data) => {
                            console.log('Usuario admin autenticado:', data.user.username);
                            this.setAuth(data.user);
                            this.userTypeService.setUserType('admin');
                            this.isPopulating = false;
                        },
                        error: (err) => {
                            console.log('Access Token inválido o expirado');
                            this.purgeAuth();
                            this.isPopulating = false;
                        }
                    });
                }
            });
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
                        // Realiza la autenticación del admin de forma síncrona
                        this.apiService.post(`/auth/login`, { user: credentials }, true, "dashboard")
                            .subscribe({
                                next: (adminData) => {
                                    console.log('Usuario admin autenticado:', adminData);
                                    this.setAuth(adminData.user);
                                    this.userTypeService.setUserType('admin');
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