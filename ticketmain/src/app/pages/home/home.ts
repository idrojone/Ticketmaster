import { Component } from '@angular/core';
import { ListConciertos } from "../../shared/list-conciertos/list-conciertos";
import { ListGeneros } from 'src/app/shared/list-generos/list-generos';

@Component({
  selector: 'app-home',
  imports: [ListConciertos, ListGeneros],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
