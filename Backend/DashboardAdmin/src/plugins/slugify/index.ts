import fp from 'fastify-plugin';
import slugify from 'slugify';

export default fp(async (server) => {
    server.decorate('generateSlug', function (title: string): string {
        return slugify(title, { lower: true, strict: true, locale: 'es' });
    });
});