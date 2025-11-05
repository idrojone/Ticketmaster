import S from 'fluent-json-schema';

/**
 * Schema para un concierto
 */
const conciertoSchema = S.object()
    .prop('slug', S.string().minLength(3).maxLength(50))
    .prop('nombre', S.string().minLength(3).maxLength(50))
    .prop('fecha', S.string().format('date-time'))
    .prop('artista', S.string().minLength(3).maxLength(100))
    .prop('lugar', S.string().minLength(3).maxLength(100))
    .prop('ciudad', S.string().minLength(3).maxLength(100))
    .prop('descripcion', S.string().minLength(10).maxLength(500))
    .prop('latitud', S.number().minimum(-90).maximum(90))
    .prop('longitud', S.number().minimum(-180).maximum(180))
    .prop('precio', S.number().minimum(0))
    .prop('aforo', S.number().minimum(0))
    .prop('duracion', S.number().minimum(0))
    .prop('id_genero', S.string().minLength(3).maxLength(50))
    .prop('imagenArtista', S.string())
    .prop('imagenesShow', S.array())


/**
 * @route GET /conciertos
 * @description Obtener lista de todos los conciertos
 * @access Private (Requiere autenticación y rol)
 * @returns {Object} 200 - Lista de conciertos con el total
 * @returns {Object} 404 - No se encontraron conciertos
 */
export const getConciertos = {
    tags: ['Conciertos'],
    description: 'Obtener lista de todos los conciertos',
    response: {
        200: S.object()
            .prop('conciertos', S.array().items(conciertoSchema).required())
            .prop('total', S.number()),
        404: S.object().prop('message', S.string().default('No se encontraron conciertos')),
    },
};


/**
 * Schema para la creación de un nuevo concierto
 */
const createConciertoSchema = S.object()
    .prop('nombre', S.string().required())
    .prop('fecha', S.string().format('date-time').required())
    .prop('artista', S.string().required())
    .prop('lugar', S.string().required())
    .prop('ciudad', S.string().required())
    .prop('descripcion', S.string().required())
    .prop('latitud', S.number())
    .prop('longitud', S.number())
    .prop('precio', S.number().minimum(0).required())
    .prop('aforo', S.number().minimum(0).required())
    .prop('duracion', S.number().minimum(0).required())
    .prop('id_genero', S.string().required())
    .prop('imagenArtista', S.string())
    .prop('imagenesShow', S.array());

/**
 * Interface para el cuerpo de la solicitud de creación de concierto
 */

export interface CreateConciertoBody {
    slug: string;
    nombre: string;
    status: string;
    is_active: boolean;
    fecha: string;
    artista: string;
    lugar: string;
    ciudad: string;
    descripcion: string;
    latitud?: number;
    longitud?: number;
    precio: number;
    aforo: number;
    duracion: number;
    id_genero: string;
    imagenArtista?: string;
    imagenesShow?: string[];
}

/**
 * @route POST /conciertos
 * @description Crear un nuevo concierto
 * @access Private (Requiere autenticación y rol)
 * @returns {Object} 201 - Concierto creado exitosamente
 * @returns {Object} 400 - Error en la solicitud
 */
export const onCreateConcierto = {
    tags: ['Conciertos'],
    description: 'Crear un nuevo concierto',
    body: createConciertoSchema.required(),
    response: {
        201: conciertoSchema,
        400: S.object().prop('message', S.string().default('Error creando concierto')),
    },
};
