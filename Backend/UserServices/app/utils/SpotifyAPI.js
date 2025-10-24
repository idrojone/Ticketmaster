const SpotifyWebApi = require('spotify-web-api-node');

class SpotifyAPI {

    constructor() {
        this.baseURL = process.env.SPOTIFY_BASE_URL;
        this.spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET
        });
    }

    async getArtistImg(artistName) {
        console.log("Buscando imagen para entramos" + artistName);
        try {
            console.log("Buscando imagen para a" + artistName);
            const data = await this.spotifyApi.clientCredentialsGrant();
            this.spotifyApi.setAccessToken(data.body['access_token']);

            const searchResult = await this.spotifyApi.searchArtists(artistName);
            const artistId = searchResult.body.artists.items[0]?.id;
            if (!artistId) {
                console.log('Artista no encontrado');
                return null;
            }
            const artistInfo = await this.spotifyApi.getArtist(artistId);
            const imageData = artistInfo.body.images.find(image => image.height === 320 && image.width === 320);

            // Devolver en el formato esperado
            return imageData ? { image: imageData.url } : null;
        } catch (error) {
            console.error('Error al obtener información del artista:', error);
            return null; // Importante: devolver null en caso de error
        }
    }

    
}

module.exports = SpotifyAPI;