class TurnoFacil {

    constructor() {
        this._medicos = [];
        this._secretarias = [];
        this._medico_actual = null;
    }

    pacienteRandom() {
        return new Persona(
            enteroRandom(10000000, 50000000),
            dataset_nombres[enteroRandom(0, dataset_nombres.length-1)]
        );
    }

    generarTurnosRandom(medico) {

        let generador;

        if (medico.cantidadTurnos() > 0) {
            generador = medico.getTurnos()[medico.cantidadTurnos()-1].getCopia();
            generador.posponerHoras(1);
        }
        else
            generador = Turno.proximoPosible();

        for (let i = medico.cantidadTurnos(); i < enteroRandom(30, 45); i++) {

            generador.posponerHoras(1);
            generador.setPaciente(this.pacienteRandom());

            // 0.05 de chance de "dejar un hueco" en los turnos
            if (Math.random() < 0.05)
                continue;

            medico.agregarTurno(generador.getCopia());
        }
    }

    setMedicosDefault() {
        this._medicos = DEFAULT.medicos;
    }

    setSecretariasDefault() {
        this._secretarias = DEFAULT.secretarias;
    }

    getMedicoFromUsername(username) {
        for (const medico of this._medicos)
            if (medico.getUsuario() == username)
                return medico;
    }

    getSecretariaFromUsername(username) {
        for (const secretaria of this._secretarias)
            if (secretaria.getUsuario() == username)
                return secretaria;
    }

    comprobarCredenciales(usuario, contrasena) {

        function buscarEn(lista) {

            let resultado = {
                encontrado: false,
                credenciales_validas: false,
                tipo: null,
                persona: null
            };

            for (let persona of lista)
                if (persona.getUsuario() == usuario) {
                    resultado.encontrado = true;
                    if (persona.getContrasena() == contrasena)
                        resultado.credenciales_validas = true;
                    resultado.persona = persona;
                    break;
                }

            return resultado;
        }
    
        let resultado = buscarEn(this._medicos);

        if (resultado.encontrado) {
            resultado.tipo = "medico";
            return resultado;
        }

        resultado = buscarEn(this._secretarias);

        if (resultado.encontrado) {
            resultado.tipo = "secretaria";
            return resultado;
        }

        resultado = buscarEn(this._responsables);

        if (resultado.encontrado) {
            resultado.tipo = "responsable";
            return resultado;
        }

        return resultado;
    }

    inicializar() {

        if (StorageManager.getVersion() != DEFAULT.version) {
            StorageManager.eliminarTodo();
            StorageManager.setVersion(DEFAULT.version);
        }

        this._responsables = DEFAULT.responsables;

        this._medicos = StorageManager.cargarListaObjetos("medicos");
        if (!this._medicos) {
            this.setMedicosDefault();
            StorageManager.guardarListaObjetos("medicos", this._medicos);
        } else
            console.log("Medicos cargados del local storage", this._medicos);
        
        this._secretarias = StorageManager.cargarListaObjetos("secretarias");
        if (!this._secretarias) {
            this.setSecretariasDefault();
            StorageManager.guardarListaObjetos("secretarias", this._secretarias);
        } else
            console.log("Secretarias cargadas del local storage", this._secretarias);
        
        // Vincular dni de los medicos con los objetos Medico
        for (const secretaria of this._secretarias)
            secretaria.vincularMedicos(this._medicos);
        
        for (const medico of this._medicos) {
            medico.eliminarTurnosViejos();
            this.generarTurnosRandom(medico);
        }

        StorageManager.guardarDatos(
            this._medicos,
            this._secretarias
        );

        // Cargar la interfaz

        if (!StorageManager.isLogged())
            Interfaz.mostrarLogin();
        else {
            const usuario = StorageManager.getUsuario();

            if (StorageManager.getTipoLogin() == "medico") {
                const medico = this.getMedicoFromUsername(usuario);
                this._medico_actual = medico;
                Interfaz.mostrarInterfazMedico(medico);
            }
            if (StorageManager.getTipoLogin() == "secretaria") {
                const secretaria = this.getSecretariaFromUsername(usuario);
                Interfaz.mostrarInterfazSecretaria(secretaria);
            }
            if (StorageManager.getTipoLogin() == "responsable") {
                Interfaz.mostrarInterfazResponsable();
            }
        }           

        this.agregarEventosInterfaz();
    }

    agregarEventosInterfaz() {

        Interfaz.onClick.login_button = () => {

            const usuario = document.querySelector("#user").value;
            const contrasena = document.querySelector("#pw").value;
    
            if (!usuario || !contrasena)
                return;
    
            const resultado_login = this.comprobarCredenciales(usuario, contrasena);
    
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

            this._persona_actual = resultado_login.persona;

            if (resultado_login.tipo == "medico") {
                Interfaz.mostrarInterfazMedico(resultado_login.persona);
                this._medico_actual = resultado_login.persona;
            }
            if (resultado_login.tipo == "secretaria")
                Interfaz.mostrarInterfazSecretaria(resultado_login.persona);

            if (resultado_login.tipo == "responsable")
                Interfaz.mostrarInterfazResponsable();
            
        };

        Interfaz.onClick.cancelar_turno = (medico, turno) => {
            medico.eliminarTurno(turno);

            StorageManager.guardarDatos(
                this._medicos,
                this._secretarias
            );

            // Actualizar la interfaz

            Interfaz.setTurnos(medico);
        };

        Interfaz.onClick.reagendar_turno = (medico, turno_seleccionado) => {
            Interfaz.agregarTurnosDisponibles(medico, turno_seleccionado);
            Interfaz.ocultarPacienteForm();
            Interfaz.mostrarTurnosDisponiblesPopUp();
        };

        Interfaz.onClick.medico_seleccionado = (medico) => {
            Interfaz.ocultarSeleccionMedico();
            Interfaz.setTurnos(medico);
            Interfaz.mostrarBotonAgendar();
            Interfaz.mostrarTurnos();
            this._medico_actual = medico;
        };

        Interfaz.onClick.confirmar_agenda = (medico, turno) => {

            let nombrePaciente = document.getElementById("datos-paciente-nombre").value;
            let dniPaciente = Number(document.getElementById("datos-paciente-dni").value);
    
            // Ver si ya existe el dni (guardar en turno.paciente)

            turno.setPaciente(new Persona(
                dniPaciente,
                nombrePaciente
            ));
    
            medico.agregarTurno(turno);
            StorageManager.guardarListaObjetos("medicos", this._medicos);
    
            Interfaz.setTurnos(medico);
            Interfaz.ocultarTurnosDisponiblesPopUp();
        };

        Interfaz.onClick.agendar_turno = () => {
            document.querySelector("#datos-paciente-nombre").value="";
            document.querySelector("#datos-paciente-dni").value="";
            Interfaz.agregarTurnosDisponibles(this._medico_actual, null, "agenda");
            Interfaz.mostrarPacienteForm();
            Interfaz.mostrarTurnosDisponiblesPopUp();
        };

        Interfaz.onClick.confirmar_reagenda = (medico, turno_seleccionado, turno_nuevo) => {
    
            medico.reagendarTurno(turno_seleccionado, turno_nuevo);

            Interfaz.setTurnos(medico);
            Interfaz.ocultarTurnosDisponiblesPopUp();
        };

        Interfaz.onClick.cerrar_sesion = () => {
            StorageManager.cerrarSesion();
            Interfaz.ocultarBotonAgendar();
            Interfaz.mostrarLogin();
            Interfaz.mostrarSeleccionMedico();
            Interfaz.ocultarH1proxPacientes();
        };

        Interfaz.onClick.volver_a_seleccion_medico = () => {
            Interfaz.ocultarBotonAgendar();
            Interfaz.mostrarSeleccionMedico();
        };

        Interfaz.onClick.crear_cuenta = () => {

            // Agarrar los datos del html
            const tipo_cuenta = document.querySelector("#popup-crear-cuenta #select-tipo-cuenta").value;
            const nombre = document.querySelector("#popup-crear-cuenta .nombre").value;
            const dni = Number(document.querySelector("#popup-crear-cuenta .dni").value);
            const nombre_usuario = document.querySelector("#popup-crear-cuenta .usuario").value;
            const contrasena = document.querySelector("#popup-crear-cuenta .contrasena").value;

            if (!tipo_cuenta || !nombre || !nombre_usuario || !contrasena)
                return alert("Debes completar todos los campos");
            
            if (!dni || isNaN(dni))
                return alert("El DNI no es valido");

            // Crear cuenta

            const l = (tipo_cuenta == "medico") ? this._medicos : this._secretarias;
            const t = (tipo_cuenta == "medico") ? Medico : Secretaria;

            for (const medico of this._medicos)
                if (dni == medico.getDNI() || nombre_usuario == medico.getUsuario())
                    return alert("Error: el usuario ya está registrado como médico");
            for (const secr of this._secretarias)
                if (dni == secr.getDNI() || nombre_usuario == secr.getUsuario())
                    return alert("Error: el usuario ya está registrado como secretaria");

            /*
            for (let i = 0; i < l.length; i++)
                if (dni == l[i].getDNI() || nombre_usuario == l[i].getUsuario())
                    return alert("Ya existe una cuenta con los datos ingresados");
            */

            // Guardar el dato en memoria
            l.push(new t(dni, nombre, nombre_usuario, contrasena));

            // Guardar el dato en el disco
            StorageManager.guardarDatos(
                this._medicos,
                this._secretarias
            );

            // Y cerrar el popup

            document.querySelector("#popup-crear-cuenta").style.display = "none";

            alert("Cuenta creada exitosamente");
        };

        Interfaz.onChange.secretaria_seleccionada = () => {
            const usuario_secretaria = document.getElementById("asignacion-secretaria").value;
            const secretaria = this.getSecretariaFromUsername(usuario_secretaria);

            // Diferencia de medicos

            let medicos_seleccionables = [];
            for (let i = 0; i < this._medicos.length; i++)
                if (!secretaria.getMedicos().includes(this._medicos[i]))
                    medicos_seleccionables.push(this._medicos[i]);
            
            // Agregar los items al select de medico

            const elm = document.getElementById("asignacion-medico");
            elm.innerHTML = "";

            for (let medico of medicos_seleccionables) {
                const option = document.createElement("option");
                option.setAttribute("value", medico.getUsuario());
                option.innerHTML = medico.getNombre();
                elm.appendChild(option);
            }
        };

        // Se clickeó 'asociar medico a secretaria'
        Interfaz.onClick.abrir_popup_asignacion = () => {
            document.querySelector("#popup-asignacion").style.display = "block";

            // Agregar secretarias
            const elm = document.getElementById("asignacion-secretaria");
            elm.innerHTML = "";

            for (let i = 0; i < this._secretarias.length; i++) {
                const option = document.createElement("option");
                option.value = this._secretarias[i].getUsuario();
                option.innerHTML = this._secretarias[i].getNombre();
                elm.appendChild(option);
            }
            Interfaz.onChange.secretaria_seleccionada();
        };

        Interfaz.onClick.boton_vincular = () => {

            const usuario_secretaria = document.getElementById("asignacion-secretaria").value;
            const usuario_medico = document.getElementById("asignacion-medico").value;

            const secretaria = this.getSecretariaFromUsername(usuario_secretaria);
            const medico = this.getMedicoFromUsername(usuario_medico);

            if (!medico || !secretaria)
                return;

            secretaria.agregarMedico(medico);
            StorageManager.guardarDatos(
                this._medicos,
                this._secretarias
            );

            alert("Cuentas vinculadas exitosamente");

            Interfaz.onClick.cerrar_popup_asignacion();

        };
    }
}