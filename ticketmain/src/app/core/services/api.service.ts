import { Injectable, inject } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environments';

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    http = inject(HttpClient);

    private formatErrors(errors: any) {
        // Normalizar el error para que nunca sea `undefined` al suscribirse
        const normalized = errors?.error ?? errors ?? { message: 'Unknown error' };
        return throwError(() => normalized);
    }

    get(path: string, params: HttpParams = new HttpParams(), credentialsRequired: boolean = false): Observable<any>{
        return this.http.get(`${environment.api_url}${path}`, { params, withCredentials: credentialsRequired })
            .pipe(catchError(this.formatErrors));
    }       

    put(path: string, body: Object = {}): Observable<any> {
        return this.http.put(
            `${environment.api_url}${path}`,
            JSON.stringify(body)
        ).pipe(catchError(this.formatErrors));
    }

    post(path: string, body: any = {}, credentialsRequired: boolean = false): Observable<any> {
        console.log(body);
        return this.http.post(`${environment.api_url}${path}`, body, { withCredentials: credentialsRequired }).pipe(catchError(this.formatErrors));
    }

    delete(path: any): Observable<any> {
        return this.http.delete(
            `${environment.api_url}${path}`
        ).pipe(catchError(this.formatErrors));  
    }
}