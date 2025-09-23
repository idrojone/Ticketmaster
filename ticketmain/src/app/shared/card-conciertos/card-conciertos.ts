import { Component, Input, OnInit,  } from '@angular/core';
import { Concierto } from '../../core/models/conciertos.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-conciertos',
  imports: [
    CommonModule
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
