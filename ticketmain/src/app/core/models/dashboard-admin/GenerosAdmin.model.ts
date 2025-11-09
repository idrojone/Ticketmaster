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

export interface PutGeneroAdmin {
    name: string;
    description: string;
    img: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    is_active: boolean;
}

export interface PatchGeneroActivate {
    is_active: boolean;
}

export interface PatchGeneroStatus {
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}
