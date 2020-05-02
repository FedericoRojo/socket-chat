class Usuarios {

    constructor (){
        this.personas = [];
    }

    agregarPersona(id, nombre, sala){
        let persona = {id, nombre, sala};
        this.personas.push(persona);
        return this.personas;
    }

    getPersona(id){
        let persona = this.personas.filter( persona => {
            return persona.id === id
        })[0];
        return persona;
    }

    getTodasPersonas(){
        return this.personas;
    }

    getPersonaPorSala( sala ){
        let personasSala = this.personas.filter( persona => {
            return persona.sala === sala
        })
        return personasSala;
    }

    borrarPersona (id){

        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter( persona =>
            persona.id != id)

        return personaBorrada;
    } 

    filtrarPesonasPorTexto(txtFiltro, sala){

        if (txtFiltro === '') return this.getPersonaPorSala(sala);

        let personasSala = this.getPersonaPorSala(sala);


        //let personasFiltradas = personasSala.filter(persona => persona.nombre === txtFiltro);

        let personasFiltradas = personasSala.filter( (persona) => persona.nombre === txtFiltro)
        return personasFiltradas;
    } 
    
}

module.exports = {
    Usuarios
};