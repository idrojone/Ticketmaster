export interface GeneroAdmin {
    slug: string;
    name: string;
    img: string;
    description: string;
    id_genero: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    is_active: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}

export interface PostGeneroAdmin {
    name: string;
    description: string;
}

