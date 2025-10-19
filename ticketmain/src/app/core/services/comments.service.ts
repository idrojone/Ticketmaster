import { inject, Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { map, Observable } from "rxjs";
import { Comment } from "../models/comment.model";

// Interfaces para tipar las respuestas de la API
interface CommentResponse {
    comment: Comment;
}

interface CommentsResponse {
    comments: Comment[];
}

@Injectable({
    providedIn: 'root'
})
export class CommentsService {

    apiService = inject(ApiService);

    /**
     * Añade un comentario a un concierto
     * POST /:slug/comentarios
     */
    addComment(slug: string, payload: string): Observable<Comment> {
        return this.apiService.post(
            `/${slug}/comentarios`,
            { comment: { body: payload } }
        ).pipe(
            map((response: CommentResponse) => response.comment)
        );
    }

    /**
     * Obtiene todos los comentarios de un concierto
     * GET /:slug/comentarios
     */
    getAllComments(slug: string): Observable<Comment[]> {
        return this.apiService.get(
            `/${slug}/comentarios`
        ).pipe(
            map((response: CommentsResponse) => response.comments)
        );
    }

    /**
     * Elimina un comentario de un concierto
     * DELETE /:slug/comentarios/:id
     */
    deleteComment(slug: string, id: number): Observable<void> {
        return this.apiService.delete(
            `/${slug}/comentarios/${id}`
        );
    }
}