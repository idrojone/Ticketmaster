import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    private ApiService = inject(ApiService);

    getCarrito(): Observable<any> {
        console.log("Llamando a carrito get");
        return this.ApiService.get('/carrito/get');
    }
    // -> este no se usa
    updateCarrito(id: string): Observable<any> {
        return this.ApiService.put('/carrito/:id');
    }
    // este no
    createCarrito(data: any): Observable<any> {
        return this.ApiService.post('/carrito', data);
    }

    carritoMaster(conciertos: any[] = [], merchandising: any[] = []): Observable<any> {
        return this.ApiService.post('/carrito/master', { conciertos, merchandising });
    }

    payCarrito(payload : any): Observable<any> {
        return this.ApiService.post('/create-payment-intent', payload);
    }

    getEstadoOrden(orderID : string): Observable<any> {
        return this.ApiService.get('/order/' + orderID);
    }

}
