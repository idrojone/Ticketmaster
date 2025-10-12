import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { Subject } from 'rxjs';
import { AuthRoutingModule } from "../auth/auth-routing.module";
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  private ActivatedRoute = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  // private profileService = inject(ProfileService);

  currentUser?: User;
  editable: boolean = false;
  username?: string | null;
  datosProfile: any;
  noEncutraUsuario: boolean = false;


  ngOnInit() {

    this.username =  this.ActivatedRoute.snapshot.paramMap.get('username');

    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = (userData && Object.keys(userData).length > 0) ? userData : undefined;
        this.cd.markForCheck();
      }
    );

    this.userService.getUserProfile(this.username).subscribe(
      profile => {
        this.datosProfile = profile;
        console.log('Profile data:', profile);
      },
      error => {
        console.error('Error fetching profile:', error);
        this.noEncutraUsuario = true;
      }
    );

    console.log(this.userService.getCurrentUser().username);

    this.editable = this.userService.getCurrentUser().username === this.username ? true : false;
    console.log(this.editable);

  }
  // hook en angular que se ejecuta en el momento antes de que el componente se destruya
  ngOnDestroy() {
    this.destroy$.next(); 
    this.destroy$.complete();
  }

}
