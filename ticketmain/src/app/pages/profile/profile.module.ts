import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { Profile } from './profile';


@NgModule({
    imports: [
        CommonModule,
        ProfileRoutingModule,
        Profile
    ]
})
export class ProfileModule { }
