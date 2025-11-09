import { InfiniteScrollDirective } from "ngx-infinite-scroll";

export interface ConciertoAdmin {
      slug: string;
      nombre: string;
      fecha: string; // ISO date string
      artista: string;
      lugar: string;
      ciudad: string;
      descripcion: string;
      latitud: number;
      longitud: number;
      precio: number;
      aforo: number;
      duracion: number;
      id_genero: string;
      imagenArtista: string;
      is_active: boolean;
      status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface PostConciertoAdmin {
      nombre: string;
      fecha: string; // ISO date string
      artista: string;
      lugar: string;
      ciudad: string;
      descripcion: string;
      latitud: number;
      longitud: number;
      precio: number;
      aforo: number;
      duracion: number;
      id_genero: string;
      imagenArtista: string;
}

export interface PutConciertoAdmin {
      nombre: string;
      fecha: string; // ISO date string
      artista: string;
      lugar: string;
      ciudad: string;
      descripcion: string;
      latitud: number;
      longitud: number;
      precio: number;
      aforo: number;
      duracion: number;
      id_genero: string;
      imagenArtista: string;
}

export interface PatchConciertoActivate {
    its_active: boolean;
}

export interface PatchConciertoStatus {
    status: String;
}