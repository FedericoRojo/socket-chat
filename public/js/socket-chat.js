var socket = io();

let params = new URLSearchParams( window.location.search );
if( !params.has('nombre') || !params.has('sala') ){
    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {

    socket.emit('entrarChat', usuario, function(resp) {
        console.log('Usuarios conectados', resp)
    })

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});

socket.on('crearMensaje', function(mensaje) {
    console.log('Servidor:', mensaje);
});

socket.on('listaPersonas', function(personas) {
    console.log(personas);
});

socket.on('mensajePrivado', function(mensaje){
    console.log('Mensaje privado:', mensaje);
});

/*
// Enviar información
socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});

// Escuchar información
 */