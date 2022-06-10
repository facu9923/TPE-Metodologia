const elemHTML = {
    interfaz_login: document.querySelector("#interfaz-div"),
    interfaz_general: document.querySelector("#interfaz-general"),
    logueado_como: document.querySelector("#logueado-como"),
    btn_selec_medico: document.querySelector("#volver-seleccion-medico"),
    h1_proximos_pacientes: document.querySelector("#h1-proximos-pacientes"),
    contenedor_turnos: document.querySelector("#contenedor-turnos"),

};

class Interfaz {

    static mostrarLogin() {
        elemHTML.interfaz_login.style.display = "block";
        elemHTML.interfaz_general.style.display = "none";
    }

    static ocultarLogin() {
        elemHTML.interfaz_login.style.display = "none";
        elemHTML.interfaz_general.style.display = "block";
    }

    static mostrarInterfazGeneral(tipo) {
        Interfaz.ocultarLogin();

        if (tipo == "medico") {
            elemHTML.btn_selec_medico.style.display = "none";
            elemHTML.h1_proximos_pacientes.style.display = "block";
        }
        else if (tipo == "secretaria")
        {
            elemHTML.btn_selec_medico.style.display = "block";
            elemHTML.h1_proximos_pacientes.style.display = "none";
        }
    }

    static setLogueadoComo(nombre, tipo) {
        if (tipo)
            elemHTML.logueado_como.innerHTML = tipo + ": ";
        else
            elemHTML.logueado_como.innerHTML = "";

        elemHTML.logueado_como.innerHTML += nombre;
    }

    /**
     * Retorna un elemento HTML para insertar en la tabla
     */
    static _crearElementoTurno(nombre_paciente,
                               timestamp,
                               medico,
                               boton_cancelar,
                               boton_reagendar) {

        let hora = "Hora";
        let fecha = "Dia";

        if (timestamp) {
            const fechaDateObject = new Date(timestamp); 
            hora = fechaDateObject.toLocaleTimeString();
            fecha = fechaDateObject.toLocaleDateString();
            hora = eliminarSegundos(hora);
        }

        const elementoTurno = document.createElement("div");
        elementoTurno.classList.add("turno");
        const elementoNombrePaciente = document.createElement("div");
        elementoNombrePaciente.classList.add("turno-nombre");
        const elementoFechaTurno = document.createElement("div");
        elementoFechaTurno.classList.add("turno-dia");
        const elementoHoraTurno = document.createElement("div");
        elementoHoraTurno.classList.add("turno-hora");

        elementoNombrePaciente.innerHTML = nombre_paciente;
        elementoFechaTurno.innerHTML = fecha;
        elementoHoraTurno.innerHTML = hora;

        elementoTurno.appendChild(elementoNombrePaciente);
        elementoTurno.appendChild(elementoFechaTurno);
        elementoTurno.appendChild(elementoHoraTurno);

        if (boton_cancelar) {
            const botonCancelar = document.createElement("div");
            botonCancelar.innerHTML = "Cancelar";
            botonCancelar.classList.add("boton_cancelar_turno");
            botonCancelar.setAttribute("onClick", `Interfaz.onClick.borrarTurno("${medico.getUsuario()}", ${timestamp}, "${container}")`);
            elementoTurno.appendChild(botonCancelar);
        }

        if (boton_reagendar) {
            const botonReagendar = document.createElement("button");
            botonReagendar.innerHTML = "Reagendar";
            botonReagendar.classList.add("boton_reagendar_turno");
            botonReagendar.setAttribute("onClick", `Interfaz.onClick.reagendarTurno("${medico.getUsuario()}", ${timestamp})`);
            elementoTurno.appendChild(botonReagendar);
        }

        return elementoTurno;
    }

    static mostrarInterfazReagendar(usuario_medico, timestamp_turno_seleccionado) {
        document.getElementById("reasignar_popup").style.display = "block";

        const lista_turnos = document.getElementById("lista_turnos_disponibles");
        lista_turnos.innerHTML="";

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
            hora.innerHTML = Interfaz._eliminarSegundos(turno_disponible.toLocaleTimeString());
            boton.innerHTML = "Seleccionar";

            boton.setAttribute("onClick", `reagendarTurno("${usuario_medico}", ${timestamp_turno_seleccionado}, ${turno_disponible.getTime()})`);
            
            lista_turnos.appendChild(container);
        }

    }

    /**
     * Insertar los turnos en la tabla para que los puedan ver
     * los médicos.
     * La tabla se resetea antes de comenzar a insertar.
     */
    static setTurnos(medico, pacientes, cancelar, reagendar) {

        elemHTML.contenedor_turnos.innerHTML = "";

        elemHTML.contenedor_turnos.appendChild(
            Interfaz._crearElementoTurno(
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

    static mostrarInterfazRelevante(medicos, pacientes) {

        if (!StorageManager.isLogged())
        {
            Interfaz.mostrarLogin();
            return;
        }

        Interfaz.mostrarInterfazGeneral();

        if (StorageManager.getTipoLogin() == "medico")
        {
            // Configurar interfaz medico

            Interfaz.setLogueadoComo(StorageManager.getUsuario(), "médico");

            Interfaz.setTurnos(
                get_medico_por_usuario(StorageManager.getUsuario()),
                pacientes
            );
        }
        else // secretaria
        {            
            Interfaz.setLogueadoComo(StorageManager.getUsuario(), "secretaria");
        }
    }

    static _crearListaBotonesMedicos(medicos) {
        const listaMedicos = document.createElement("div");
        listaMedicos.setAttribute("id", "lista_medicos");
        for (let medico of medicos) {
            const medicoItem = document.createElement("button");
            medicoItem.setAttribute("onClick", `Interfaz.onClick.medicoSeleccionado("${medico.getUsuario()}")`);
            medicoItem.innerHTML = medico.getNombre();
            listaMedicos.appendChild(medicoItem);
        }
        return listaMedicos;
    }

    static setListaMedicos(medicos) {
        const listaMedicos = Interfaz._crearListaBotonesMedicos(medicos);
        document.getElementById("seleccion_medico").appendChild(listaMedicos);
    }

    static ocultarReasignacionPopup() {
        document.getElementById("reasignar_popup").style.display = "none";
    }

    onClick = {

        login_button: () => {

            const usuario = document.querySelector("#user").value;
            const contrasena = document.querySelector("#pw").value;
        
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
        medicoSeleccionado(usuario_medico) {
        
            document.getElementById("seleccion_medico").style.display = "none";        
            document.getElementById("retroceso").style.display = "block";
    
            Interfaz.setTurnos(get_medico_por_usuario(medicos, usuario_medico), pacientes, "#administracion_medico", true, true);
    
        },
        cerrarSesion() {

        },
        volver_a_seleccion_medico() {
            
        }
    }

}