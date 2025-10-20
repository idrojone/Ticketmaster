import { inject, Injectable } from "@angular/core";
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

    // Flag para evitar múltiples llamadas a populate
    private isPopulating = false;
   
  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // Evitar llamadas múltiples mientras se está procesando
    if (this.isPopulating) {
      console.log('⚠️ populate() ya está en ejecución, ignorando llamada duplicada');
      return;
    }

    // If JWT detected, attempt to get & store user's info
    const token = this.jwtService.getToken();
    if (token) {
      this.isPopulating = true;
      console.log('🔄 Verificando token JWT...');
      
      this.apiService.get("/api/user").subscribe({
        next: (data) => {
          console.log('✅ Usuario autenticado:', data.user.username);
          this.setAuth({ ...data.user, token });
          this.isPopulating = false;
        },
        error: (err) => {
          console.log('❌ Token inválido o expirado');
          this.purgeAuth();
          this.isPopulating = false;
        }
      });
    } else {
      // Remove any potential remnants of previous auth states
      console.log('ℹ️ No hay token JWT, limpiando auth');
      this.purgeAuth();
    }
  }

  setAuth(user: User) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(user.token);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next({} as User);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  attemptAuth(type: string, credentials: any): Observable<User> {
    // console.log('Attempting auth with credentials:', credentials);
    const userCredentials = { user: credentials };
    const route = (type === 'login') ? '/login' : '/register';
    return this.apiService.post(`/api${route}`, {user: credentials})
      .pipe(map(
      data => {
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

  // Update the user on the server (email, pass, etc)
  update(user: User): Observable<User> {
    return this.apiService
    .put('/api/user', { user })
    .pipe(map(data => {
      // Update the currentUser observable
      this.currentUserSubject.next(data.user);
      return data.user;
    }));
  }
}