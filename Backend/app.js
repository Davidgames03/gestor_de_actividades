const express = require('express');
const path = require('path');

// Lee el puerto del archivo .env 
require('dotenv').config();

const actividadesRouters = require('./Routers/actividadesRouters');

const app = express();

// Para que el servidor entienda lo que manda la página
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Aquí están el html, el css y el js de la página
app.use(express.static(path.join(__dirname, '../Frontend')));

// Las rutas de las actividades
app.use(actividadesRouters);

// Al entrar al sitio muestra la página de actividades
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/actividades.html'));
});

// Si no hay .env uso el puerto 3000 para que arranque igual
const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
    console.log('Servidor encendido en http://localhost:' + PUERTO);
});