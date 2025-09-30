# API Endpoints

## Carousel
- **GET**: [http://localhost:3000/api/carousel/generos](http://localhost:3000/api/carousel/generos) - Retrieve all genres.
- **GET**: [http://localhost:3000/api/carousel/conciertos](http://localhost:3000/api/carousel/conciertos) - Retrieve all concerts.
- **GET**: [http://localhost:3000/api/carousel/conciertos/{slug}](http://localhost:3000/api/carousel/conciertos/{slug}) - Retrieve a specific concert by slug.

## Conciertos
- **GET**: [http://localhost:3000/api/conciertos/{slug}](http://localhost:3000/api/conciertos/{slug}) - Retrieve, update, or delete a specific concert by slug.
- **POST**: [http://localhost:3000/api/conciertos](http://localhost:3000/api/conciertos) - Create a new concert.

EJEMPLOS:
{
    "nombre": "Bad Bunny World's Hottest Tour",
    "fecha": "2024-11-15",
    "artista": "Bad Bunny",
    "lugar": "Estadio Santiago Bernabéu, Madrid",
    "precio": 125,
    "aforo": 81044,
    "duracion": 135,
    "imagenArtista": null,
    "imagenesShow": [],
    "id_genero": "68daccc26cbb071eb8a49242",
    "_id": "68dc1a34d2e352486d084f5f",
    "slug": "bad-bunny-world's-hottest-tour-hrzysn",
    "__v": 0
}

- **GET**: [http://localhost:3000/api/conciertos](http://localhost:3000/api/conciertos) - Retrieve all concerts.

## Generos
- **POST**: [http://localhost:3000/api/generos](http://localhost:3000/api/generos) - Create a new genre.
- **GET**: [http://localhost:3000/api/generos](http://localhost:3000/api/generos) - Retrieve all genres.
- **GET**: [http://localhost:3000/api/generos/{slug}](http://localhost:3000/api/generos/{slug}) - Retrieve, update, or delete a specific genre by slug.