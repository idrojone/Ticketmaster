import { Component } from '@angular/core';
import { ListConciertos } from "../../shared/list-conciertos/list-conciertos";
import { ListGeneros } from 'src/app/shared/list-generos/list-generos';
import { Carousel } from 'src/app/shared/carousel/carousel';

@Component({
  selector: 'app-home',
  imports: [ListConciertos, Carousel],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
