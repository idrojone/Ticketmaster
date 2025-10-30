import S from 'fluent-json-schema';

const generoSchema = S.object()
  .prop('slug', S.string().required())
  .prop('name', S.string().required())
  .prop('img' , S.string())
  .prop('description',S.string())
  .prop('id_genero', S.number())
  .prop('conciertos', S.array().items(
    S.object()
      .prop('id_concierto', S.number())
  ))
  .prop('status', S.string().enum(['ACCEPTED', 'REJECTED', 'PENDING']).default('ACCEPTED'))
  .prop('createdAt', S.string().format('date-time').default(new Date().toISOString()))
  .prop('updatedAt', S.string().format('date-time').default(new Date().toISOString()));

export { generoSchema };