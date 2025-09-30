import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConciertoCarrousel, GeneroCarrousel, ConciertoCarrouselDetails, GeneroCarrouselSecundario } from 'src/app/core/models/carousel.model';
import { EmblaCarouselDirective, EmblaCarouselType } from 'embla-carousel-angular';
import type { EmblaOptionsType } from 'embla-carousel';
import { DetailsRoutingModule } from "src/app/pages/details/details-routing-module";
import { RouterLink } from '@angular/router';



@Component({
    selector: 'app-items-carousel',
    imports: [EmblaCarouselDirective, DetailsRoutingModule, RouterLink],
    templateUrl: './items-carousel.html',
    styleUrls: [
        './items-carousel.css'
    ],
    standalone: true
})
export class ItemsCarousel implements OnInit {
    @Input() generos?: GeneroCarrousel[];
    @Input() conciertos?: ConciertoCarrousel[];
    @Input() item_concierto_details?: ConciertoCarrouselDetails[];
    @Input() item_generos_secundario?: GeneroCarrouselSecundario[];

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

    carouselConciertosOptions: EmblaOptionsType = {
        align: 'start',
        slidesToScroll: 1, // Cambiado a 1 para mejor control
        containScroll: 'trimSnaps',
        dragFree: true, // Habilitamos drag libre para mejor experiencia
        loop: true,
        skipSnaps: false,
        duration: 25,
        dragThreshold: 10,
        breakpoints: {
            '(max-width: 1024px)': { slidesToScroll: 1 },
            '(max-width: 768px)': { slidesToScroll: 1 },
            '(max-width: 480px)': { slidesToScroll: 1 }
        },
        // autoplay: { delay: 3000}
    };

    carouselGenerosSecundarioOptions: EmblaOptionsType = {
        align: 'start',
        slidesToScroll: 1, // Cambiado a 1 para mejor control
        containScroll: 'trimSnaps',
        dragFree: true, // Habilitamos drag libre para mejor experiencia
        loop: true,
        skipSnaps: false,
        duration: 25,
        dragThreshold: 10,
        breakpoints: {
            '(max-width: 1024px)': { slidesToScroll: 1 },
            '(max-width: 768px)': { slidesToScroll: 1 },
            '(max-width: 480px)': { slidesToScroll: 1 }
        },
        // autoplay: { delay: 3000}
    };

    carouselConceritoDetailsOptions: EmblaOptionsType = {  
        align: 'start',
        slidesToScroll: 1,
        containScroll: 'trimSnaps',
        dragFree: true,
        loop: true,
        skipSnaps: false,
        duration: 25,
        dragThreshold: 10,
        breakpoints: {
            '(max-width: 1024px)': { slidesToScroll: 1 },
            '(max-width: 768px)': { slidesToScroll: 1 },
            '(max-width: 480px)': { slidesToScroll: 1 }
        }
    }

    // Autoplay para conciertos
    startAutoplay(): void {
        if (this.emblaApi) {
            setInterval(() => {
                this.emblaApi.scrollNext();
            }, 3000); // Cambia cada 3 segundos
        }
    }

    ngOnInit(): void {
        this.startAutoplay();
    }

    ngAfterViewInit(): void {
        if (this.emblaRef && this.emblaRef.emblaApi) {
            this.emblaApi = this.emblaRef.emblaApi;
        }
    }

}
