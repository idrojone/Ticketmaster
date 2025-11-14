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

    get(path: string, params: HttpParams = new HttpParams(), credentialsRequired: boolean = false, server?: string): Observable<any>{
        if(server==="dashboard"){
            console.log(' llamando a dashboard API:', `${environment.dashboard_url}${path}`);
            return this.http.get(`${environment.dashboard_url}${path}`, { params, withCredentials: credentialsRequired })
            .pipe(catchError(this.formatErrors));
        }else{
            return this.http.get(`${environment.api_url}${path}`, { params, withCredentials: credentialsRequired })
            .pipe(catchError(this.formatErrors));
        }
    }       

    put(path: string, body: Object = {}, server?: string): Observable<any> {
        if(server==="dashboard"){
            return this.http.put(
                `${environment.dashboard_url}${path}`,
                JSON.stringify(body)
            ).pipe(catchError(this.formatErrors));
        }else{
            return this.http.put(
                `${environment.api_url}${path}`,
                JSON.stringify(body)
            ).pipe(catchError(this.formatErrors));
        }
    }

    post(path: string, body: any = {}, credentialsRequired: boolean = false, server?: string): Observable<any> {
        console.log(body);
        console.log(server);    
        if(server==="dashboard"){
            return this.http.post(`${environment.dashboard_url}${path}`, body, { withCredentials: credentialsRequired }).pipe(catchError(this.formatErrors));
        } else if (server==="empresa"){
            return this.http.post(`${environment.empresa_url}${path}`, body, { withCredentials: credentialsRequired }).pipe(catchError(this.formatErrors));
        } else{
            return this.http.post(`${environment.api_url}${path}`, body, { withCredentials: credentialsRequired }).pipe(catchError(this.formatErrors));
        }
    }

    delete(path: any, server?: string): Observable<any> {
        if(server==="dashboard"){
            return this.http.delete(
                `${environment.dashboard_url}${path}`
            ).pipe(catchError(this.formatErrors));
        }else{
            return this.http.delete(
                `${environment.api_url}${path}`
            ).pipe(catchError(this.formatErrors));
        }
    }

    patch(path: string, body: Object = {}, credentialsRequired: boolean = false, server?: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        
        if(server==="dashboard"){
            return this.http.patch(
                `${environment.dashboard_url}${path}`,
                body,
                { headers, withCredentials: credentialsRequired }
            ).pipe(catchError(this.formatErrors));
        }else{
            return this.http.patch(
                `${environment.api_url}${path}`,
                body,
                { headers, withCredentials: credentialsRequired }
            ).pipe(catchError(this.formatErrors));
        }
    }
}