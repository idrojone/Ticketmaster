import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-header',
  imports: [ ],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true
})
export class Header implements OnInit {

  private userService = inject(UserService);
  private cd = inject(ChangeDetectorRef);

  constructor() {
    this.currentUser = {} as User;
  }

  ngOnInit() {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
        this.cd.markForCheck();
      }
    );
  }

}
