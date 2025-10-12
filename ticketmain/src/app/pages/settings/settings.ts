import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-settings',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})

export class Settings implements OnInit {

  user: User = {} as User;
  settingsForm: FormGroup = new FormGroup({});
  errors: { [key: string]: any } = {};
  isSubmitting = false;

  router = inject(Router);
  userService = inject(UserService);
  cd = inject(ChangeDetectorRef);
  fb = inject(FormBuilder);

  constructor() {
    this.settingsForm = this.fb.group({
      image: '',
      username: '',
      bio: '',
      email: '',
      password: ''
    });
  }

  ngOnInit() {
    Object.assign(this.user, this.userService.getCurrentUser());
    this.settingsForm.patchValue(this.user);
    this.cd.markForCheck();
  }

  submitForm() {
    this.isSubmitting = true;

    this.updateUser(this.settingsForm.value);

    this.userService.update(this.user).subscribe(
      updatedUser => this.router.navigateByUrl('/profile/' + updatedUser.username),
      err => {
        this.errors = err;
        this.isSubmitting = false;
        this.cd.markForCheck();
      }
    );
  }

  updateUser(values: Object) {
    Object.assign(this.user, values);
  }
}
