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

const getGenero = {
  response: {
    200: generoSchema.required(),
    404: S.object().prop('message', S.string().default('Genero not found')),
  },
};

const getGeneros = {
  response: {
    200: S.object()
      .prop('generos', S.array().items(generoSchema).required())
      .prop('total', S.number()),
  },
};

export { generoSchema, getGenero, getGeneros };
