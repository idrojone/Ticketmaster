export interface CartItem {
    id: string;
    type: 'concierto' | 'merchandising';
    conciertoId?: string;
    merchandisingId?: string;
    nombre: string;
    precio: number;
    cantidad: number;
    imagen?: string;
    // Additional details for display
    fecha?: string; // For concerts
    lugar?: string; // For concerts
    artista?: string; // For concerts
    descripcion?: string; // For merchandising
}
