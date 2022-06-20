/*
function comprobarCredenciales(usuario, contrasena) {


}*/

/*
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
}*/

class TurnoFacil {

    constructor() {
        this._pacientes = [];
        this._medicos = [];
        this._secretarias = [];
        this._medico_actual = null;
    }

    generarPacientesRandom() {

        this._pacientes = [];

        for (let i = 0; i < 100; i++) {
            const paciente = new Persona(
                enteroRandom(10000000, 50000000),
                dataset_nombres[enteroRandom(0, dataset_nombres.length-1)]
            );
            this._pacientes.push(paciente);
        }
    }

    pacienteRandom() {
        return this._pacientes[enteroRandom(0, this._pacientes.length-1)];
    }

    generarTurnosRandom(medico) {

        let generador;

        if (medico.cantidadTurnos() > 0)
            generador = medico.getTurnos()[medico.cantidadTurnos()-1];
        else
            generador = Turno.proximoPosible();

        for (let i = medico.cantidadTurnos(); i < enteroRandom(30, 45); i++) {

            generador.posponerHoras(1);
            generador.setPaciente(this.pacienteRandom());

            // 5% de chance de "dejar un hueco" en los turnos
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

        return resultado;
    }

    inicializar() {

        this._pacientes = StorageManager.cargarListaObjetos("pacientes");

        if (!this._pacientes) {
            this.generarPacientesRandom();
            console.log("Pacientes generados");
            StorageManager.guardarListaObjetos("pacientes", this._pacientes);
        } else
            console.log("Pacientes cargados del local storage");

        this._medicos = StorageManager.cargarListaObjetos("medicos");
        if (!this._medicos) {
            this.setMedicosDefault();
            StorageManager.guardarListaObjetos("medicos", this._medicos);
        } else
            console.log("Medicos cargados del local storage");
        
        this._secretarias = StorageManager.cargarListaObjetos("secretarias");
        if (!this._secretarias) {
            this.setSecretariasDefault();
            StorageManager.guardarListaObjetos("secretarias", this._secretarias);
        } else
        {
            console.log("Secretarias cargadas del local storage");
        }
        
        // Vincular dni de los medicos con los objetos Medico
        for (const secretaria of this._secretarias)
            secretaria.vincularMedicos(this._medicos);
        
        for (const medico of this._medicos) {
            medico.eliminarTurnosViejos();
            this.generarTurnosRandom(medico);
        }

        StorageManager.guardarDatos(
            this._pacientes,
            this._medicos,
            this._secretarias
        );

        // Cargar la interfaz

        Interfaz.mostrarLogin();

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
            
        };

        Interfaz.onClick.cancelar_turno = (medico, turno) => {
            medico.eliminarTurno(turno);

            StorageManager.guardarDatos(
                this._pacientes,
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
        }

        Interfaz.onClick.medico_seleccionado = (medico) => {
            Interfaz.ocultarSeleccionMedico();
            Interfaz.setTurnos(medico);
            Interfaz.mostrarBotonAgendar();
            Interfaz.mostrarTurnos();
            this._medico_actual = medico;
        },

        Interfaz.onClick.confirmar_agenda = (medico, turno) => {

            let nombrePaciente = document.getElementById("datos-paciente-nombre").value;
            let dniPaciente = Number(document.getElementById("datos-paciente-dni").value);
    
            // Ver si ya existe el dni (guardar en turno.paciente)

            turno.setPaciente(new Persona(
                dniPaciente,
                nombrePaciente
            ));

            this._pacientes.push(new Persona(dniPaciente, nombrePaciente));
            StorageManager.guardarListaObjetos("pacientes", this._pacientes);
    
            medico.agregarTurno(turno);
            StorageManager.guardarListaObjetos("medicos", this._medicos);
    
            Interfaz.setTurnos(medico);
            Interfaz.ocultarTurnosDisponiblesPopUp();
        };

        Interfaz.onClick.agendar_turno = () => {
            Interfaz.agregarTurnosDisponibles(this._medico_actual, null, "agenda");
            Interfaz.mostrarPacienteForm();
            Interfaz.mostrarTurnosDisponiblesPopUp();
        }

        Interfaz.onClick.confirmar_reagenda = (medico, turno_seleccionado, turno_nuevo) => {
    
            medico.reagendarTurno(turno_seleccionado, turno_nuevo);

            Interfaz.setTurnos(medico);
            Interfaz.ocultarTurnosDisponiblesPopUp();
        };

    }

}