import { Injectable, inject } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { catchError, Observable } from "rxjs";
import { Concierto } from "src/app/core/models/conciertos.model";
import { ConciertosService } from "src/app/core/services/conciertos.service";


@Injectable({
    providedIn: 'root'
})

export class DetailsResolver implements Resolve<Concierto> {
   
    conciertoService = inject(ConciertosService);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Concierto> {
        return this.conciertoService.getConcierto(route.paramMap.get('slug')!).pipe(
            catchError((error) => { {
                console.error('Error fetching concierto data', error);
                throw error;
            }
        }));
    }
} 