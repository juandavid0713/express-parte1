const express = require('express');
const app = express();
const morgan = require('morgan');
//PARA REALIZAR VALIDACIONES CON JOI
const Joi = require('joi');
const fs = require('fs');
var path = require('path');
const PORT = 3000;
//PARA UTILIZAR MIDLEWARE PARA PETICIONES (REQUEST) TIPO JSON EN EL BODY
app.use(express.json());
//PARA UTILIZAR MIDLEWARE PARA PETICIONES (REQUEST) TIPO PARAMETROS EN FORM URLENCODED
app.use(express.urlencoded({extended:true}));
//PARA UTILIZAR MIDLEWARE PARA REGISTROS DE PETICIONES HTTP Y ESCRITURA EN ARCHIVO TXTA
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});
app.use(morgan('tiny',{stream:accessLogStream}));


//LISTADO DE USUARIOS ESTÁTICOS PARA DEVOLVER EN LA PETICIÓN HTTP GET
const usuarios = [
    {id:1, nombre:"juan"},
    {id:2, nombre:"david"},
    {id:3, nombre: "mateo"},
    {id:4, nombre: "luis"}
];

//VALIDACIÓN PARA CONSULTAR SI USUARIO EXISTE
function validarUsuario(id) {
    return(usuarios.find(u => u.id == id))
}

//PARA DEVOLVER STRING ESTÁTICO
app.get('/', (req, res) => {
  res.send('Hola mundo desde Express');
});

//PARA DEVOLVER PARÁMETROS ESTÁTICOS
    app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
});

//PARA DEVOLVER PARAMETRO ID ESTÁTICO
//app.get('/api/usuarios/:id', (req, res) => {
//    res.send(req.params.id);
//});

//PARA DEVOLVER PARAMETRO ID CON ARREGLO DEFINIDO ARRIBA DE USUARIOS
app.get('/api/usuarios/:id', (req, res) => {
    let usuario = validarUsuario(req.params.id);
    if(!usuario) res.status(404).send("<h1>Usuario no encontrado</h1>");

    res.send(usuario);
});

//PARA ENVIAR PETICIONES HTTP POST CON VALIDACIÓN SENCILLA
/* app.post('/api/usuarios', (req, res) => {
    if (!req.body.name) {
        res.status(400).send('Debe ingresar un nombre');
        return;
    }
    const usuario = {
        id: usuarios.length+1,
        nombre: req.body.nombre
    };
    usuarios.push(usuario);
    res.send(usuario);
}) */

//PARA ENVIAR PETICIONES HTTP POST CON VALIDACIÓN JOI
app.post('/api/usuarios', (req, res) => {
   
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });

    const result = schema.validate({nombre:req.body.nombre});
    //console.log(result);
    if (!result.error) {
        const usuario = {
            id: usuarios.length+1,
            nombre: result.value.nombre
        };
        usuarios.push(usuario);
        res.send(usuario);
    }
    else{
        res.send(`Validar los datos en el body ${result.error}`)
    }
    
})

//PARA ENVIAR PETICIONES HTTP PUT CON VALIDACIÓN JOI
app.put('/api/usuarios/:id', (req, res)  => {
    let usuario = usuarios.find(u => u.id == parseInt(req.params.id));
    if(!usuario) res.status(404);

    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });

    const result = schema.validate({nombre:req.body.nombre});
    //console.log(result);
    if (result.error) {
        res.send(`Validar los datos en el body ${result.error}`)
        return;
    }

    usuario.nombre = result.value.nombre;
    res.send(usuario);
});

//PARA ENVIAR SOLICITUDES HTTP DELETE
app.delete('/api/usuarios/:id', (req, res) =>  {
    let usuario = validarUsuario(req.params.id);
    if(!usuario){
        res.status(404).send("<h1>Usuario no encontrado</h1>");
        return;
    } 
  const index = usuarios.indexOf(usuario);
  usuarios.splice(index,1);
  res.send(usuario);
});

//EJECUCIÓN DE LA APP EN EL PUERTO ESTABLECIDO
app.listen(PORT, () => {
    console.log(`escuchando en el puerto ${PORT}`);
})