import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { EmblaCarouselDirective, EmblaCarouselType } from 'embla-carousel-angular';
import { CarouselService } from 'src/app/core/services/carousel.service';
import { GeneroCarrousel } from 'src/app/core/models/carousel.model';
import type { EmblaOptionsType } from 'embla-carousel';

@Component({
  selector: 'app-carousel-generos',
  imports: [EmblaCarouselDirective],
  templateUrl: './carousel-generos.html',
  styleUrl: './carousel-generos.css',
  standalone: true
})
export class CarouselGeneros implements OnInit , AfterViewInit {
  @ViewChild(EmblaCarouselDirective) emblaRef!: EmblaCarouselDirective;
  emblaApi!: EmblaCarouselType;

  carouselGeneros: GeneroCarrousel[] = [];
  carouselService = inject(CarouselService);

  // Opciones del carrusel
  carouselOptions: EmblaOptionsType = {
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    dragFree: true,
    loop: false,
    skipSnaps: false
  };

  ngOnInit(): void {
    this.get_carousel();
  }

  ngAfterViewInit(): void {
    if (this.emblaRef && this.emblaRef.emblaApi) {
      this.emblaApi = this.emblaRef.emblaApi;
    }
  }

  get_carousel(){
    this.carouselService.get_carousel_data().subscribe(
      (data) => {
        // console.log("Carousel: "+data);
        this.carouselGeneros = data as GeneroCarrousel[];
        console.log("Carousel Generos: ", this.carouselGeneros);
      },
      (error) => {
        console.error('Error fetching carousel data:', error);
      }
    );
  }

  // // Método para manejar errores de carga de imagen
  // onImageError(event: Event): void {
  //   const imgElement = event.target as HTMLImageElement;
  //   imgElement.src = '/assets/img/placeholder-genre.png'; // Imagen por defecto
  //   imgElement.alt = 'Imagen no disponible';
  // }

}
