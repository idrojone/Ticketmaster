export class Filters{
    limit?: number;
    offset?: number;
    genero?: string;
    genero_nombre?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    nombre?: string;

    constructor(        limit?: number,
        offset?: number,
        genero?: string,
        genero_nombre?: string,
        fecha_inicio?: string,
        fecha_fin?: string,
        nombre?: string,) 
    {
        this.limit = limit || 4;
        this.offset = offset || 0;
        this.genero = genero;
        this.genero_nombre = genero_nombre;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
        this.nombre = nombre;
    }

    public length(): number {
        let count = 0;
        if (this.limit !== undefined) count++;
        if (this.offset !== undefined) count++;
        if (this.genero !== undefined) count++;
        if (this.genero_nombre !== undefined) count++;
        if (this.fecha_inicio !== undefined) count++;
        if (this.fecha_fin !== undefined) count++;
        if (this.nombre !== undefined) count++;
        return count;
    }
}