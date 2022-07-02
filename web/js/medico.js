class Medico extends Persona {

    clase = "Medico";

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

    getTurnos() {
        /* slice sin argumentos retorna una copia del array */
        return this._turnos.slice();
    }

    eliminarTurno(turno) {

        let eliminado = false;
        let i = 0;

        while (i < this._turnos.length && !eliminado) {
            if (this._turnos[i].equals(turno)) {

                /* splice elimina el turno en esa
                   posicion y hace un corrimiento
                   para que no queden vacios.
                   (manteniendo el orden) */
                this._turnos.splice(i, 1);
                eliminado = true;
            }
            i++;
        }
    }

    agregarTurno(turno) {

        let posicion_encontrada = false;
        let i = 0;

        while (i < this._turnos.length && !posicion_encontrada)
            if (turno.esAnterior(this._turnos[i]))
                posicion_encontrada = true;
            else
                i++;

        // insertarlo en la posicion i
        this._turnos.splice(i, 0, turno);
    }

    eliminarTurnosViejos() {

        const ahora = new Turno(Date.now());

        let turno_pendiente_encontrado = false;
        let i = 0;

        while (!turno_pendiente_encontrado && i < this._turnos.length) {

            if (!this._turnos[i].esAnterior(ahora))
                turno_pendiente_encontrado = true;
            else
                i++;
        }

        // guardar solo los turnos pendientes
        this._turnos = this._turnos.slice(i);
    }

    cantidadTurnos() {
        return this._turnos.length;
    }

    turnoLibre(turno) {
        for (let i = 0; i < this._turnos.length; i++)
            if (this._turnos[i].getTimestamp() == turno.getTimestamp())
                return false;
        return true;
    }

    getTurnosDisponibles() {

        let generador = Turno.proximoPosible();
        let turnos_libres = [];

        for (let i = 0; i < 40; i++) {
            if (this.turnoLibre(generador))
                turnos_libres.push(generador.getCopia());
            generador.posponerHoras(1);
        }

        return turnos_libres;
    }

    reagendarTurno(turno_viejo, turno_nuevo) {
        if (this.turnoLibre(turno_nuevo)) {
            turno_nuevo.setPaciente(turno_viejo.getPaciente());
            this.eliminarTurno(turno_viejo);
            this.agregarTurno(turno_nuevo);
        }
        else
            console.log("El turno ya esta ocupado!");
    }
}