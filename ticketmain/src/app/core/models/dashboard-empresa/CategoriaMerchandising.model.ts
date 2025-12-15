export interface CategoriaMerchandising {
  id: string;
  nombre: string;
  descripcion: string | null;
  imagen: string | null;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostCategoriaMerchandising {
  nombre: string;
  descripcion?: string | null;
  imagen?: string | null;
}

export interface PutCategoriaMerchandising {
  nombre?: string;
  descripcion?: string | null;
  imagen?: string | null;
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  is_active?: boolean;
}

export interface PatchCategoriaActivate {
  is_active: boolean;
}

export interface PatchCategoriaStatus {
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}
