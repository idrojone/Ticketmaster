import { Component } from '@angular/core';
import { ListConciertos } from "../../shared/list-conciertos/list-conciertos";
import { ListGeneros } from 'src/app/shared/list-generos/list-generos';
import { CarouselGeneros } from 'src/app/shared/carousel-generos/carousel-generos';

@Component({
  selector: 'app-home',
  imports: [ListConciertos, ListGeneros, CarouselGeneros],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
