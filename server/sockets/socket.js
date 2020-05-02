const { io } = require('../server');
const { Usuarios } = require('../classes/usuario.js'); 
const { crearMensaje } = require('../utilidades/utilidades');

let usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        if(!data.nombre){
            callback({
                ok: false,
                err: {
                    message: 'El nombre es necesario'
                }
            })
        }
        if(!data.sala){
            callback({
                ok: false,
                err: {
                    message: 'La sala es necesaria'
                }
            })
        }

        client.join(data.sala);

        personas = usuarios.agregarPersona( client.id, data.nombre, data.sala );


        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonaPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje( 'Administrador', `${data.nombre} ingresó`));

        callback(usuarios.getPersonaPorSala(data.sala));
        
    })

    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);
    })

    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje( 'Administrador', `${personaBorrada.nombre} salió`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonaPorSala(personaBorrada.sala));


    })
    
    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    })

    client.on('buscarPersonas', (txtFiltro, callback) => {
        let resp = usuarios.filtrarPesonasPorTexto(txtFiltro.filtro, txtFiltro.sala);
        
        callback(resp);
    });
     
    client.on('mensajePorID', (data, callback) => {

    })

});
