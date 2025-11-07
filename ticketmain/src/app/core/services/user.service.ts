import { inject, Injectable } from "@angular/core";
import { Router, RouterLinkWithHref } from "@angular/router";
import { BehaviorSubject, distinctUntilChanged, map, Observable } from "rxjs";
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
        // if (accessToken) {
        //     try {
        //         const decodedToken: any = jwtDecode(accessToken);
        //         if (decodedToken.)
        //     }catch(error) {
        //         console.log('Access Token inválido o expirado');
        //         this.purgeAuth();
        //         return;
        //     }
        // }
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

        // decode de token para obtener el rol

        // const role = 

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

        if (type === 'login' && user_rol === 'ADMIN') {
            return this.apiService.post(`/auth/login`, { user: credentials }, true, "dashboard")
                .pipe(map(
                    data => {
                        this.setAuth(data.user);
                        this.userTypeService.setUserType('ADMIN');
                        return data.user;
                    }
                ));
        } else {
            return this.apiService.post(`/api${route}`, { user: credentials }, true)
                .pipe(map(
                    data => {
                        this.setAuth(data.user);
                        this.userTypeService.setUserType('USER');
                        return data.user;
                    }
                ));
        }
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