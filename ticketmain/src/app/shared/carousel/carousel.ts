import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';
import { CarouselService } from 'src/app/core/services/carousel.service';
import { GeneroCarrousel, ConciertoCarrousel, ConciertoCarrouselDetails } from 'src/app/core/models/carousel.model';
import { ItemsCarousel } from 'src/app/shared/items-carousel/items-carousel';

@Component({
	selector: 'app-carousel',
	imports: [
		ItemsCarousel
	],
	templateUrl: './carousel.html',
	styleUrl: './carousel.css',
	standalone: true
})
export class Carousel implements OnInit {

	@Input() page !: string;
	@Input() slug?: string | null;
	item_generos?: GeneroCarrousel[];
	item_conciertos?: ConciertoCarrousel[];
	item_concierto_details?: ConciertoCarrouselDetails[];
	@Input() imagenesShow?: any;

	carouselService = inject(CarouselService);

	ngOnInit(): void {
		console.log("Página Carousel: ", this.page);
		this.loadCarouselItems();
	}

	loadCarouselItems(): void {
		if (this.page === 'carousel-home-generos') {
			this.get_carousel_generos();
		} else if (this.page === 'carousel-home-conciertos') {
			this.get_carousel_conciertos();
		} else if (this.page === 'carousel-details-conciertos') {
			// console.log("Imágenes Show Carousel: ", this.imagenesShow);
			this.get_carousel_concierto_details(this.imagenesShow);
		}
	}

	get_carousel_concierto_details(imagenesShow: any) {
		console.log("Detalles Concierto Carousel: ", imagenesShow);
		console.log("Tipo de datos: ", typeof imagenesShow, "Es array: ", Array.isArray(imagenesShow));
		
		// Asegurarse de que es un array
		if (Array.isArray(imagenesShow)) {
			this.item_concierto_details = imagenesShow;
		} else if (imagenesShow) {
			// Si no es array, convertirlo en array
			this.item_concierto_details = [imagenesShow];
		} else {
			this.item_concierto_details = [];
		}
		
		console.log("item_concierto_details final: ", this.item_concierto_details);
	}

	get_carousel_conciertos() {
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

	get_carousel_generos() {
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
