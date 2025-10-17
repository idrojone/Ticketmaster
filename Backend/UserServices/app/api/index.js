const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');


//Create express app
const app = express();
dotenv.config();

//Habilita CORS para todas las rutas
const corsOptions = {
    origin:process.env.CORS_URL,
    optionsSuccessStatus:200
};

app.use(cors(corsOptions));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
////////////////////////

app.listen(process.env.PORT, () => {
    console.log(`Servidor Express en el puerto ${process.env.PORT}`);
});