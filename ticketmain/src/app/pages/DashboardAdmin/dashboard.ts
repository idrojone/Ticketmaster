import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserTypeService } from 'src/app/core/services/user-type.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet]
})
export class Dashboard  implements OnInit {
  private userTypeService = inject(UserTypeService);

  ngOnInit(): void {
    console.log('Dashboard initialized');
    this.checkUserType(); 
  }

  private checkUserType(): void {
    if (this.userTypeService.getUserType() === 'empresa') {
      console.log('Accesso de empresa')   
    }
  }
}

