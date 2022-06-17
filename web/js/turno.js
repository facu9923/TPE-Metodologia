class Turno {

    _timestamp = null;
    _medico = null;
    _paciente = null;

    constructor(timestamp, paciente, medico) {
        this._timestamp = timestamp;
        this._medico = medico;
        this._paciente = paciente;
    }

    getTimestamp() {
        return this._timestamp;
    }

    getMedico() {
        return this._medico;
    }

    getPaciente() {
        return this._paciente;
    }

    getFechaStr() {
        return new Date(this._timestamp).toLocaleDateString();
    }

    getHoraStr() {
        return eliminarSegundos(
            new Date(this._timestamp).toLocaleTimeString()
        );
    }

    setTimestamp(timestamp) {
        this._timestamp = timestamp;
    }

    posponerHoras(horas) {
        let date = new Date(this._timestamp);
        date.setHours(date.getHours() + horas);

        if (date.getHours() > Turno.ULTIMO_TURNO) {
            date.setDate(date.getDate() + 1);
            date.setHours(Turno.PRIMER_TURNO);
        }

        this._timestamp = date.getTime();
    }

    getCopia() {
        return new Turno(this._timestamp, this._paciente, this._medico);
    }

    esAnterior(turno) {
        return this._timestamp < turno.getTimestamp();
    }

}

Turno.PRIMER_TURNO = 8;
Turno.ULTIMO_TURNO = 20;

Turno.equals = function(turno_a, turno_b) {
    return (turno_a.getTimestamp() == turno_b.getTimestamp())
            && (turno_a.getPaciente() == turno_b.getPaciente())
            && (turno_a.getMedico() == turno_b.getMedico());
}

Turno.turnosEntre = function(turno_a, turno_b) {

    let copia_turno_a = turno_a.getCopia();

    const limite = 20;
    let igualdad_encontrada = false;
    let contador = 0;

    while (igualdad_encontrada == false
           && contador < limite) {

        if (copia_turno_a.equals(turno_b))
            igualdad_encontrada = true;
        else {
            contador++;
            copia_turno_a.posponerHoras(1);
        }
    }
    return contador;
}