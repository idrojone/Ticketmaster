# API Endpoints

## Carousel
- **GET**: [http://localhost:3000/api/carousel/generos](http://localhost:3000/api/carousel/generos) - Retrieve all genres.
- **GET**: [http://localhost:3000/api/carousel/conciertos](http://localhost:3000/api/carousel/conciertos) - Retrieve all concerts.
- **GET**: [http://localhost:3000/api/carousel/conciertos/{slug}](http://localhost:3000/api/carousel/conciertos/{slug}) - Retrieve a specific concert by slug.

## Conciertos
- **GET**: [http://localhost:3000/api/conciertos/{slug}](http://localhost:3000/api/conciertos/{slug}) - Retrieve, update, or delete a specific concert by slug.
- **POST**: [http://localhost:3000/api/conciertos](http://localhost:3000/api/conciertos) - Create a new concert.

- **GET**: [http://localhost:3000/api/conciertos](http://localhost:3000/api/conciertos) - Retrieve all concerts.

## Generos
- **POST**: [http://localhost:3000/api/generos](http://localhost:3000/api/generos) - Create a new genre.
- **GET**: [http://localhost:3000/api/generos](http://localhost:3000/api/generos) - Retrieve all genres.
- **GET**: [http://localhost:3000/api/generos/{slug}](http://localhost:3000/api/generos/{slug}) - Retrieve, update, or delete a specific genre by slug.


### Ejemplos

crear concierto
{
  "nombre": "Metallica World Tour 2024",
  "fecha": "2024-11-15",
  "artista": "Metallica",
  "lugar": "Wanda Metropolitano, Madrid",
  "precio": 85,
  "aforo": 68000,
  "imagenArtista": "https://i.scdn.co/image/ab6761610000517469ca98dd3083f1082d740e44",
  "imagenesShow": [
    "/assets/img/show.jpg",
    "/assets/img/show1.jpg",
    "/assets/img/show2.jpg"
  ],
  "duracion": 180,
  "id_genero": "GEN001",
  "slug": "metallica-world-tour-2024-bf21k6"
}