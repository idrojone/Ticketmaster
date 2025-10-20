import { inject, Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { ApiService } from "./api.service";
import { Profile } from "../models/profile.model";

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    private apiService = inject(ApiService);
    
    getProfile(username: string): Observable<Profile> {
        return this.apiService.get(`/${username}`)
            .pipe(map(data => data.profile));
    }

    followUser(username: string): Observable<Profile> {
        return this.apiService.post(`/${username}/user/follow`, {})
            .pipe(map(data => data.profile));
    }

    unfollowUser(username: string): Observable<Profile> {
        return this.apiService.delete(`/${username}/user/unfollow`)
            .pipe(map(data => data.profile));
    }

    

}