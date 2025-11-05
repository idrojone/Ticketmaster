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
    .prop('is_active', S.boolean())
    .prop('status', S.string().enum(['PENDING', 'ACCEPTED', 'REJECTED']))
    .additionalProperties(false)

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
 * @route GET /conciertos/:slug
 * @description Obtener un concierto por su slug
 * @access Private (Requiere autenticación y rol)
 * @returns {Object} 200 - Concierto encontrado
 * @returns {Object} 404 - Concierto no encontrado
 */
export const getConciertoBySlug = {
    tags: ['Conciertos'],
    description: 'Obtener un concierto por su slug',
    response: {
        200: conciertoSchema,
        404: S.object().prop('message', S.string().default('Concierto no encontrado')),
    },
};

/**
 * @route DELETE /conciertos/:slug
 * @description Eliminar un concierto por su slug
 * @access Private (Requiere autenticación y rol)
 * @returns {Object} 200 - Concierto eliminado exitosamente
 * @returns {Object} 404 - Concierto no encontrado
 */
export const deleteConcierto = {
    tags: ['Conciertos'],
    description: 'Eliminar un concierto por su slug',
    response: {
        200: S.object().prop('message', S.string().default('Concierto eliminado exitosamente')),
        404: S.object().prop('message', S.string().default('Concierto no encontrado')),
    },
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
        201: S.object().prop('concierto', conciertoSchema.required()),
        400: S.object().prop('message', S.string().default('Error creando concierto')),
    },
};

/**
 * @route PUT /conciertos/:slug
 * @description Actualizar un concierto existente
 * @access Private (Requiere autenticación y rol)
 * @returns {Object} 200 - Concierto actualizado exitosamente
 * @returns {Object} 400 - Error en la solicitud
 * @returns {Object} 404 - Concierto no encontrado
 */
export const onUpdateConciertoSchema = {
    tags: ['Conciertos'],
    description: 'Actualizar un concierto existente',
    body: createConciertoSchema.required(),
    response: {
        200: S.object().prop('concierto', conciertoSchema.required()),
        400: S.object().prop('message', S.string().default('Error actualizando concierto')),
        404: S.object().prop('message', S.string().default('Concierto no encontrado')),
    },
}

/**
 * @route PATCH /conciertos/:slug/activate
 * @description Activar o desactivar un concierto existente
 * @access Private (Requiere autenticación y rol)
 * @returns {Object} 200 - Concierto actualizado exitosamente
 * @returns {Object} 400 - Error en la solicitud
 * @returns {Object} 404 - Concierto no encontrado
 */
export const onUpdateConciertoActivateSchema = {
    tags: ['Conciertos'],
    description: 'Activar o desactivar un concierto existente',
    body: S.object().prop('is_active', S.boolean().required()),
    response: {
        200: S.object().prop('concierto', conciertoSchema.required()),
        400: S.object().prop('message', S.string().default('Error actualizando estado del concierto')),
        404: S.object().prop('message', S.string().default('Concierto no encontrado')),
    }
}
/**
 * @route PATCH /conciertos/:slug/status
 * @description Actualizar el estado de un concierto existente
 * @access Private (Requiere autenticación y rol)
 * @returns {Object} 200 - Concierto actualizado exitosamente
 * @returns {Object} 400 - Error en la solicitud
 * @returns {Object} 404 - Concierto no encontrado
 */
export const onUpdateConciertoStatusSchema = {
    tags: ['Conciertos'],
    description: 'Actualizar el estado de un concierto existente',
    body: S.object().prop('status', S.string().enum(['PENDING', 'ACCEPTED', 'REJECTED']).required()),
    response: {
        200: S.object().prop('concierto', conciertoSchema.required()),
        400: S.object().prop('message', S.string().default('Error actualizando estado del concierto')),
        404: S.object().prop('message', S.string().default('Concierto no encontrado')),
    }
}
