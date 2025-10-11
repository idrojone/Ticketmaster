import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthRoutingModule } from "../auth/auth-routing.module";
import { RouterLink } from '@angular/router';
import { ZardButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-profile',
  imports: [
    ZardButtonComponent,
    AuthRoutingModule,
    RouterLink
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  standalone: true
})
export class Profile implements OnInit {

  private userService = inject(UserService);
  private cd = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  currentUser?: User;
  editable: boolean = false;

  ngOnInit() {
    this.userService.currentUser
      .pipe(takeUntil(this.destroy$))
      .subscribe((userData: User) => {
        this.currentUser = (userData && Object.keys(userData).length > 0) ? userData : undefined;
        this.cd.markForCheck();
      });

    console.log(this.currentUser);


    // if (this.currentUser != undefined) {
    //   this.editable = this.userService.getCurrentUser().username === this.currentUser?.username ? true : false;
    // }
    // console.log(this.editable);

  }
  // hook en angular que se ejecuta en el momento antes de que el componente se destruya
  ngOnDestroy() {
    this.destroy$.next(); 
    this.destroy$.complete();
  }

}
