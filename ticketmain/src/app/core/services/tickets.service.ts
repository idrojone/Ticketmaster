import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { inject } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class TicketsService {

    private ApiService = inject(ApiService);

    constructor() { }

    getTicketsUsuario() {
        return this.ApiService.get('/api/entradas');
    }

}   