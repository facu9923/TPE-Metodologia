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
    boton_agendar: document.querySelector("#boton-agendar"),
    interfaz_responsable: document.querySelector("#interfaz-responsable"),
    popup_crear_cuenta: document.querySelector("#popup-crear-cuenta"),
    boton_crear_cuenta: document.querySelector("#boton-crear-cuenta")
};

class Interfaz {

    static onClick = {};
    static onChange = {};

    static mostrarInterfazResponsable() {
        elemHTML.interfaz_login.style.display = "none";
        elemHTML.interfaz_general.style.display = "none";
        elemHTML.interfaz_responsable.style.display = "block";
        elemHTML.popup_crear_cuenta.style.display = "none";
        elemHTML.boton_crear_cuenta.style.display = "block";
    }

    static mostrarInterfazGeneral() {
        elemHTML.interfaz_general.style.display = "block";
        elemHTML.interfaz_login.style.display = "none";
    }

    static mostrarLogin() {
        elemHTML.interfaz_login.style.display = "block";
        elemHTML.interfaz_general.style.display = "none";
        elemHTML.interfaz_responsable.style.display = "none";
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
        document.getElementById("tipo-login").innerHTML = tipo;
        document.getElementById("nombre-login").innerHTML = nombre;
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

    static _getBotonCancelar(medico, turno, invisible) {
        const boton = document.createElement("button");
        boton.classList.add("boton-turno");
        boton.classList.add("boton-cancelar");
        boton.innerHTML = "Cancelar";

        if (invisible) {
            boton.style.opacity = "0";
            boton.style.cursor = "default";
        }
        else
            boton.addEventListener("click", () => {
                Interfaz.onClick.cancelar_turno(medico, turno);
            });

        return boton;
    }

    static _getBotonReagendar(medico, turno, invisible) {
        const boton = document.createElement("button");
        boton.classList.add("boton-turno");
        boton.classList.add("boton-reagendar");
        boton.innerHTML = "Reagendar";

        if (invisible) {
            boton.style.opacity = "0";
            boton.style.cursor = "default";
        }
        else
            boton.addEventListener("click", () => {
                Interfaz.onClick.reagendar_turno(medico, turno)
            });

        return boton;
    }

    static mostrarInterfazMedico(medico) {
        // Cargar turnos
        Interfaz.setTurnos(medico);
        Interfaz.mostrarH1proxPacientes();
        Interfaz.setLogueadoComo(medico.getNombre(), "médico");
        Interfaz.ocultarSeleccionMedico();
        Interfaz.mostrarTurnos();
        Interfaz.ocultarBotonSelecMedico();
        // Mostrar div
        Interfaz.mostrarInterfazGeneral();
    }

    static mostrarInterfazSecretaria(secretaria) {
        Interfaz.setListaMedicos(secretaria.getMedicos());
        Interfaz.ocultarH1proxPacientes();
        Interfaz.setLogueadoComo(secretaria.getNombre(), "secretaria");
        Interfaz.mostrarInterfazGeneral();
        Interfaz.mostrarSeleccionMedico();
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
    static setTurnos(medico) {

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

        for (let turno of medico.getTurnos()) {

            const timestamp = turno.getTimestamp();

            let hora = turno.getHoraStr();
            const dia = turno.getFechaStr();

            console.log("Agregando turno de: " + turno.getPaciente().getNombre());

            const elementoTurno = Interfaz._crearElementoTurno(
                turno.getPaciente().getNombre(),
                dia,
                hora,
                cancelar ? Interfaz._getBotonCancelar(medico, turno): null,
                reagendar ? Interfaz._getBotonReagendar(medico, turno): null,
            );

            elemHTML.contenedor_turnos.appendChild(elementoTurno);
        }
    }

    // Retorna un array de elementos HTML
    static _crearListaBotonesMedicos(medicos) {
        const listaMedicos = [];
        for (const medico of medicos) {
            const medicoItem = document.createElement("button");
            medicoItem.addEventListener("click", () => {
                Interfaz.onClick.medico_seleccionado(medico);
            });
            medicoItem.innerHTML = medico.getNombre();
            listaMedicos.push(medicoItem);
        }
        return listaMedicos;
    }

    static setListaMedicos(medicos) {
        const listaMedicos = Interfaz._crearListaBotonesMedicos(medicos);

        const container = document.getElementById("lista-medicos");

        container.innerHTML = "";

        for (let boton of listaMedicos)
            container.appendChild(boton);
    }

    static agregarTurnosDisponibles(medico, turno_seleccionado) {

        elemHTML.lista_turnos_disponibles.innerHTML = "";

        for (let turno_disponible of medico.getTurnosDisponibles()) {

            let container = document.createElement("div");
            let dia = document.createElement("div");
            let hora = document.createElement("div");
            let boton = document.createElement("button");
            boton.classList.add("boton_turno_reasignacion");
            container.appendChild(dia);
            container.appendChild(hora);
            container.appendChild(boton);

            dia.innerHTML = turno_disponible.getFechaStr();
            hora.innerHTML = turno_disponible.getHoraStr();
            boton.innerHTML = "Seleccionar";

            if (!turno_seleccionado)
                boton.addEventListener("click", () => {
                    Interfaz.onClick.confirmar_agenda(medico, turno_disponible);
                });
            else
                boton.addEventListener("click", () => {
                    Interfaz.onClick.confirmar_reagenda(medico, turno_seleccionado, turno_disponible);
                });

            elemHTML.lista_turnos_disponibles.appendChild(container);
        }
    }
}

Interfaz.onClick.cerrar_popup_crear_cuenta = function() {
    document.getElementById("popup-crear-cuenta").style.display = "none";
    // Vaciar los inputs...
    elemHTML.popup_crear_cuenta.style.display = "none";
    elemHTML.boton_crear_cuenta.style.display = "block";
};

Interfaz.vaciar_campos_crear_cuenta = function() {
    document.querySelector("#popup-crear-cuenta .nombre").innerHTML = "";
    document.querySelector("#popup-crear-cuenta .usuario").innerHTML = "";
    document.querySelector("#popup-crear-cuenta .dni").innerHTML = "";
    document.querySelector("#popup-crear-cuenta .contrasena").innerHTML = "";
}

Interfaz.onClick.abrir_popup_crear_cuenta = function() {
    elemHTML.popup_crear_cuenta.style.display = "block";
    elemHTML.boton_crear_cuenta.style.display = "none";
    Interfaz.vaciar_campos_crear_cuenta();
};

Interfaz.onClick.cerrar_popup_asignacion = () => {
    document.querySelector("#popup-asignacion").style.display = "none";
};

