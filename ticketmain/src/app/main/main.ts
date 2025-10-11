import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Footer } from "../shared/layout/footer/footer";
import { Header } from "../shared/layout/header/header";
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-main',
  imports: [
    RouterModule,
    HttpClientModule,
    CommonModule,
    Footer,
    Header
  ],
  templateUrl: './main.html',
  styleUrls: ['./main.css'],
  standalone: true
})
export class Main implements OnInit {

  userService = inject(UserService);
  ngOnInit() {
    this.userService.populate();
  }
}
