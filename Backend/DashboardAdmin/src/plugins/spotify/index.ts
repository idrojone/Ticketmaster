import fp from 'fastify-plugin';
import SpotifyWebApi from 'spotify-web-api-node';

export default fp(async (server) => {
    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    server.decorate('spotify', async function (ArtistName: string) {
        try {
            const data = await spotifyApi.clientCredentialsGrant();
            const token = data?.body?.access_token || data?.body?.['access_token'];
            if (!token) {
                const e: any = new Error('Spotify token not received');
                e.statusCode = 500;
                throw e;
            }
            spotifyApi.setAccessToken(token);

            const searchResult = await spotifyApi.searchArtists(ArtistName);
            const artist = searchResult?.body?.artists?.items?.[0];
            if (!artist || !artist.id) {
                const e: any = new Error('Artist not found');
                e.statusCode = 404;
                throw e;
            }

            const artistData = await spotifyApi.getArtist(artist.id);
            const imageData = artistData?.body?.images?.find((image: any) => image.height === 320 && image.width === 320) || null;

            return imageData;
        } catch (error: any) {
            server.throwError(error?.statusCode || 500, 'Error fetching data from Spotify API');
        }
    });

    server.addHook('onClose', (instance, done) => {
        // Aquí podrías invalidar tokens o cerrar recursos si fuera necesario
        done();
    });
});