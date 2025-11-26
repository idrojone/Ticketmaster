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
        return this.ApiService.get('/carrito/:id');
    }

    createCarrito():Observable<any>{
        return this.ApiService.get('/carrito');
    }

}
