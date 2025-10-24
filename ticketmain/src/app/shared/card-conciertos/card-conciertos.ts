import { Component, Input, OnInit,  } from '@angular/core';
import { Concierto } from '../../core/models/conciertos.model';
import { CommonModule } from '@angular/common';
import { ZardButtonComponent } from '../components/button/button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card-conciertos',
  imports: [
    CommonModule,
    ZardButtonComponent,
    RouterLink
  ],
  standalone: true,
  templateUrl: './card-conciertos.html',
  styleUrl: './card-conciertos.css'
})
export class CardConciertos implements OnInit {
  @Input() concierto: Concierto= {} as Concierto;

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

}