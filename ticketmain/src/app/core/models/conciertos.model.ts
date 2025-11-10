export interface Concierto {
    _id: string;
    slug: string;
    nombre: string;
    fecha: string;
    artista: string;
    lugar: string;
    descripcion?: string;
    latitud?: number;
    longitud?: number;
    precio: number;
    aforo: number;
    duracion?: number; 
    imagenArtista?: string;
    imagenesShow?: string[];
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    is_active: boolean;
}
