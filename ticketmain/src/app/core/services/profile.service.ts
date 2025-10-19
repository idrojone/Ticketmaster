import { inject } from "@angular/core";
import { ApiService } from "./api.service";

export class ProfileService {

    apiService = inject(ApiService);
    
    getProfile(username: string) {
        // return this.apiService.get(`/profiles/${username}`);
    }

}