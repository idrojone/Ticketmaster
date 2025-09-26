import { Component, Input, OnInit, ViewChild, viewChild } from '@angular/core';
import { GeneroCarrousel } from 'src/app/core/models/carousel.model';
import { EmblaCarouselDirective, EmblaCarouselType } from 'embla-carousel-angular';
import type { EmblaOptionsType } from 'embla-carousel';


@Component({
  selector: 'app-items-carousel',
  imports: [EmblaCarouselDirective],
  templateUrl: './items-carousel.html',
  styleUrl: './items-carousel.css',
  standalone: true
})
export class ItemsCarousel implements OnInit{
  @Input() generos ?: GeneroCarrousel[];

  @ViewChild(EmblaCarouselDirective) emblaRef!: EmblaCarouselDirective;
  emblaApi!: EmblaCarouselType;

  carouselGenerosOptions: EmblaOptionsType = {
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    dragFree: false, // Deshabilitamos el drag libre para forzar el snap
    loop: true, // Habilitamos loop para mejor experiencia
    skipSnaps: false, // Mantenemos los snaps activos
    duration: 25, // Duración más rápida del snap
    dragThreshold: 10 // Umbral bajo para activar el cambio de slide
  };

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (this.emblaRef && this.emblaRef.emblaApi) {
      this.emblaApi = this.emblaRef.emblaApi;
    }
  }

}
