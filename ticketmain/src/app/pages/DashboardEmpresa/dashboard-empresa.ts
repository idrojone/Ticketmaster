import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserTypeService } from 'src/app/core/services/user-type.service';

@Component({
  selector: 'app-dashboard-empresa',
  templateUrl: './dashboard-empresa.html',
  styleUrl: './dashboard-empresa.css',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet]
})
export class DashboardEmpresa implements OnInit {
  private userTypeService = inject(UserTypeService);

  ngOnInit(): void {
    console.log('Dashboard Empresa initialized');
    this.checkUserType(); 
  }

  private checkUserType(): void {
    if (this.userTypeService.getUserType() === 'empresa') {
      console.log('Acceso de empresa')   
    }
  }
}
