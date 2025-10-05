import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ZardDropdownModule } from '@shared/components/dropdown/dropdown.module';
import { ZardDividerComponent } from '@shared/components/divider/divider.component';
import { ZardButtonComponent } from '@shared/components/button/button.component';
import { ZardPopoverComponent, ZardPopoverDirective } from '@shared/components/popover/popover.component';
import { ZardDatePickerComponent } from '@shared/components/date-picker/date-picker.component';
import { ActivatedRoute, Router, TitleStrategy } from '@angular/router';
import { GenerosService } from 'src/app/core/services/generos.service';
import { Genero } from 'src/app/core/models/generos.model';
import { Filters } from '../../core/models/filters.model';

@Component({
  selector: 'app-filters',
  imports: [
    ZardDropdownModule,
    ZardButtonComponent,
    ZardPopoverComponent,
    ZardPopoverDirective,
    ZardDatePickerComponent
  ],
  standalone: true,
  templateUrl: './filters.html',
  styleUrl: './filters.css',


})
export class FiltersComponent implements OnInit {

  @Input() listGeneros: Genero[] = [];
  @Output() eventofiltros : EventEmitter<Filters> = new EventEmitter;

  generos: Genero[] = [];
  generosService = inject(GenerosService);
  
  routeFilters: string | null = null;
  filters!: Filters;

  // Signal para el género seleccionado//ESTA LINEA
  selectedGenero = signal<Genero | null>(null);
  
  // Signals para el rango de fechas
  startDate = signal<Date | null>(null);
  endDate = signal<Date | null>(null);

  constructor(private ActivatedRoute: ActivatedRoute, private Router: Router, private Location: Location) {
    this.routeFilters = this.ActivatedRoute.snapshot.paramMap.get('filters');

  }

  ngOnInit(): void {
    console.log("ngOnInit filtros");
    this.fillFiltros();
    this.routeFilters= this.ActivatedRoute.snapshot.paramMap.get('filters');
    this.ActivatedRoute.snapshot.paramMap.get('filters') != undefined ? this.Highlights() : "";
    // console.log(this.routeFilters);
  }

  fillFiltros(){
    this.generosService.get_all_generos().subscribe(
      (data) => {
          // console.log(data);
          this.generos = data as Genero[];
      },
      (error) => {
          console.error('Error fetching generos:', error);
      }
    );
  }
  
  Highlights(){
    let routeFilters= JSON.parse(atob(this.ActivatedRoute.snapshot.paramMap.get('filters') || ''));
    // console.log("entra higthligth " + JSON.stringify(routeFilters));
    if(routeFilters.nombre == undefined){
      this.selectedGenero.set({nombre: routeFilters.genero_nombre, slug: routeFilters.genero_slug, img: '', descripcion: ''});
      this.startDate.set(routeFilters.startDate);
      this.endDate.set(routeFilters.endDate);
      // this.startDate.set(routeFilters.startDate ? new Date(routeFilters.startDate) : null);
      // this.endDate.set(routeFilters.endDate ? new Date(routeFilters.endDate) : null);

    }
  }

  filter_products(){
    this.routeFilters=this.ActivatedRoute.snapshot.paramMap.get('filters');
    if(this.routeFilters != null){
      // console.log("entra");
      this.filters=new Filters();
      this.filters=JSON.parse(atob(this.routeFilters));
      // console.log(this.filters);
    }else {
      this.filters=new Filters();
    }

    if(this.selectedGenero()){
      this.filters.genero=this.selectedGenero()?.slug;
      this.filters.genero_nombre=this.selectedGenero()?.nombre
      console.log(this.filters);
    }

    this.filters.fecha_inicio=undefined;
    this.filters.fecha_fin=undefined;

    if(this.startDate() && this.endDate()){
      this.filters.fecha_inicio=this.formatDateToLocal(this.startDate()!);
      this.filters.fecha_fin=this.formatDateToLocal(this.endDate()!);
    }else if(this.startDate() && !this.endDate()){
      this.filters.fecha_inicio=this.formatDateToLocal(this.startDate()!);
      this.filters.fecha_fin=undefined;
    }else if(!this.startDate() && this.endDate()){
      this.filters.fecha_inicio=undefined;
      this.filters.fecha_fin=this.formatDateToLocal(this.endDate()!);
    }

    setTimeout(() => {
      // console.log("timeout");
      this.Router.navigate(['/shop', btoa(JSON.stringify(this.filters))]);
      this.eventofiltros.emit(this.filters)
    }, 400);

  }

  //GENEROS
  // Método para seleccionar un género
  onGeneroSelect(genero: Genero): void {
    // Si ya está seleccionado, lo deseleccionamos
    if (this.selectedGenero()?.slug === genero.slug) {
      this.selectedGenero.set(null);
      console.log('Género deseleccionado');
    } else {
      // Si no está seleccionado, lo seleccionamos
      this.selectedGenero.set(genero);
      console.log('Género seleccionado:', genero);
    }
  }  

  // Método para verificar si un género está seleccionado
  isGeneroSelected(genero: Genero): boolean {
    return this.selectedGenero()?.slug === genero.slug;
  }

  // Método para limpiar género seleccionado
  clearSelectedGenero(): void {
    this.selectedGenero.set(null);
  }

//////FECHAS
  // Método para manejar cambios de fecha de inicio
  onStartDateChange(date: Date | null): void {
    this.startDate.set(date);
    console.log('Start date:', date);
    
    // Validar que la fecha de inicio no sea posterior a la fecha de fin
    if (date && this.endDate() && date > this.endDate()!) {
      this.endDate.set(null);
      console.log('Fecha de fin limpiada porque era anterior a la fecha de inicio');
    }
    
    this.logDateRange();
  }

  // Método para manejar cambios de fecha de fin
  onEndDateChange(date: Date | null): void {
    this.endDate.set(date);
    console.log('End date:', date);
    
    // Validar que la fecha de fin no sea anterior a la fecha de inicio
    if (date && this.startDate() && date < this.startDate()!) {
      this.startDate.set(null);
      console.log('Fecha de inicio limpiada porque era posterior a la fecha de fin');
    }
    
    this.logDateRange();
  }

  // Método para obtener el rango de fechas completo
  getDateRange(): { start: Date | null; end: Date | null } {
    return {
      start: this.startDate(),
      end: this.endDate()
    };
  }

  // Método para verificar si hay un rango válido
  hasValidDateRange(): boolean {
    return this.startDate() !== null || this.endDate() !== null;
  }

  // Método para verificar si el rango está completo
  isDateRangeComplete(): boolean {
    return this.startDate() !== null && this.endDate() !== null;
  }

  // Método para limpiar todas las fechas
  clearAllDates(): void {
    this.startDate.set(null);
    this.endDate.set(null);
    console.log('Todas las fechas limpiadas');
  }

  // Método para establecer la fecha de inicio como hoy
  setStartDateToday(): void {
    this.startDate.set(new Date());
  }

  // Método para establecer la fecha de fin como hoy
  setEndDateToday(): void {
    this.endDate.set(new Date());
  }

  // Método privado para logging del rango
  private logDateRange(): void {
    // const range = this.getDateRange();
    // if (range.start && range.end) {
    //   console.log(`Rango completo: ${range.start.toLocaleDateString('es-ES')} - ${range.end.toLocaleDateString('es-ES')}`);
    //   // Aquí puedes agregar lógica para filtrar conciertos por rango
    //   // this.filterConciertosByDateRange(range.start, range.end);
    // } else if (range.start) {
    //   console.log(`Solo fecha de inicio: ${range.start.toLocaleDateString('es-ES')}`);
    //   // this.filterConciertosByStartDate(range.start);
    // } else if (range.end) {
    //   console.log(`Solo fecha de fin: ${range.end.toLocaleDateString('es-ES')}`);
    //   // this.filterConciertosByEndDate(range.end);
    // }
  }

  // Método para obtener la fecha de hoy
  getToday(): Date {
    return new Date();
  }

  // Método para verificar si una fecha es hoy
  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  // Método para verificar si una fecha es válida
  isValidDate(date: Date | null): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  // Método para formatear fecha a string local (evita problemas de zona horaria)
  private formatDateToLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}