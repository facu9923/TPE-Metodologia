const elemHTML = {
    interfaz_login: document.querySelector("#interfaz-login"),
    interfaz_general: document.querySelector("#interfaz-general"),
    logueado_como: document.querySelector("#logueado-como"),
    btn_selec_medico: document.querySelector("#volver-seleccion-medico"),
    h1_proximos_pacientes: document.querySelector("#h1-proximos-pacientes"),
    contenedor_turnos: document.querySelector("#contenedor-turnos"),
    lista_medicos: document.querySelector("#lista-medicos"),
    turnos_disponibles: document.querySelector("#turnos-disponibles"),
    lista_turnos_disponibles: document.querySelector("#lista-turnos-disponibles"),
    datos_paciente_form: document.querySelector("#datos-paciente"),
    boton_agendar: document.querySelector("#boton-agendar")
};

class Interfaz {

    static mostrarLogin() {
        elemHTML.interfaz_login.style.display = "block";
    }

    static ocultarTurnos() {
        elemHTML.contenedor_turnos.style.display = "none";
    }

    static mostrarTurnos() {
        elemHTML.contenedor_turnos.style.display = "block";
    }

    static ocultarBotonSelecMedico() {
        elemHTML.btn_selec_medico.style.display = "none";
    }

    static mostrarInterfazGeneral() {
        elemHTML.interfaz_general.style.display = "block";
        elemHTML.interfaz_login.style.display = "none";
    }

    static mostrarSeleccionMedico() {
        elemHTML.lista_medicos.style.display = "block";
        elemHTML.btn_selec_medico.style.display = "none";
        Interfaz.ocultarTurnos();
    }

    static ocultarSeleccionMedico() {
        elemHTML.lista_medicos.style.display = "none";
        elemHTML.btn_selec_medico.style.display = "block";
    }

    static setLogueadoComo(nombre, tipo) {
        elemHTML.logueado_como.innerHTML = tipo + ": " + nombre;
    }

    static ocultarTurnosDisponiblesPopUp() {
        elemHTML.turnos_disponibles.style.display = "none";
    }

    static mostrarTurnosDisponiblesPopUp() {
        elemHTML.turnos_disponibles.style.display = "block";
    }

    static mostrarPacienteForm() {
        elemHTML.datos_paciente_form.style.display = "block";
    }

    static ocultarPacienteForm() {
        elemHTML.datos_paciente_form.style.display = "none";
    }

    static mostrarBotonAgendar() {
        elemHTML.boton_agendar.style.display = "block";
    }

    static ocultarBotonAgendar() {
        elemHTML.boton_agendar.style.display = "none";
    }

    static mostrarH1proxPacientes() {
        elemHTML.h1_proximos_pacientes.style.display = "block";
    }

    static ocultarH1proxPacientes() {
        elemHTML.h1_proximos_pacientes.style.display = "none";
    }

    static _getBotonCancelar(usuario_medico, timestamp, invisible) {
        const boton = document.createElement("button");
        boton.classList.add("boton-turno");
        boton.classList.add("boton-cancelar");
        boton.innerHTML = "Cancelar";

        if (invisible) {
            boton.style.opacity = "0";
            boton.style.cursor = "default";
        }
        else
            boton.setAttribute("onClick", `Interfaz.onClick.cancelar_turno("${usuario_medico}", ${timestamp})`);

        return boton;
    }

    static _getBotonReagendar(usuario_medico, timestamp, invisible) {
        const boton = document.createElement("button");
        boton.classList.add("boton-turno");
        boton.classList.add("boton-reagendar");
        boton.innerHTML = "Reagendar";

        if (invisible) {
            boton.style.opacity = "0";
            boton.style.cursor = "default";
        }
        else
            boton.setAttribute("onClick", `Interfaz.onClick.reagendar_turno("${usuario_medico}", ${timestamp})`);

        return boton;
    }

    static _crearElementoTurno(primer_campo_str,
                               segundo_campo_str,
                               tercer_campo_str,
                               primer_boton,
                               segundo_boton) {

        const elementoTurno = document.createElement("div");
        elementoTurno.classList.add("turno");
        const elementoNombrePaciente = document.createElement("div");
        elementoNombrePaciente.classList.add("nombre-paciente");
        const elementoFechaTurno = document.createElement("div");
        elementoFechaTurno.classList.add("fecha-turno");
        const elementoHoraTurno = document.createElement("div");
        elementoHoraTurno.classList.add("hora-turno");

        elementoNombrePaciente.innerHTML = primer_campo_str;
        elementoFechaTurno.innerHTML = segundo_campo_str;
        elementoHoraTurno.innerHTML = tercer_campo_str;

        elementoTurno.appendChild(elementoNombrePaciente);
        elementoTurno.appendChild(elementoFechaTurno);
        elementoTurno.appendChild(elementoHoraTurno);

        if (primer_boton)
            elementoTurno.appendChild(primer_boton);
        if (segundo_boton)
            elementoTurno.appendChild(segundo_boton);

        return elementoTurno;
    }

    /**
     * Insertar los turnos en la tabla para que los puedan ver
     * los médicos.
     * La tabla se resetea antes de comenzar a insertar.
     */
    static setTurnos(medico, pacientes) {

        let cancelar = true;
        let reagendar = StorageManager.getTipoLogin() == "secretaria";

        elemHTML.contenedor_turnos.innerHTML = "";

        elemHTML.contenedor_turnos.appendChild(
            Interfaz._crearElementoTurno(
                "Paciente",
                "Dia",
                "Hora",
                cancelar ? Interfaz._getBotonCancelar(null, null, true): null,
                reagendar ? Interfaz._getBotonReagendar(null, null, true): null
        ));

        for (let turno of medico.getListaTurnos()) {

            const dni_paciente = turno.dni_paciente;
            const timestamp = turno.timestamp;
            const nombre_paciente = dni_paciente_a_nombre(pacientes, dni_paciente);
            const fechaDateObject = new Date(timestamp);

            let hora = fechaDateObject.toLocaleTimeString();
            hora = eliminarSegundos(hora);
            const dia = fechaDateObject.toLocaleDateString();

            const elementoTurno = Interfaz._crearElementoTurno(
                nombre_paciente,
                dia,
                hora,
                cancelar ? Interfaz._getBotonCancelar(medico.getUsuario(), timestamp): null,
                reagendar ? Interfaz._getBotonReagendar(medico.getUsuario(), timestamp): null,
            );

            elemHTML.contenedor_turnos.appendChild(elementoTurno);
        }
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

            Interfaz.setLogueadoComo(StorageManager.getUsuario(), "médico");
            Interfaz.ocultarSeleccionMedico();
            Interfaz.ocultarBotonSelecMedico();
            Interfaz.mostrarH1proxPacientes();
            Interfaz.mostrarTurnos();

            Interfaz.setTurnos(
                get_medico_por_usuario(medicos, StorageManager.getUsuario()),
                pacientes
            );
        }
        else // secretaria
        {
            Interfaz.setLogueadoComo(StorageManager.getUsuario(), "secretaria", true, true);
            Interfaz.mostrarSeleccionMedico();
            Interfaz.ocultarH1proxPacientes();
            Interfaz.ocultarTurnos();
        }

        Interfaz.mostrarInterfazGeneral();
    }

    // Retorna un array de elementos HTML
    static _crearListaBotonesMedicos(medicos) {
        const listaMedicos = [];
        for (let medico of medicos) {
            const medicoItem = document.createElement("button");
            medicoItem.setAttribute("onClick", `Interfaz.onClick.medico_seleccionado("${medico.getUsuario()}")`);
            medicoItem.innerHTML = medico.getNombre();
            listaMedicos.push(medicoItem);
        }
        return listaMedicos;
    }

    static setListaMedicos(medicos) {
        const listaMedicos = Interfaz._crearListaBotonesMedicos(medicos);

        const container = document.getElementById("lista-medicos");

        for (let boton of listaMedicos)
            container.appendChild(boton);
    }


    static agregarTurnosDisponibles(usuario_medico, timestamp_turno_seleccionado, tipo = "agenda") {

        elemHTML.lista_turnos_disponibles.innerHTML = "";

        let medico = get_medico_por_usuario(medicos, usuario_medico);

        for (let turno_disponible of getTurnosDisponibles(medico)) {

            let container = document.createElement("div");
            let dia = document.createElement("div");
            let hora = document.createElement("div");
            let boton = document.createElement("button");
            boton.classList.add("boton_turno_reasignacion");
            container.appendChild(dia);
            container.appendChild(hora);
            container.appendChild(boton);

            dia.innerHTML = turno_disponible.toLocaleDateString();
            hora.innerHTML = eliminarSegundos(turno_disponible.toLocaleTimeString());
            boton.innerHTML = "Seleccionar";

            if (tipo == "agenda")
                boton.setAttribute("onClick", `Interfaz.onClick.confirmar_agenda("${usuario_medico}", ${turno_disponible.getTime()})`);
            else
                boton.setAttribute("onClick", `Interfaz.onClick.confirmar_reagenda("${usuario_medico}", ${timestamp_turno_seleccionado}, ${turno_disponible.getTime()})`);

            elemHTML.lista_turnos_disponibles.appendChild(container);
        }
    }
}

Interfaz.onClick = {

    login_button: () => {

        const usuario = document.querySelector("#user").value;
        const contrasena = document.querySelector("#pw").value;

        if (!usuario || !contrasena)
            return;

        const resultado_login = comprobarCredenciales(usuario, contrasena);

        if (resultado_login.encontrado == false) {
            alert("Usuario no encontrado!");
            return;
        }

        if (resultado_login.credenciales_validas == false) {
            alert("Contraseña incorrecta!");
            return;
        }

        StorageManager.guardarLogin({
            logged_as: resultado_login.tipo,
            usuario,
            contrasena
        });

        Interfaz.mostrarInterfazRelevante(medicos, pacientes);

    },
    medico_seleccionado(usuario_medico) {
        StorageManager.medicoSeleccionado = usuario_medico;
        Interfaz.ocultarSeleccionMedico();
        Interfaz.setTurnos(get_medico_por_usuario(medicos, usuario_medico), pacientes);
        Interfaz.mostrarBotonAgendar();
        Interfaz.mostrarTurnos();
    },
    cerrar_sesion() {
        StorageManager.cerrarSesion();
        Interfaz.ocultarBotonAgendar();
        Interfaz.mostrarInterfazRelevante();
        Interfaz.ocultarH1proxPacientes();
    },
    volver_a_seleccion_medico() {
        Interfaz.ocultarBotonAgendar();
        Interfaz.mostrarSeleccionMedico();
    },
    cancelar_turno(usuario_medico, timestamp_turno) {
        const medico = get_medico_por_usuario(medicos, usuario_medico);
        medico.eliminarTurno(timestamp_turno);
        StorageManager.guardarTurnos(obtenerTurnosCompletos(medicos));

        Interfaz.setTurnos(medico, pacientes);
    },
    reagendar_turno(usuario_medico, timestamp_turno_seleccionado) {
        Interfaz.agregarTurnosDisponibles(usuario_medico, timestamp_turno_seleccionado, "reagenda");
        Interfaz.ocultarPacienteForm();
        Interfaz.mostrarTurnosDisponiblesPopUp();
    },
    confirmar_reagenda(usuario_medico, timestamp_viejo, timestamp_nuevo) {

        const medico = get_medico_por_usuario(medicos, usuario_medico);
        medico.modificarTimestampTurno(timestamp_viejo, timestamp_nuevo);

        Interfaz.setTurnos(medico, pacientes);
        Interfaz.ocultarTurnosDisponiblesPopUp();
    },
    agendar_turno() {
        Interfaz.agregarTurnosDisponibles(StorageManager.medicoSeleccionado, null, "agenda");
        Interfaz.mostrarPacienteForm();
        Interfaz.mostrarTurnosDisponiblesPopUp();
    },
    confirmar_agenda(usuario_medico, timestamp_turno) {

        const medico = get_medico_por_usuario(medicos, usuario_medico);

        let nombrePaciente = document.getElementById("datos-paciente-nombre").value;
        let dniPaciente;

        try {
            dniPaciente = Number(document.getElementById("datos-paciente-dni").value);
        } catch {
            return;
        }

        pacientes.push(new Persona(dniPaciente, nombrePaciente));
        StorageManager.guardarPacientes(pacientes);

        medico._insertarOrdenado(dniPaciente, timestamp_turno);
        StorageManager.guardarTurnos(obtenerTurnosCompletos(medicos));

        Interfaz.setTurnos(medico, pacientes);
        Interfaz.ocultarTurnosDisponiblesPopUp();
    }
}