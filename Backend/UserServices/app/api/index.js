const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000;
const BIND_HOST = process.env.BIND_HOST || "127.0.0.1";

//Create express app
const app = express();
dotenv.config();

//Habilita CORS para todas las rutas
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:4200'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser()); // Middleware para parsear cookies

//configuring the database
const dbConfig = require('../config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

//INCLUIR LAS RUTAS AQUI
require('../routes/concierto.routes.js')(app);
require('../routes/genero.routes.js')(app);
require('../routes/carousel.routes.js')(app);
require('../routes/auth.routes.js')(app);
require('../routes/comentarios.routes.js')(app);
require('../routes/profile.routes.js')(app);
require('../routes/carrito.routes.js')(app);
require('../routes/order.routes.js')(app);
require('../routes/merchandising.routes.js')(app);
require('../routes/entradas.routes.js')(app);
////////////////////////

app.listen(PORT, BIND_HOST, () => {
    console.log(`Servidor Express escuchando en http://${BIND_HOST}:${PORT}`);
});