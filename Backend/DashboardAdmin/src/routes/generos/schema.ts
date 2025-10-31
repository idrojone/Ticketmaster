import S from 'fluent-json-schema';

const generoSchema = S.object()
  .prop('slug', S.string().required())
  .prop('name', S.string().required())
  .prop('img', S.string())
  .prop('description', S.string())
  .prop('id_genero', S.string()) // opcional, solo si lo usas como identificador externo
  .prop('conciertos', S.array().items(S.string()))
  .prop('status', S.string().enum(['ACCEPTED', 'REJECTED', 'PENDING']).default('ACCEPTED'))
  .prop('is_active', S.boolean().default(true))
  .prop('createdAt', S.string().format('date-time'))
  .prop('updatedAt', S.string().format('date-time'));

const getGenero = {
  response: {
    200: generoSchema.required(), // respuesta directa con los datos del género
    404: S.object().prop('message', S.string().default('Genero not found')),
  },
};

const getGeneros = {
  querystring: S.object()
    .prop('limit', S.number().default(10))
    .prop('offset', S.number().default(0))
    .prop('name', S.string()),
  response: {
    200: S.object()
      .prop('generos', S.array().items(generoSchema))
      .prop('total', S.number()),
  },
};

export { generoSchema, getGenero, getGeneros };
