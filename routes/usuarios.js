const express = require('express');
const ruta = express.Router();
//PARA REALIZAR VALIDACIONES CON JOI
const Joi = require('joi');

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



//PARA DEVOLVER PARÁMETROS ESTÁTICOS
    ruta.get('/', (req, res) => {
    res.send(usuarios);
});

//PARA DEVOLVER PARAMETRO ID CON ARREGLO DEFINIDO ARRIBA DE USUARIOS
ruta.get('/:id', (req, res) => {
    let usuario = validarUsuario(req.params.id);
    if(!usuario) res.status(404).send("<h1>Usuario no encontrado</h1>");

    res.send(usuario);
});

//PARA ENVIAR PETICIONES HTTP POST CON VALIDACIÓN JOI
ruta.post('/', (req, res) => {
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
ruta.put('/:id', (req, res)  => {
    let usuario = validarUsuario(req.params.id);
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
ruta.delete('/api/usuarios/:id', (req, res) =>  {
    let usuario = validarUsuario(req.params.id);
    if(!usuario){
        res.status(404).send("<h1>Usuario no encontrado</h1>");
        return;
    } 
  const index = usuarios.indexOf(usuario);
  usuarios.splice(index,1);
  res.send(usuario);
});

module.exports = ruta;