import { Component } from '@angular/core';
import { ListConciertos } from "@shared/list-conciertos/list-conciertos";

@Component({
  selector: 'app-shop',
  imports: [ListConciertos],
  templateUrl: './shop.html',
  styleUrl: './shop.css'
})
export class Shop {

}