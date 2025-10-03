import { Component, inject, OnInit, Input } from '@angular/core';
import { Concierto } from '../../core/models/conciertos.model';
import { ZardSkeletonComponent } from '../components/skeleton/skeleton.component';
import { ConciertosService } from 'src/app/core/services/conciertos.service';
import { CardConciertos } from '../card-conciertos/card-conciertos';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
    selector: 'app-list-conciertos',
    imports: [
        CardConciertos,
        // ZardSkeletonComponent,
        InfiniteScrollModule
    ],
    templateUrl: './list-conciertos.html',
    styleUrl: './list-conciertos.css',
    standalone: true
})

export class ListConciertos implements OnInit {
    limit=4;
    offset=0;
    @Input() page !: string;
    conciertos: Concierto[] = [];
    conciertosService = inject(ConciertosService);
    skeletonArray = Array(20); 

    ngOnInit() {
        if (this.page === 'shop') {
            this.limit = 12;
        }
        this.getConciertos();
    }

    // getAllConciertos() {
    //     this.conciertosService.get_all_conciertos().subscribe(
    //         (data) => {
    //             console.log(data);
    //             this.conciertos = data as Concierto[];
    //         },
    //         (error) => {
    //             console.error('Error fetching conciertos:', error);
    //         }
    //     );
    // }

    getConciertos() {
        const params = this.getRequestParams(this.offset, this.limit);

        this.conciertosService.get_all_conciertos(params).subscribe(
            (data: any) => {
                console.log(data.conciertos);
                this.conciertos = data.conciertos as Concierto[];
                this.limit=this.limit+4;
            },
            (error) => {
                console.error('Error fetching conciertos:', error);
            }
        );
    }

    getRequestParams(offset: number, limit: number): any {
        let params: any = {};

        params['offset'] = offset;
        params['limit'] = limit;

        return params;
    }

    Scroll() {
        this.getConciertos();
    }
}