import { AfterViewInit, Component, inject, Input, OnInit } from '@angular/core';
import { CarouselService } from 'src/app/core/services/UserServices/carousel.service';
import { GeneroCarrousel, ConciertoCarrousel, ConciertoCarrouselDetails, GeneroCarrouselSecundario, Imagenes } from 'src/app/core/models/carousel.model';
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
	item_imagenes?: Imagenes[];
	item_conciertos?: ConciertoCarrousel[];
	item_concierto_details?: ConciertoCarrouselDetails[];
	item_generos_secundario?: GeneroCarrouselSecundario[];
	@Input() imagenesShow?: any;

	carouselService = inject(CarouselService);

	ngOnInit(): void {
		// console.log("Página Carousel: ", this.page);
		this.loadCarouselItems();
	}

	loadCarouselItems(): void {
		if (this.page === 'carousel-home-generos' || this.page === 'carousel-home-generos-secundario') {
			this.get_carousel_generos();
		} else if (this.page === 'carousel-home-conciertos') {
			this.get_carousel_conciertos();
		} else if (this.page === 'carousel-details-conciertos') {
			this.get_carousel_concierto_details(this.imagenesShow);
		} else if (this.page === 'imagenes') {
			this.get_carousel_imagenes();
		}
	}

	get_carousel_imagenes() {
		const imagenes = [
			{ imagen: 'assets/img/img1.jpg' },
			{ imagen: 'assets/img/img2.jpg' },
			{ imagen: 'assets/img/img3.jpg' },
			{ imagen: 'assets/img/img4.jpg' },
			// { imagen: 'assets/img/img5.jpg' },
			{ imagen: 'assets/img/img6.jpg' },
		];
		this.item_imagenes = imagenes;
		// console.log("Carousel Imágenes: ", this.item_imagenes);
	}

	get_carousel_concierto_details(imagenesShow: any) {		
		// Asegurarse de que es un array
		if (Array.isArray(imagenesShow)) {
			this.item_concierto_details = imagenesShow;
		} else if (imagenesShow) {
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
				// this.item_generos = data as GeneroCarrousel[];
				this.item_generos_secundario = data as GeneroCarrouselSecundario[];
				console.log("Carousel Géneros Secundario: ", this.item_generos_secundario);
			},
			(error) => {
				console.error('Error fetching carousel data:', error);
			}
		);
	}

}
