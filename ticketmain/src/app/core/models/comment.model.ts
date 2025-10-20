export interface Comment {
    id: string;
    contenido: string;
    createdAt?: string; // Opcional porque el backend no lo devuelve actualmente
    autor: {
        public_id: string;
        username: string;
        email: string;
        bio: string;
        image: string;
    };
}