class Medico extends Persona {

    constructor(dni, nombre, usuario, contrasena) {
        super(dni, nombre);
        this._usuario = usuario;
        this._contrasena = contrasena;
        this._turnos = [];
    }

    getUsuario() {
        return this._usuario;
    }

    getContrasena() {
        return this._contrasena;
    }

    getListaTurnos() {
        /* slice sin argumentos retorna una copia del array */
        return this._turnos.slice();
    }

    setListaTurnos(lista) {
        this._turnos = lista;
    }

    agregarTurno(dni_paciente, timestamp) {
        this._turnos.push({
            dni_paciente,
            timestamp
        });
    }

    /**
     * Elimina turnos de la lista, anteriores al timestamp
     */
    eliminarTurnosAntesDe(timestamp) {
        while(this._turnos.length && this._turnos[0].timestamp < timestamp)
            this._turnos.shift();
    }

    /**
     * Genera turnos aleatorios con la lista de pacientes brindada,
     * hasta llegar a tener entre 30 y 45 turnos en tal lista.
     */
    generarTurnosRandom(listaPacientes) {

        let date = new Date();

        // Si ya habia turnos creados, seguir desde el ultimo...

        if (this._turnos.length) {
            date = new Date(this._turnos[this._turnos.length-1].timestamp);
        }

        proxTurnoDate(date);
        if (date.getHours() < DEFAULT.RANGO_HORARIO_TURNOS.MIN)
            date.setHours(DEFAULT.RANGO_HORARIO_TURNOS.MIN);

        // Para que no afecten al timestamp del turno...
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        /*
         * Generar entre 30 y 45 turnos corridos
         * (Es dificil encontrar un turno muy cercano)
         */
        for (let i = this._turnos.length; i < enteroRandom(30, 45); i++) {

            proxTurnoDate(date);

            // 5% de chance de "dejar un hueco" en los turnos
            if (Math.random() < 0.05)
                continue;

            this.agregarTurno(
                this._pacienteRandomUnico(listaPacientes),
                date.getTime()
            );
        }
    }

    /**
     * Retorna un DNI que no esté en la lista de turnos
     */
    _pacienteRandomUnico(listaPacientes) {
        while (true) {
            const dni = listaPacientes[enteroRandom(0, listaPacientes.length-1)].getDNI();
            let repetido = false;
            for (let i = 0; i < this._turnos.length; i++)
                if (this._turnos[i].dni_paciente == dni) {
                    repetido = true;
                    break;
                }

            if (repetido == false)
                return dni;
        }
    }

}