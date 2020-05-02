//Parametros del URL
var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');

//Referencias JQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');
var formBuscarUsuario = $('#formBuscarUsuario');
var txtBuscarUsuario = $('#txtBuscarUsuario');

function renderizarUsuarios(personas) {

    //console.log(personas);

    var html = '';

    if( !sala ){
        cicloParaRenderizarUsuarios(personas);
    }else{
        html += '<li>';
        html += '<a href="javascript:void(0)" class="active"> Chat de <span> '+ params.get('sala') + '</span></a>';
        html += '</li>';
        cicloParaRenderizarUsuarios(personas);
    }

    function cicloParaRenderizarUsuarios(personas){

        for (var i = 0; i < personas.length; i++) {

            html +=  '<li>';
            html +=  '    <a data-id="' + personas[i].id + '"  href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
            html +=  '</li>';
   
       }
    }

    divUsuarios.html(html); 

} 

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

function renderizarMensaje(mensaje, yo) {

    let html = '';
    let fecha = new Date(mensaje.fecha);
    let hora = fecha.getHours() + ':' + fecha.getMinutes();
    let adminClass = 'info';
    if(mensaje.usuario === 'Administrador'){
        adminClass = 'danger'
    }

    if(yo){
        html += '<li class="reverse">';
        html += '<div class="chat-content">';
        html += '    <h5>' + mensaje.usuario + '</h5>';
        html += '    <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '</div>';
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '<div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }else{

        html += '<li class="animated fadeIn">';

        if( mensaje.usuario !== 'Administrador'){
            html += '  <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.usuario + '</h5>';
        html += '        <div class="box bg-light-'+ adminClass +'">'+ mensaje.mensaje +'</div>';
        html += '    </div>';
        html += '  <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }
    
    divChatbox.append(html);

}

divUsuarios.on('click', 'a', function(){
    
    let id = $(this).data('id');
    let data = {
        id: id,
        nombre: nombre
    }

    socket.emit('mensajePorID', data, function(resp) {

    })

    window.location = 'private.html';

})


formEnviar.on('submit', function(event){

    event.preventDefault();

    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val(),
    }, function(mensaje) {
        txtMensaje.val('').focus();
        renderizarMensaje(mensaje, true);
        scrollBottom();
    });

});

formBuscarUsuario.on('submit', function(event){

    event.preventDefault();

    let txtFiltro = txtBuscarUsuario.val();

    socket.emit('buscarPersonas', {
        filtro: txtFiltro,
        sala: sala
    }, function(resp){
        console.log(resp);
        renderizarUsuarios(resp);
    })

})






