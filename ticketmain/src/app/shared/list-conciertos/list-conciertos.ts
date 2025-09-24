import { Component, inject, OnInit } from '@angular/core';
import { Concierto } from '../../core/models/conciertos.model';
// 
import { ConciertosService } from 'src/app/core/services/conciertos.service';
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
    conciertosService = inject(ConciertosService);

    ngOnInit() {
        this.getConciertos();  
    }

    getConciertos() {
        this.conciertosService.get_all_conciertos().subscribe(
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