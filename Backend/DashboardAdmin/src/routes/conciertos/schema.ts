import S from 'fluent-json-schema';

const conciertoSchema = S.object()
    .prop('slug', S.string().minLength(3).maxLength(50))
    .prop('name', S.string().minLength(3).maxLength(50))
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
    .prop('imagenArtista', S.string().format('uri'))
    .prop('imagenesShow', S.string().format('uri'))

const getConciertos = {
    tags: ['Conciertos'],
    description: 'Obtener lista de todos los conciertos',
    response: {
        200: S.object()
            .prop('conciertos', S.array().items(conciertoSchema).required())
            .prop('total', S.number()),
        404: S.object().prop('message', S.string().default('No se encontraron conciertos')),
    },
};

