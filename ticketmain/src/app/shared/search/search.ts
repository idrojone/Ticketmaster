import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Concierto } from 'src/app/core/models/conciertos.model';
import { Filters } from 'src/app/core/models/filters.model';
import { ConciertosService } from 'src/app/core/services/UserServices/conciertos.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search implements OnInit, OnDestroy {

  @Output() searchEvent: EventEmitter<Filters> = new EventEmitter();

  routeFilters!: string | null;
  filters: Filters = new Filters(8, 0); // Inicializar con valores correctos
  search_value: string | undefined = '';
  search: any;
  listProducts: Concierto[] = [];
  limit: number = 8;
  offset: number = 0;
  
  private routeSubscription: Subscription = new Subscription();

  private ConciertosService = inject(ConciertosService);
  private Router = inject(Router);
  private ActivatedRoute = inject(ActivatedRoute);
  private Location = inject(Location);

  ngOnInit(): void {
    // Cargar filtros iniciales
    this.loadFiltersFromRoute();
    
    // Escuchar cambios en los parámetros de la ruta
    this.routeSubscription = this.ActivatedRoute.paramMap.subscribe(params => {
      this.loadFiltersFromRoute();
    });
  }
  
  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
  
  private loadFiltersFromRoute(): void {
    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters');
    if (this.routeFilters !== null) {
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
      this.offset = this.filters.offset || 0;
      this.limit = this.filters.limit || 8;
      
      // Si hay filtros de género o fecha pero no hay nombre, limpiar el search
      if ((parsedFilters.genero || parsedFilters.fecha_inicio || parsedFilters.fecha_fin) && !parsedFilters.nombre) {
        this.search_value = '';
        this.filters.nombre = undefined;
        console.log('Campo de búsqueda limpiado por filtros aplicados');
      } else {
        // Eliminar el prefijo "ia," si existe para que no se muestre en el input
        const nombreValue = this.filters.nombre || '';
        this.search_value = nombreValue.startsWith('ia,') ? nombreValue.substring(3) : nombreValue;
      }
      
      this.searchEvent.emit(this.filters);
    } else {
      this.filters = new Filters(this.limit, this.offset);
      this.search_value = '';
    }
  }

  public type_event(weittingValue: any): void {
    if (!this.filters.nombre && !this.filters.genero) {
      this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters');
      if (this.routeFilters !== null) {
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
      }
    }
    console.log(this.filters, "FILTROS SEARCH");
    
    this.search = weittingValue;
    this.filters.nombre = this.search;
      
    if(this.filters.nombre?.startsWith("ia")){
      console.log("borrar para que no entre a la ia ");
      this.filters.nombre = this.filters.nombre!.substring(3);
    }
    
    if(this.search.startsWith("ia")){
      console.log("borrar para que no entre a la ia");
      this.filters.nombre = this.filters.nombre!.substring(3);
    }

    this.resetPagination();

    setTimeout(() => {
      this.searchEvent.emit(this.filters);
      this.Location.replaceState('/shop/' + btoa(JSON.stringify(this.filters)));

      if (this.search.length === 0) {
        this.getListConciertos();
      }
    }, 150);
  }

  getListConciertos() {
    console.log(this.filters, "FILTROS SEARCH");
    this.filters.nombre = this.search;
    this.filters.limit = this.filters.limit || this.limit;
    this.filters.offset = this.filters.offset || this.offset;
    
    this.ConciertosService.get_all_conciertos(this.filters).subscribe((data: any) => {
      if (data && data.conciertos) {
        this.listProducts = data.conciertos;
      } else {
        this.listProducts = data || [];
      }
      console.log(this.listProducts);
      if (data === null) {
        console.log('no hay datos');
      }
    });
  }

  public search_event(): void {

    if(this.filters.nombre!.length > 0){
      if(!this.filters.nombre!.startsWith("ia,")){
        this.filters.nombre = "ia,"+this.filters.nombre;
      }
    }else{
      this.filters.nombre = "";
    }

    this.resetPagination();
    this.searchEvent.emit(this.filters);
    this.Router.navigate(['/shop/' + btoa(JSON.stringify(this.filters))]);
  }
  
  private resetPagination(): void {
    this.offset = 0;
    this.filters.offset = this.offset;
    this.filters.limit = this.limit;
  }
}
