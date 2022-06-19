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

function asignarMetodos(elemento) {

    if (typeof elemento == "object") {

        if (Array.isArray(elemento)) {
            let nuevo = [];
            for (let i = 0; i < elemento.length; i++)
                nuevo.push(asignarMetodos(elemento[i]));
            return nuevo;
        }
        else {

            for (let [key, value] of Object.entries(elemento))
                elemento[key] = asignarMetodos(elemento[key]);

            if (!elemento.clase)
                return elemento;

            const nuevo = eval(`new ${elemento.clase}()`);
            Object.assign(nuevo, elemento);
            return nuevo;
        }
            
    } else {
        return elemento;
    }
}