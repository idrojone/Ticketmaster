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

    getComentariosUsuario(username: string): Observable<any> {
        return this.apiService.get(`/${username}/user/comentarios`)
            .pipe(map(
                data => {
                    const comentariosArray: Comment[] = [];
                    data.profile.forEach((comentario: Comment) => {
                        comentariosArray.push(comentario);
                    });
                    return { comentarios: comentariosArray };
                }
            ));
    }

    getLikesUsuario(username: string): Observable<any> {
        return this.apiService.get(`/${username}/user/likes`)
            .pipe(map(
                data => {
                    console.log('Datos de likes recibidos:', data);
                    return data;
                }
            ));
    }

}