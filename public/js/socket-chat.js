var socket = io();

var txtBuscarUsuario = $('#txtBuscarUsuario');

var params = new URLSearchParams( window.location.search );

if( !params.has('nombre') || !params.has('sala') ) {
    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios');
};

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}



socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function(resp) {
        renderizarUsuarios(resp);
    })

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
    console.log('Servidor:', mensaje);
    renderizarMensaje(mensaje, false);
});

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del chat
socket.on('listaPersonas', function(personas) {
    renderizarUsuarios(personas);
});

/* socket.on('buscarPersonas', function(personas){
    buscarPersonas(personas);
}) */



// Mensajes privados
socket.on('mensajePrivado', function(mensaje) {

    console.log('Mensaje Privado:', mensaje);

});