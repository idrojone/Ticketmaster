import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    private ApiService = inject(ApiService);

    getCarrito():Observable<any>{
        console.log("Llamando a carrito get");
        return this.ApiService.get('/carrito/get');
    }

    updateCarrito(id:string):Observable<any>{
        return this.ApiService.put('/carrito/:id');
    }

    createCarrito(data:any):Observable<any>{
        return this.ApiService.post('/carrito',data);
    }

    carritoMaster(conciertos: any[] = [], merchandising: any[] = []): Observable<any> {
        return this.ApiService.post('/carrito/master', { conciertos, merchandising });
    }

}
