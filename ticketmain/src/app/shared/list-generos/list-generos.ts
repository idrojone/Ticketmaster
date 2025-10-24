import { Component, inject, OnInit } from '@angular/core';
import { Genero } from 'src/app/core/models/generos.model';
import { GenerosService } from 'src/app/core/services/generos.service';
import { CardGeneros } from '../card-generos/card-generos';

@Component({
  selector: 'app-list-generos',
  imports: [CardGeneros],
  templateUrl: './list-generos.html',
  styleUrl: './list-generos.css',
  standalone: true
})
export class ListGeneros implements OnInit {
  generos: Genero[] = [];
  generoService = inject(GenerosService);


  ngOnInit() {
    this.get_generos();
  }

  get_generos() {
    this.generoService.get_all_generos().subscribe(
      (data: Genero[]) => {
        console.log('Generos recibidos:', data);
        this.generos = data;
      },
      (error) => {
        console.error('Error fetching generos:', error);
        this.generos = [];
      }
    );
  }
}
