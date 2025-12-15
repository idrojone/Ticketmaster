import S from 'fluent-json-schema';

const generoSchema = S.object()
  // .prop('id', S.string().required())
  .prop('slug', S.string().required())
  .prop('name', S.string().required())
  .prop('img', S.string())
  .prop('description', S.string())
  .prop('id_genero', S.string()) // opcional, solo si lo usas como identificador externo
  // .prop('conciertos', S.array().items(S.string()))
  .prop('status', S.string().enum(['ACCEPTED', 'REJECTED', 'PENDING']).default('ACCEPTED'))
  .prop('is_active', S.boolean().default(true))
  .prop('createdAt', S.string().format('date-time'))
  .prop('updatedAt', S.string().format('date-time'));

const generoGetSchema = S.object()
  .prop('slug', S.string())
  .prop('name', S.string())
  .prop('img', S.string())
  .prop('description', S.string())
  .prop('id_genero', S.string())
  .prop('status', S.string().enum(['ACCEPTED', 'REJECTED', 'PENDING']))
  .prop('is_active', S.boolean())
  .prop('createdAt', S.string().format('date-time'))
  .prop('updatedAt', S.string().format('date-time'));

const generoListSchema = S.object()
  .prop('generos', S.array().required())
  .prop('total', S.number().required());

const generoCreateSchema = S.object()
  .prop('name', S.string().required())
  .prop('description', S.string());

const generoUpdateSchema = S.object()
  .prop('name', S.string())
  .prop('description', S.string())
  .prop('img', S.string())
  .prop('status', S.string().enum(['ACCEPTED', 'REJECTED', 'PENDING']))
  .prop('is_active', S.boolean());


/**
 * @route GET /generos/:slug  
 * @description Obtener un género específico por slug
 * @access Private (Requiere autenticación y rol)
 * @returns {Object} 200 - Género encontrado
 * @returns {Object} 404 - Género no encontrado
 */
export const getGenero = {
  tags: ['Generos'],
  description: 'Obtener un género específico por slug',
  response: {
    200: generoGetSchema.required(),
    404: S.object().prop('message', S.string().default('Genero no encontrado')),
  },
};


/**
 * @route GET /generos
 * @description Obtener lista de todos los géneros
 * @access Private (Requiere autenticación y rol)
 * @returns {Object} 200 - Lista de géneros con el total
 * @returns {Object} 400 - Error al obtener los géneros
 */
export const getGeneros = {
  tags: ['Generos'],
  description: 'Obtener lista de todos los géneros',
  response: {
    200: S.object()
      .prop('generos', S.array().items(generoGetSchema).required())
      .prop('total', S.number()),
    400: S.object().prop('message', S.string().default('Error obteniendo generos')),
  },
};

/**
 * @route POST /generos 
 * @description Crear un nuevo género
 * @access Private (Requiere autenticación y rol)
 * @returns {Object} 201 - Género creado exitosamente
 * @returns {Object} 400 - Error al crear el género
 */
export const onCreateGenero = {
  tags: ['Generos'],
  description: 'Crear un nuevo género',
  body: generoCreateSchema.required(),
  response: {
    201: generoGetSchema,
    400: S.object().prop('message', S.string().default('Error creando genero')),
    409: S.object().prop('message', S.string().default('El nombre del género ya existe')),
  },
};

/**
 * @route PUT /generos/:slug
 * @description Actualizar un género existente
 * @access Private (Requiere autenticación y rol)
 * @returns {Object} 200 - Género actualizado exitosamente
 * @returns {Object} 404 - Género no encontrado o slug en uso
 */
export const onUpdateGenero = {
  tags: ['Generos'],
  description: 'Actualizar un género existente',
  body: generoUpdateSchema,
  response: {
    200: generoGetSchema,
    404: S.object().prop('message', S.string().default('No se puede actualizar ya que el genero no existe o el slug ya está en uso')),
  },
};


/**
 * @route PATCH /generos/activate/:slug
 * @description Actualizar activo del género
 * @access Private (Requiere autenticación y rol)
 * @returns {Object} 200 - Género actualizado exitosamente
 * @returns {Object} 400 - Error al actualizar el estado del género
 * @returns {Object} 404 - Género no encontrado
 */
export const onActivateGeneroSchema = {
  tags: ['Generos'],
  description: 'Actualizar activo del género',
  body: S.object().prop('is_active', S.boolean().required()),
  response: {
    200: S.object().prop('genero', generoSchema.required()),
    400: S.object().prop('message', S.string().default('Error actulizando el estado del concierto')),
    404: S.object().prop('message', S.string().default('Genero no encontrado'))
  }
};

/**
 * @route PATCH /generos/status/:slug
 * @description Actulizar status del género
 * @access Private (Requiere autenticación y rol)
 * @returns {Object} 200 - Género actualizado exitosamente
 * @returns {Object} 400 - Error al actualizar el status del género
 * @returns {Object} 404 - Género no encontrado
 */
export const onStatusGeneroSchema = {
  tags: ['Generos'],
  description: 'Actulizar status del género',
  body: S.object().prop('status', S.string().enum(['ACCEPTED', 'REJECTED', 'PENDING']).required()),
  response: {
    200: S.object().prop('generos', generoSchema.required()),
    400: S.object().prop('message', S.string().default('Error actulizando status del género')),
    404: S.object().prop('message', S.string().default('Género no encontrado'))
  }
};

/**
 * @route GET /generos/id_genero/:id_genero
 * @description Obtener generos por id_genero
 * @access Private (Requiere autenticación y rol)
 * @returns {Object} 200 - Generos encontrados
 * @returns {Object} 404 - Género no encontrado
 */
export const onGetGeneroIdGeneroSchema = {
  tags: ['Generos'],
  description: 'Obtener generos por id_genero',
  response: {
    200: S.object().prop(
      'generos',
      S.array()
        .items(S.object().prop('id_genero', S.string().required()))
        .required()
    ),
    404: S.object().prop('message', S.string().default('Género no encontrado')),
  },
};