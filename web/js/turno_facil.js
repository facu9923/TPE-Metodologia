let medicos;
let pacientes;
let secretarias;

/**
 * Retorna lista con pacientes aleatorios
 */
function generarPacientesAleatorios() {

    const pacientes = [];

    for (let i = 0; i < 50; i++) {
        const paciente = new Persona(
            enteroRandom(10000000, 50000000),
            nombresPacientes[enteroRandom(0, nombresPacientes.length-1)]
        );
        pacientes.push(paciente);
    }

    return pacientes;
}

/**
 * Modifica date para pasar al proximo turno
 * (Suma 1 hora o pasa al dia siguiente)
 */
function proxTurnoDate(date) {
    date.setHours(date.getHours() + 1);
    if (date.getHours() > DEFAULT.RANGO_HORARIO_TURNOS.MAX) {
        date.setHours(DEFAULT.RANGO_HORARIO_TURNOS.MIN);
        date.setDate(date.getDate() + 1);
    }
    if (date.getHours() < DEFAULT.RANGO_HORARIO_TURNOS.MIN) {
        date.setHours(DEFAULT.RANGO_HORARIO_TURNOS.MIN);
    }
}

function comprobarCredenciales(usuario, contrasena) {

    function buscarEn(lista) {

        let resultado = {
            encontrado: false,
            credenciales_validas: false
        };

        /**
         * Nota: "persona" debería ser en este caso, un objeto médico o secretaria.
         */
        for (persona of lista) {
            if (persona.getUsuario() == usuario) {
                resultado.encontrado = true;
                if (persona.getContrasena() == contrasena)
                    resultado.credenciales_validas = true;
                break;
            }
        }
        return resultado;
    }

    let resultado = buscarEn(DEFAULT.medicos);
    if (resultado.encontrado) {
        resultado.tipo = "medico";
        return resultado;
    }
    resultado = buscarEn(DEFAULT.secretarias);
    if (resultado.encontrado) {
        resultado.tipo = "secretaria";
    }
    return resultado;
}

/**
 * Retorna una lista de la forma:
 * [
 * 		dni_medico,
 * 		lista_turnos: [
 * 			{
 * 				dni_paciente,
 * 				timestamp
 * 			}	
 * 		]
 * ]
 * Este formato sirve para guardar en el localStorage,
 * vinculando los turnos (dni_paciente, timestamp) con el medico.
 */
function obtenerTurnosCompletos(medicos) {
    let turnosCompletos = [];

    for (medico of medicos) {
        turnosCompletos.push({
            dni_medico: medico.getDNI(),
            lista_turnos: medico.getListaTurnos()
        });
    }
    return turnosCompletos;
}

/**
 * Asigna los turnosCompletos (en el formato del localStorage) a los
 * medicos
 */
function asignarTurnosAMedicos(turnosCompletos, medicos) {

    /**
     * Retorna la posicion en el arreglo de medicos
     */
    function indiceMedico(dni) {
        for (let i = 0; i < medicos.length; i++)
            if (medicos[i].getDNI() == dni)
                return i;
        return -1;
    }

    for (let i = 0; i < turnosCompletos.length; i++) {
        medicos[indiceMedico(turnosCompletos[i].dni_medico)].setListaTurnos(
            turnosCompletos[i].lista_turnos
        );
    }
}


function cantidadTurnosEntre(a_timestamp, b_timestamp) {

    let a_date = new Date(a_timestamp);
    proxTurnoDate(a_date);

    let contador = 0;
    while (true) {
        if (a_date.getTime() != b_timestamp) {
            contador ++;
            proxTurnoDate(a_date);
        }
        else
            break;
    }
    return contador;
}

function getTurnosDisponibles(medico) {
    let turnosDisponibles = [];
    const turnosMedico = medico.getListaTurnos();

    let caca = new Date();

    // Para que no afecten al timestamp del turno...
    let codigo_asqueroso = false;
    caca.setMinutes(0);
    caca.setSeconds(0);
    caca.setMilliseconds(0);
    proxTurnoDate(caca);
    if (caca.getTime() != turnosMedico[0].timestamp) {
        codigo_asqueroso = true;
        turnosMedico.unshift({
            dni_paciente: "jajajajjaajaja",
            timestamp: caca.getTime()
        });
    }

    // Encontrar "huecos"

    for (let i = 0; i < turnosMedico.length - 1; i++) {
        let cantidad_huecos = cantidadTurnosEntre(turnosMedico[i].timestamp, turnosMedico[i+1].timestamp);
        for (let hueco_n = 1; hueco_n <= cantidad_huecos; hueco_n++) {
            let copiaTurnoBase = new Date(turnosMedico[i].timestamp);
            // Sumar fedasfghuiu54hrecacapedopishtr
            for (let i = 0; i < hueco_n; i++)
                proxTurnoDate(copiaTurnoBase);
            turnosDisponibles.push(copiaTurnoBase);
        }
    }

    // Agregar algunos mas al final

    let copiaUltimoTurno = new Date(turnosMedico[turnosMedico.length - 1].timestamp);
    proxTurnoDate(copiaUltimoTurno);
    turnosDisponibles.push(copiaUltimoTurno);

    for (let i = 0; i < 2; i++) {
        let copiaUltimo = new Date(turnosDisponibles[turnosDisponibles.length-1].getTime());
        proxTurnoDate(copiaUltimo);
        turnosDisponibles.push(copiaUltimo);
    }

    if (codigo_asqueroso)
        turnosMedico.shift();

    return turnosDisponibles;
}

function reagendarTurno(usuario_medico, timestamp_viejo, timestamp_nuevo) {
    const medico = get_medico_por_usuario(medicos, usuario_medico);
    medico.modificarTimestampTurno(timestamp_viejo, timestamp_nuevo);
    StorageManager.guardarTurnos(obtenerTurnosCompletos(medicos));
    document.getElementById("reasignar_popup").style.display = "none";
    Interfaz.setTurnos(medico, pacientes, "#administracion_medico", true, true);
    alert("Datos actualizados!");
}

(function main() {

    medicos = DEFAULT.medicos;
    secretarias = DEFAULT.secretarias;
    
    // Cargar pacientes del localstorage (si los hay)

    pacientes = StorageManager.cargarPacientes();
    if (pacientes == null) {
        pacientes = generarPacientesAleatorios();
        StorageManager.guardarPacientes(pacientes);

        /*
            Nota por si falla algo: Se esta pasando new Persona()
            que debe ser "compatible" con { dni, nombre }
        */
    }

    // Cargar turnos del localstorage (si los hay)
    let turnosCompletos = StorageManager.cargarTurnos();

    if (turnosCompletos == null) {
        // Generar turnos aleatorios
        for (medico of medicos)
            medico.generarTurnosRandom(pacientes);
    }
    else
        asignarTurnosAMedicos(turnosCompletos, medicos);

    // Actualizar turnos ya pasados y agregar mas si es necesario

    for (medico of medicos) {
        medico.eliminarTurnosAntesDe(Date.now());
        medico.generarTurnosRandom(pacientes);
    }

    turnosCompletos = obtenerTurnosCompletos(medicos);
    StorageManager.guardarTurnos(turnosCompletos);

    Interfaz.setListaMedicos(medicos);

    // En este punto esta todo cargado y actualizado

    Interfaz.mostrarInterfazRelevante(medicos, pacientes);

})();