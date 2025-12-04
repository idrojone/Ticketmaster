import { Component, inject, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Concierto } from '../../core/models/conciertos.model';
import { ZardSkeletonComponent } from '../components/skeleton/skeleton.component';
import { ConciertosService } from 'src/app/core/services/UserServices/conciertos.service';
import { CardConciertos } from '../card-conciertos/card-conciertos';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FiltersComponent } from '../filters/filters';
import { Genero } from 'src/app/core/models/generos.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Search } from '../search/search';
import { Filters } from '../../core/models/filters.model';
import { ZardPaginationModule } from '@shared/components/pagination/pagination.module';
import { FormsModule } from '@angular/forms';




@Component({
    selector: 'app-list-conciertos',
    imports: [
        CardConciertos,
        // ZardSkeletonComponent,
        InfiniteScrollModule,
        FiltersComponent,
        Search
        ,ZardPaginationModule,
        FormsModule
    ],
    templateUrl: './list-conciertos.html',
    styleUrl: './list-conciertos.css',
    standalone: true
})

export class ListConciertos implements OnInit {
    @Input() page !: string;
    // @Input () numeroConciertosShop !: number;

    limit=8;
    offset=0;
    slug_category!: string | null ;
    routeFilters!: string | null ;
    filters=new Filters();
    conciertos: Concierto[] = [];
    listGeneros: Genero[] = [];
    skeletonArray = Array.from({ length: 20 }, (_, i) => i); 
    slug_genero!: string | null;
    numeroConciertos!: number;

    Router = inject(Router);
    Location = inject(Location);
    conciertosService = inject(ConciertosService);
    ActivatedRoute = inject(ActivatedRoute);

    ngOnInit() {
        // console.log("ngOnInit list conciertos");
         if (this.page === 'shop') {
            // console.log("ngOnInit shop conciertos");
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
            const parsedFilters = JSON.parse(atob(this.routeFilters));
            this.filters = new Filters(
                parsedFilters.limit,
                parsedFilters.offset,
                parsedFilters.genero,
                parsedFilters.genero_nombre,
                parsedFilters.fecha_inicio,
                parsedFilters.fecha_fin,
                parsedFilters.nombre,
                parsedFilters.ciudad
            );
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
        if (filters === undefined) {
            filters = new Filters();
            filters.limit = this.limit;
            filters.offset = this.offset;   
        } else {
            // Actualizar los filtros locales con los recibidos
            this.filters = new Filters(
                filters.limit,
                filters.offset,
                filters.genero,
                filters.genero_nombre,
                filters.fecha_inicio,
                filters.fecha_fin,
                filters.nombre,
                filters.ciudad
            );
        }
        // console.log("filters recibidos en list conciertos: " , filters);

        

        this.conciertosService.get_all_conciertos(filters).subscribe(
            (data: any) => {
                this.conciertos = data.conciertos as Concierto[];
                this.numeroConciertos = data.concierto_count/this.limit;
                if (this.numeroConciertos < 1 && this.numeroConciertos > 0) {
                    this.numeroConciertos = 1;
                }
                // console.log("NÚMERO CONCIERTOS: " + this.numeroConciertos);
                // console.log("DATOS CONCIERTOS: " + JSON.stringify(this.conciertos));
            },
            (error) => {
                console.error('Error fetching conciertos:', error);
            }
        );
    }
    
    setPageTo(pageNum: number): void {
        if (pageNum < 1 || pageNum > this.numeroConciertos) {
            return;
        }
        this.filters.offset = (pageNum - 1) * this.limit;
        this.filters.limit = this.limit;
        console.log("Página cambiada a: " + pageNum + ", offset: " + this.filters.offset);
        
        // Actualizar la URL con los nuevos filtros
        this.Location.replaceState('/shop/' + btoa(JSON.stringify(this.filters)));
        
        this.getConciertos(this.filters);
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