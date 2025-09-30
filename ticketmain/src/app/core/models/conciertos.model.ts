export interface Concierto {
    slug: string;
    nombre: string;
    fecha: string;
    artista: string;
    lugar: string;
    precio: number;
    aforo: number;
    duracion?: number; 
    imagenArtista?: string;
    imagenesShow?: string[];
}
