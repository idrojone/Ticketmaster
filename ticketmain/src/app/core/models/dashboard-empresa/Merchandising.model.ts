export interface Merchandising {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  imagen: string | null;
  categoriaId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostMerchandising {
  nombre: string;
  descripcion?: string | null;
  precio: number;
  stock: number;
  imagen?: string | null;
  categoriaId: string;
}

export interface PutMerchandising {
  nombre?: string;
  descripcion?: string | null;
  precio?: number;
  stock?: number;
  imagen?: string | null;
  categoriaId?: string;
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  is_active?: boolean;
}

export interface PatchMerchandisingActivate {
  is_active: boolean;
}

export interface PatchMerchandisingStatus {
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}
