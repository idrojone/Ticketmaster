import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Comment } from 'src/app/core/models/comment.model';
import { CommentsService } from 'src/app/core';
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-article-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './article-comments.html',
  styleUrls: ['./article-comments.css']
})
export class ArticleComments {
  public isLoading = signal(true);
  public comments = signal<Comment[]>([]);  // Debe ser array de Comment, no Comment | null
  public newComment = signal('');
  public currentUser = signal<User | null>(null);

  private route = inject(ActivatedRoute);
  private commentService = inject(CommentsService);
  private userService = inject(UserService);
  private router = inject(Router);

  slug: string | null = null;

  // @Output() comentarios = new EventEmitter<Array<Comment>>();

  constructor(){
    this._loadComments();
    this._getCurrentUser();
  }

  addComment(): void {
    console.log("Añadiendo comentario...");

    console.log('Usuario actual:', this.currentUser()?.username);

    if (!this.currentUser()?.username == undefined || !this.currentUser()?.token) {
      Swal.fire({
        icon: 'warning',
        title: 'Debes iniciar sesión para agregar un comentario',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        // Guarda la URL actual para volver después de login
        const returnUrl = this.router.url;
        this.router.navigate(['/auth/login'], { 
          queryParams: { returnUrl: returnUrl } 
        });
      });
      return;
    }else {
      const slug = this.slug;
      const payload = this.newComment();

      if (!slug || !payload || this.newComment().trim().length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'El comentario no puede estar vacío',
          confirmButtonText: 'Aceptar'
        });
        return;
      }
      this.isLoading.set(true);
      this.commentService.addComment(slug, payload).subscribe({
        next: (c) => {
          // Recargar comentarios
          this._loadComments();
          this.newComment.set('');
        },
        error: (err) => {
          console.error('Error adding comment', err);
          this.isLoading.set(false);
        }
      });
    }

  }

  deleteComment(comment: Comment): void {

    Swal.fire({
      icon: 'question',
      title: '¿Quieres eliminar el comentario?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const slug = this.slug;
        if (!slug) return;
        this.isLoading.set(true);
        this.commentService.deleteComment(slug, comment.id).subscribe({
          next: () => {
            // Recargar comentarios
            this._loadComments();
          },
          error: (err) => {
            console.error('Error deleting comment', err);
            this.isLoading.set(false);
          }
        });
      }else{

      }

    });

  }

  private _loadComments(): void {
    this.isLoading.set(true);
    this.slug = this.route.snapshot.paramMap.get('slug');

    if (this.slug === null) {
      this.isLoading.set(false);
      return;
    }

    this.commentService.getAllComments(this.slug).subscribe({
      next: (comments) => {
        console.log('Comments loaded:', comments);
        this.comments.set(comments);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.comments.set([]);  // Array vacío en caso de error
        this.isLoading.set(false);
      }
    });
  }

  private _getCurrentUser() {
    // console.log('Cargando usuario actual...' + this.userService.getCurrentUser());
    this.currentUser.set(this.userService.getCurrentUser());
    
  }

}
