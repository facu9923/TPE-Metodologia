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
    static _crearElementoTurno(nombre_paciente, timestamp, medico, cancelar = true, reagendar = false) {

        let hora = "Hora";
        let fecha = "Dia";

        if (timestamp) {
            const fechaDateObject = new Date(timestamp); 
            hora = fechaDateObject.toLocaleTimeString();
            fecha = fechaDateObject.toLocaleDateString();
            hora = Interfaz._eliminarSegundos(hora);
        }

        let container = ".turnos-container";
        if (reagendar)
            container = "#administracion_medico";

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

        if (!timestamp) {
            let botonFicticio = document.createElement("button");
            botonFicticio.classList.add("boton_cancelar");
            botonFicticio.classList.add("invisible");
            elementoTurno.appendChild(botonFicticio);

            if (reagendar) {
                botonFicticio = document.createElement("button");
                botonFicticio.classList.add("boton_cancelar");
                botonFicticio.classList.add("invisible");
                elementoTurno.appendChild(botonFicticio);
            }

        }

        if (cancelar && medico) {
            const botonCancelar = document.createElement("button");
            botonCancelar.innerHTML = "Cancelar";
            botonCancelar.classList.add("boton_cancelar")
            botonCancelar.setAttribute("onClick", `Interfaz.borrarTurno("${medico.getUsuario()}", ${timestamp}, "${container}")`);
            elementoTurno.appendChild(botonCancelar);
        }

        if (reagendar && medico) {
            const botonReagendar = document.createElement("button");
            botonReagendar.innerHTML = "Reagendar";
            botonReagendar.classList.add("boton_reagendar");
            botonReagendar.setAttribute("onClick", ``);
            elementoTurno.appendChild(botonReagendar);
        }

        return elementoTurno;
    }

    static borrarTurno(usuario_medico, timestamp, container) {

        const medico = get_medico_por_usuario(medicos, usuario_medico);

        medico.eliminarTurno(timestamp);

        if (container == "#administracion_medico")
            Interfaz.setTurnos(medico, pacientes, container, true, true);
        else
            Interfaz.setTurnos(medico, pacientes, container, true, false);
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
    static setTurnos(medico, pacientes, container = ".turnos-container", cancelar, reagendar) {

        const contenedorTurnos = document.querySelector(container);
        contenedorTurnos.innerHTML="";

        // _crearElementoTurno(nombre_paciente, timestamp, medico, cancelar = true, reagendar = false) {

        contenedorTurnos.appendChild(Interfaz._crearElementoTurno(
            "Paciente",
            null,
            null,
            cancelar,
            reagendar
        ));

        for (let turno of medico.getListaTurnos()) {
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
                timestamp,
                medico,
                cancelar,
                reagendar
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
                medicos[indiceMedicoPorUsuario(StorageManager.getUsuario())],
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

    static _crearListaBotonesMedicos(medicos) {
        const listaMedicos = document.createElement("div");
        listaMedicos.setAttribute("id", "listaMedicos");
        for (let medico of medicos) {
            const medicoItem = document.createElement("button");
            medicoItem.setAttribute("onClick", `Interfaz.medicoSeleccionado("${medico.getUsuario()}")`);
            medicoItem.innerHTML = medico.getNombre();
            listaMedicos.appendChild(medicoItem);
        }
        return listaMedicos;
    }

    static setListaMedicos(medicos) {
        const listaMedicos = Interfaz._crearListaBotonesMedicos(medicos);
        document.getElementById("seleccion_medico").appendChild(listaMedicos);
    }

    static medicoSeleccionado(usuario_medico) {
        
        document.getElementById("seleccion_medico").style.display = "none";        
        document.getElementById("retroceso").style.display = "block";

        Interfaz.setTurnos(get_medico_por_usuario(medicos, usuario_medico), pacientes, "#administracion_medico", true, true);

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

function get_medico_por_usuario(medicos, usuario) {
    for (let i = 0; i < medicos.length; i++)
        if (medicos[i].getUsuario() == usuario)
            return medicos[i];
}