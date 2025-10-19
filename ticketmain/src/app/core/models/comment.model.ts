export interface Comment {
    id: string;
    contenido: string;
    createdAt: string;
    autor: {
        public_id: string;
        username: string;
        email: string;
        bio: string;
        image: string;
    };
}