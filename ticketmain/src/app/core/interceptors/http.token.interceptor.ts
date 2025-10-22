import { inject } from "@angular/core";
import { JwtService } from "../services/jwt.service";
import { HttpInterceptorFn, HttpRequest, HttpEvent, HttpErrorResponse, HttpHandlerFn } from "@angular/common/http";
import { ApiService } from "../services/api.service";
import { UserService } from "../services/user.service";
import { throwError, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';


function addAuthHeader(req: any, accessToken: string | null) {
    const headersConfig: { [key: string]: string } = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    if (accessToken) {
        headersConfig['Authorization'] = `Bearer ${accessToken}`;
    }
    console.log('Añadiendo encabezados de autorización:', headersConfig);
    return req.clone({ setHeaders: headersConfig });
}

export const HttpTokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const jwtService = inject(JwtService);
    const apiService = inject(ApiService);
    const userService = inject(UserService);

    const accessToken = jwtService.getAccessToken();

    const requestWithToken = addAuthHeader(req, accessToken);
    return (next(requestWithToken) as Observable<HttpEvent<any>>).pipe(
        catchError((err: any) => {
            if (err instanceof HttpErrorResponse && err.status === 401) {
                console.log('🔄 Intentando refrescar el token de acceso...');
                return handle401Error(req, next, jwtService, apiService, userService);
            }
            return throwError(() => err);
        })
    );
};

function handle401Error(req: any, next: any, jwtService: JwtService, apiService: ApiService, userService: UserService) {
    return (apiService.post('/api/auth/refresh', {}, true) as Observable<any>).pipe(
        switchMap((res: any) => {
            const newToken = res?.accessToken || res?.token || null;
            if (!newToken) {
                console.log('❌ Falló la actualización del token. Purging auth...');
                userService.purgeAuth();
                return throwError(() => new Error('Refresh failed: no token returned'));
            }
            jwtService.saveAccessToken(newToken);
            const newReq = addAuthHeader(req, newToken);
                return (next(newReq) as Observable<HttpEvent<any>>);
        }),
        catchError((refreshErr) => {
            console.log('❌ Falló la actualización del token. Purging auth...');
            userService.purgeAuth();
            return throwError(() => refreshErr);
        })
    );
}