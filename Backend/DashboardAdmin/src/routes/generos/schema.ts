import S from 'fluent-json-schema';

const generoSchema = S.object()
  .prop('id', S.string().required())
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

const generoCreateSchema = S.object()
  .prop('name', S.string())
  .prop('description', S.string());

const generoUpdateSchema = S.object()
  .prop('name', S.string())
  .prop('description', S.string())
  .prop('img', S.string())
  .prop('status', S.string().enum(['ACCEPTED', 'REJECTED', 'PENDING']))
  .prop('is_active', S.boolean());

const getGenero = {
  tags: ['Generos'],
  description: 'Obtener un género específico por slug',
  response: {
    200: generoGetSchema.required(),
    404: S.object().prop('message', S.string().default('Genero no encontrado')),
  },
};

const getGeneros = {
  tags: ['Generos'],
  description: 'Obtener lista de todos los géneros',
  response: {
    200: S.object()
      .prop('generos', S.array().items(generoGetSchema).required())
      .prop('total', S.number()),
  },
};

const onCreateGenero = {
  tags: ['Generos'],
  description: 'Crear un nuevo género',
  body: generoCreateSchema.required(),
  response: {
    201: generoGetSchema,
    400: S.object().prop('message', S.string().default('Error creating genero')),
  },
};

const onUpdateGenero = {
  tags: ['Generos'],
  description: 'Actualizar un género existente',
  body: generoUpdateSchema,
  response: {
    200: generoGetSchema,
    404: S.object().prop('message', S.string().default('NO se puede actualizar ya que el genero no existe o el slug ya está en uso')),
  },
};

export { generoSchema, getGenero, getGeneros, onCreateGenero, onUpdateGenero };
