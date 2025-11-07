import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet]
})
export class Dashboard {
  // Dashboard layout component
}

