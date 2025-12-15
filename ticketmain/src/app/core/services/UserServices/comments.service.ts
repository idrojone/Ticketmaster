import { inject, Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { map, Observable } from "rxjs";
import { Comment } from "../../models/comment.model";

// Interfaces para tipar las respuestas de la API
interface CommentResponse {
    comentario: Comment;
}

interface CommentsResponse {
    comentarios: Comment[];
}

@Injectable({
    providedIn: 'root'
})
export class CommentsService {

    apiService = inject(ApiService);

    addComment(slug: string, payload: string): Observable<Comment> {
        return this.apiService.post(
            `/${slug}/comentarios`,
            { contenido: payload }
        ).pipe(
            map((response: CommentResponse) => response.comentario)
        );
    }

    getAllComments(slug: string): Observable<Comment[]> {
        return this.apiService.get(
            `/${slug}/comentarios`
        ).pipe(
            map((response: CommentsResponse) => response.comentarios)
        );
    }
    
    deleteComment(slug: string, id: string): Observable<void> {
        return this.apiService.delete(
            `/${slug}/comentarios/${id}`
        );
    }
}