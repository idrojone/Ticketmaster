import { AfterViewInit, Component, Inject, inject, Input, OnInit, ViewChild } from '@angular/core';
import { EmblaCarouselDirective, EmblaCarouselType } from 'embla-carousel-angular';
import { CarouselService } from 'src/app/core/services/carousel.service';
import { GeneroCarrousel } from 'src/app/core/models/carousel.model';
import type { EmblaOptionsType } from 'embla-carousel';
import { ItemsCarousel } from 'src/app/shared/items-carousel/items-carousel';

@Component({
  selector: 'app-carousel-generos',
  imports: [
    ItemsCarousel
  ],
  templateUrl: './carousel-generos.html',
  styleUrl: './carousel-generos.css',
  standalone: true
})
export class CarouselGeneros implements OnInit {

  @Input() page !: string;
  item_generos ?: GeneroCarrousel[];

  carouselService = inject(CarouselService);

  constructor( ) { }

  ngOnInit(): void {
    // this.get_carousel();
    console.log("Página Carousel: ", this.page);
    this.loadCarouselItems();

  }

  loadCarouselItems(): void {
    if (this.page === 'carousel-home-generos') {
      this.get_carousel_generos();
    }

  }

  get_carousel_generos(){
    this.carouselService.get_carousel_data().subscribe(
      (data) => {
        // console.log("Carousel: "+data);
        this.item_generos = data as GeneroCarrousel[];
        // console.log("Carousel Generos: ", this.item_generos);
      },
      (error) => {
        console.error('Error fetching carousel data:', error);
      }
    );
  }

}
