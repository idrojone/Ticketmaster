import { AfterViewInit, Component, Inject, inject, Input, OnInit, ViewChild } from '@angular/core';
import { EmblaCarouselDirective, EmblaCarouselType } from 'embla-carousel-angular';
import { CarouselService } from 'src/app/core/services/carousel.service';
import { GeneroCarrousel,ConciertoCarrousel } from 'src/app/core/models/carousel.model';
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
  item_conciertos ?: ConciertoCarrousel[];

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
    }else if (this.page === 'carousel-home-conciertos') {
      this.get_carousel_conciertos();
    }

  }

  get_carousel_conciertos(){
    this.carouselService.get_carousel_conciertos().subscribe(
      (data) => {
        // console.log("Carousel: "+data);
        this.item_conciertos = data as ConciertoCarrousel[];
        console.log("Carousel Conciertos: ", this.item_conciertos);
      },
      (error) => {
        console.error('Error fetching carousel data:', error);
      }
    );
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
