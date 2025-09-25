import { Component, inject, OnInit } from '@angular/core';
import { Concierto } from '../../core/models/conciertos.model';
import { ZardSkeletonComponent } from '../components/skeleton/skeleton.component';
import { ConciertosService } from 'src/app/core/services/conciertos.service';
import { CardConciertos } from '../card-conciertos/card-conciertos';

@Component({
    selector: 'app-list-conciertos',
    imports: [
        CardConciertos,
        ZardSkeletonComponent
    ],
    templateUrl: './list-conciertos.html',
    styleUrl: './list-conciertos.css',
    standalone: true
})

export class ListConciertos implements OnInit {
    conciertos: Concierto[] = [];
    conciertosService = inject(ConciertosService);
    skeletonArray = Array(20); 

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