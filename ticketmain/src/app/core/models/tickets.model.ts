export interface Concierto {
    nombre: string;
    fecha: string;
    lugar: string;
    id: string;
}

export interface Ticket {
    _id?: string;
    conciertoId: string;
    tipo: string;
    cantidad: number;
    fecha_compra: string;
    concierto?: Concierto;
}

