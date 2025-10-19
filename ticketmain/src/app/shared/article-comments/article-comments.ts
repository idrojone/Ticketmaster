import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { Comment } from 'src/app/core/models/comment.model';
import { CommentsService } from 'src/app/core';
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-article-comments',
  imports: [],
  templateUrl: './article-comments.html',
  styleUrl: './article-comments.css'
})
export class ArticleComments {
  public isLoading = signal(true);
  public comments = signal<Comment[]>([]);  // Debe ser array de Comment, no Comment | null

  private route = inject(ActivatedRoute);
  private commentService = inject(CommentsService);

  slug: string | null = null;

  @Output() comentarios = new EventEmitter<Array<Comment>>();

  constructor(){
    this._loadComments();
  }

  private _loadComments(): void {
    this.isLoading.set(true);
    this.slug = this.route.snapshot.paramMap.get('slug');

    if (this.slug === null) {
      this.isLoading.set(false);
      return;
    }

    // Usar this.slug en lugar de slug sin this
    this.commentService.getAllComments(this.slug).subscribe({
      next: (comments) => {
        this.comments.set(comments);
        this.isLoading.set(false);
        this.comentarios.emit(comments);
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.comments.set([]);  // Array vacío en caso de error
        this.isLoading.set(false);
      }
    });
  }

}
