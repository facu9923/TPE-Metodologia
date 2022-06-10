/**
 * Ambos limites incluidos
 */
function enteroRandom(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

/**
 * Dados una lista de pacientes y un dni,
 * busca linealmente para encontrar el nombre asociado al dni.
 */
function dni_paciente_a_nombre(pacientes, dni) {
    for (paciente of pacientes)
        if (paciente.getDNI() == dni)
            return paciente.getNombre();
    return null;
}

function get_medico_por_usuario(medicos, usuario) {
    for (let i = 0; i < medicos.length; i++)
        if (medicos[i].getUsuario() == usuario)
            return medicos[i];
}

function eliminarSegundos(hora) {

    try {
        let a = hora.indexOf(":");
        let b = hora.indexOf(":", a);
        if (b != -1) {
            let horaModif = hora.slice(0, b);
            horaModif += hora.slice(b+3);
            return horaModif;
        }
        return hora;
    }
    catch {
        /* Por si algo falla, esto funcionaba cuando la hora
         * no tenia AM y PM
         */
        return hora.slice(0, -3);
    }

}