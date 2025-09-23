import { Component, inject, OnInit } from '@angular/core';
import { Concierto } from '../../core/models/conciertos.model';
import { ApiService } from '../../core/services/index';
import { CardConciertos } from '../card-conciertos/card-conciertos';

@Component({
    selector: 'app-list-conciertos',
    imports: [
        CardConciertos,
    ],
    templateUrl: './list-conciertos.html',
    styleUrl: './list-conciertos.css',
    standalone: true
})

export class ListConciertos implements OnInit {
    conciertos: Concierto[] = [];
    ApiService = inject(ApiService);

    ngOnInit() {
        this.getConciertos();  
    }

    getConciertos() {
        this.ApiService.get('/api/conciertos', {}).subscribe(
            (data) => {
                console.log(data);
                this.conciertos = data as Concierto[];
            },
            (error) => {
                console.error('Error fetching conciertos:', error);
            }
        );
    }
}