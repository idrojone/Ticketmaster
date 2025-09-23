import { Component } from '@angular/core';
import { ListConciertos } from "../../shared/list-conciertos/list-conciertos";

@Component({
  selector: 'app-home',
  imports: [ListConciertos],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
