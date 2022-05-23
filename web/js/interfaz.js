class Interfaz {

    static mostrarLogin() {
        document.querySelector(".login-div").style.display = "block";
        document.querySelector(".interfaz-medico").style.display = "none";
        document.querySelector(".interfaz-secretaria").style.display = "none";
    }

    static ocultarLogin() {
        document.querySelector(".login-div").style.display = "none";
    }

    static setNombre(nombre) {
        document.getElementById("nombre-medico").innerHTML = nombre;
        document.getElementById("nombre-secretaria").innerHTML = nombre;
    }

    /**
     * Retorna un elemento HTML para insertar en la tabla de pacientes
     * que ven los médicos.
     */
    static _crearElementoTurno(nombre_paciente, fecha, hora) {
        const elementoTurno = document.createElement("div");
        elementoTurno.classList.add("turno-container");
        const elementoNombrePaciente = document.createElement("div");
        elementoNombrePaciente.classList.add("nombre-paciente");
        const elementoFechaTurno = document.createElement("div");
        elementoFechaTurno.classList.add("fecha-turno");
        const elementoHoraTurno = document.createElement("div");
        elementoHoraTurno.classList.add("hora-turno");

        elementoNombrePaciente.innerHTML = nombre_paciente;
        elementoFechaTurno.innerHTML = fecha;
        elementoHoraTurno.innerHTML = hora;

        elementoTurno.appendChild(elementoNombrePaciente);
        elementoTurno.appendChild(elementoFechaTurno);
        elementoTurno.appendChild(elementoHoraTurno);

        return elementoTurno;
    }

    static _eliminarSegundos(hora) {

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

    /**
     * Insertar los turnos en la tabla para que los puedan ver
     * los médicos.
     * La tabla se resetea antes de comenzar a insertar.
     */
    static setTurnos(turnos, pacientes) {

        const contenedorTurnos = document.querySelector(".turnos-container");
        contenedorTurnos.innerHTML="";

        contenedorTurnos.appendChild(Interfaz._crearElementoTurno(
            "Paciente",
            "Día",
            "Hora"
        ));

        for (let turno of turnos) {
            const dni_paciente = turno.dni_paciente;
            const timestamp = turno.timestamp;
            const nombre_paciente = dni_paciente_a_nombre(pacientes, dni_paciente);
            const fechaDateObject = new Date(timestamp);
            
            let hora = fechaDateObject.toLocaleTimeString();

            // Eliminar los segundos de la hora en formato hora:min:segs
            hora = Interfaz._eliminarSegundos(hora);

            const dia = fechaDateObject.toLocaleDateString();

            const elementoTurno = Interfaz._crearElementoTurno(
                nombre_paciente,
                dia,
                hora
            );

            contenedorTurnos.appendChild(elementoTurno);
        }
    }

    static mostrarInterfazMedico() {
        Interfaz.ocultarLogin();
        document.querySelector(".interfaz-medico").style.display = "block";
        document.querySelector(".interfaz-secretaria").style.display = "none";
    }

    static mostrarInterfazSecretaria() {
        Interfaz.ocultarLogin();
        document.querySelector(".interfaz-medico").style.display = "none";
        document.querySelector(".interfaz-secretaria").style.display = "block";
    }

    static mostrarInterfazRelevante(medicos, pacientes) {

        if (!StorageManager.isLogged())
        {
            Interfaz.mostrarLogin();
            return;
        }

        if (StorageManager.getTipoLogin() == "medico")
        {
            // Configurar interfaz medico

            Interfaz.mostrarInterfazMedico();
            Interfaz.setNombre(StorageManager.getUsuario());

            function indiceMedicoPorUsuario(usuario) {
                for (let i = 0; i < medicos.length; i++)
                    if (medicos[i].getUsuario() == usuario)
                        return i;
                return -1;
            }

            Interfaz.setTurnos(
                medicos[indiceMedicoPorUsuario(StorageManager.getUsuario())].getListaTurnos(),
                pacientes
            );
        }
        else
        {
            Interfaz.mostrarInterfazSecretaria();
            Interfaz.setNombre(StorageManager.getUsuario());
            // Configurar interfaz secretaria
        }
    }

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