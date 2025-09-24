import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Genero } from 'src/app/core/models/generos.model';

@Component({
  selector: 'app-card-generos',
  imports: [
    CommonModule
  ],
  templateUrl: './card-generos.html',
  styleUrl: './card-generos.css',
  standalone: true
})
export class CardGeneros implements OnInit {
  @Input() genero: Genero = {} as Genero;
  
  ngOnInit(): void {

  }
}
