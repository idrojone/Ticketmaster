import { Component, inject, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Concierto } from '../../core/models/conciertos.model';
import { ZardSkeletonComponent } from '../components/skeleton/skeleton.component';
import { ConciertosService } from 'src/app/core/services/conciertos.service';
import { CardConciertos } from '../card-conciertos/card-conciertos';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FiltersComponent } from '../filters/filters';
import { Genero } from 'src/app/core/models/generos.model';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'app-list-conciertos',
    imports: [
        CardConciertos,
        // ZardSkeletonComponent,
        InfiniteScrollModule,
        FiltersComponent
    ],
    templateUrl: './list-conciertos.html',
    styleUrl: './list-conciertos.css',
    standalone: true
})

export class ListConciertos implements OnInit {
    limit=4;
    offset=0;
    slug_category!: string | null ;
    routeFilters!: string | null ;

    @Input() page !: string;

    conciertos: Concierto[] = [];
    listGeneros: Genero[] = [];

    conciertosService = inject(ConciertosService);

    ActivatedRoute = inject(ActivatedRoute);
    skeletonArray = Array(20); 
    slug_genero!: string | null;

    constructor( private Router: Router, private Location: Location) { }

    ngOnInit() {
        // console.log("ngOnInit list conciertos");
         if (this.page === 'shop') {
            // console.log("ngOnInit shop conciertos");
            this.limit = 12;
            this.slug_genero = this.ActivatedRoute.snapshot.paramMap.get('slug');
            this.routeFilters=this.ActivatedRoute.snapshot.paramMap.get('filters');

            if(this.slug_genero!== null && this.slug_genero!== ''){
                this.get_conciertos_by_genero();
            }else if(this.routeFilters!== null){
                
            }else{
                this.getConciertos();
            }
        } else if (this.page === 'home') {
            this.getConciertos();
        }

    }

    get_list_filtered(event: any) {

    }


    getAllConciertosFiltered() {

    }

    get_conciertos_by_genero() {
        this.conciertosService.get_conciertos_by_genero(this.slug_genero!).subscribe(
            (data: any) => {
                console.log(data.conciertos);
                this.conciertos = data.conciertos as Concierto[];
            },
            (error: any) => {
                console.error('Error fetching conciertos by genero:', error);
            }
        );
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
        if (this.page === 'home' || this.page === 'shop' && this.slug_genero === null) {
            this.getConciertos();
        }
    }
}