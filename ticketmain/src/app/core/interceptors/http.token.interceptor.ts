import { inject } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpResponse, HttpRequest } from "@angular/common/http";
import { JwtService } from "../services/jwt.service";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";
import { catchError, switchMap, tap, throwError } from "rxjs";

export const httpTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const jwtService = inject(JwtService);
    const userService = inject(UserService);
    const router = inject(Router);

    const token = jwtService.getAccessToken();

    let authReq = req;
    if (token) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        });
    }

    return next(authReq).pipe(
        tap((event) => {
            // Capturar respuesta exitosa y extraer el header X-Access-Token si existe
            if (event instanceof HttpResponse) {
                const newAccessToken = event.headers.get('X-Access-Token');
                if (newAccessToken) {
                    jwtService.saveAccessToken(newAccessToken);
                }
            }
        }),
        catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                const errorCode = error.error?.error || 'unknown';

                // Si el error es "no_refresh_token", "refresh_expired" o similar, ya no hay way to recover
                if (errorCode === 'no_refresh_token' || errorCode === 'refresh_expired' || 
                    errorCode === 'refresh_blacklisted' || errorCode === 'invalid_refresh') {
                    console.log("No se puede recuperar con refresh token. Haciendo logout...");
                    userService.logout();
                    return throwError(() => new Error("Sesión expirada. Por favor, inicie sesión nuevamente."));
                }

                // intentamos refrescar explícitamente llamando al endpoint de refresh
                return jwtService.refreshToken().pipe(
                    switchMap((newToken: string) => {
                        if (!newToken) {
                            userService.logout();
                            return throwError(() => new Error("No token returned from refresh"));
                        }
                        jwtService.saveAccessToken(newToken);
                        const clonedReq = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newToken}`,
                                "Content-Type": "application/json",
                                Accept: "application/json"
                            }
                        });
                        return next(clonedReq);
                    }),
                    catchError((refreshErr) => {
                        // si falla el refresh, cerrar sesión y propagar el error
                        userService.logout();
                        return throwError(() => refreshErr);
                    })
                );
            }
            return throwError(() => error);
        })
    );
};