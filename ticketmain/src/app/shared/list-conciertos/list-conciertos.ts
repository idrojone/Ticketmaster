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
import { Search } from '../search/search';
import { Filters } from '../../core/models/filters.model';



@Component({
    selector: 'app-list-conciertos',
    imports: [
        CardConciertos,
        // ZardSkeletonComponent,
        InfiniteScrollModule,
        FiltersComponent,
        Search
    ],
    templateUrl: './list-conciertos.html',
    styleUrl: './list-conciertos.css',
    standalone: true
})

export class ListConciertos implements OnInit {
    @Input() page !: string;

    limit=4;
    offset=0;
    slug_category!: string | null ;
    routeFilters!: string | null ;
    filters=new Filters();
    conciertos: Concierto[] = [];
    listGeneros: Genero[] = [];
    skeletonArray = Array(20); 
    slug_genero!: string | null;

    Router = inject(Router);
    Location = inject(Location);
    conciertosService = inject(ConciertosService);
    ActivatedRoute = inject(ActivatedRoute);

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
                this.filters= JSON.parse(atob(this.routeFilters!));
                this.refreshRouteFilter();
                this.getConciertos(this.filters);
            }else{
                this.getConciertos();
            }
        } else if (this.page === 'home') {
            // console.log("ngOnInit home conciertos");
            this.filters = new Filters();
            this.filters.limit = 4;
            this.filters.offset = 0;
            this.getConciertos(this.filters);
        }

    }

    refreshRouteFilter() {
        this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters');
        if(typeof(this.routeFilters) == "string" ){
            this.filters = JSON.parse(atob(this.routeFilters));
        }else{
            this.filters = new Filters();
        }
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

    getConciertos(filters?: Filters) {

        console.log("filters recibidos en list conciertos: " + JSON.stringify(filters));

        this.conciertosService.get_all_conciertos(filters).subscribe(
            (data: any) => {
                this.conciertos = data.conciertos as Concierto[];
                // console.log("DATOS CONCIERTOS: " + JSON.stringify(this.conciertos));
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
        // console.log("scroll FILTROS: " + JSON.stringify(this.filters));
        
        if (this.page === 'home') {
            this.filters.limit = (this.filters.limit || 4) + 4  ;
            console.log("scroll FILTROS ACTUALIZADOS: " + JSON.stringify(this.filters));
            this.getConciertos(this.filters);

        }
    }
}