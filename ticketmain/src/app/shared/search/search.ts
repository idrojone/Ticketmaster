import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Concierto } from 'src/app/core/models/conciertos.model';
import { Filters } from 'src/app/core/models/filters.model';
import { ConciertosService } from 'src/app/core/services/conciertos.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search implements OnInit {

  @Output() searchEvent: EventEmitter<Filters> = new EventEmitter();

  routeFilters!: string | null;
  filters: Filters = new Filters();
  search_value: string | undefined = '';
  search: any;
  listProducts: Concierto[] = [];

  private ConciertosService = inject(ConciertosService);
  private Router = inject(Router);
  private ActivatedRoute = inject(ActivatedRoute);
  private Location = inject(Location);
  ngOnInit(): void {
    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters');
    if (this.routeFilters !== null) {
      this.filters = JSON.parse(atob(this.routeFilters));
      this.searchEvent.emit(this.filters);
    }
    this.search_value = this.filters.nombre || undefined;
  }

  public type_event(weittingValue: any): void {


    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters');
    if (this.routeFilters !== null) {
      this.filters = JSON.parse(atob(this.routeFilters));
    }
    console.log(this.filters, "FILTROS SEARCH");
    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters');
    this.search = weittingValue;
    this.filters.nombre = this.search;

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
    this.ConciertosService.get_all_conciertos(this.filters).subscribe((data) => {
      (data: any) => {
        this.listProducts = data;
        console.log(this.listProducts);
        if (data === null) {
          console.log('no hay datos');
        }
      }
    });
  }

  public search_event(data: any): void {
    if (typeof data.search_value === 'string') {
      this.filters = data.search_value;
      // this.filters.offset = 0;
      this.Router.navigate(['/shop/' + btoa(JSON.stringify(this.filters))]);
    }
  }
}
