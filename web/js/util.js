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