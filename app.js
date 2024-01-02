const express = require('express');
const app = express();
const morgan = require('morgan');
const usuarios = require('./routes/usuarios');

const fs = require('fs');
const path = require('path');
const PORT = 3000;
//PARA UTILIZAR MIDLEWARE PARA PETICIONES (REQUEST) TIPO JSON EN EL BODY
app.use(express.json());
//PARA UTILIZAR MIDLEWARE PARA PETICIONES (REQUEST) TIPO PARAMETROS EN FORM URLENCODED
app.use(express.urlencoded({extended:true}));
//PARA UTILIZAR MIDLEWARE PARA REGISTROS DE PETICIONES HTTP Y ESCRITURA EN ARCHIVO TXT
let accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});
app.use(morgan('tiny',{stream:accessLogStream}));
//PARA USAR EL MIDLEWARE DE USUARIOS SI SE UTILIZAR LA RUTA DE API/USUARIOS
app.use('/api/usuarios',usuarios);

//PARA DEVOLVER STRING ESTÁTICO
app.get('/', (req, res) => {
    res.send('Hola mundo desde Express');
  });

//EJECUCIÓN DE LA APP EN EL PUERTO ESTABLECIDO
app.listen(PORT, () => {
    console.log(`escuchando en el puerto ${PORT}`);
})