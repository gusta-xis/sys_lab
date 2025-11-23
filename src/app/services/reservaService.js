const reservaDAO = require('../daos/reservaDao');

function validarPayload(r, requireAll = true) {
    const { fk_usuario, fk_sala, fk_horario, data_reserva } = r;

    if (requireAll) {
        if (!fk_usuario || !fk_sala || !fk_horario || !data_reserva) {
            return { ok: false, erro: 'fk_usuario, fk_sala, fk_horario e data_reserva obrigatórios' };
        }
    }

    if (data_reserva && !/^\d{4}-\d{2}-\d{2}$/.test(data_reserva)) {
        return { ok: false, erro: 'data_reserva deve ser YYYY-MM-DD' };
    }

    return { ok: true };
}

function salvar(reserva, callback) {
    const v = validarPayload(reserva, true);
    if (!v.ok) return callback({ tipo: 'VALIDACAO', mensagem: v.erro });

    reservaDAO.salvarReserva(reserva, callback);
}

function salvarLote(lista, callback) {
    if (!Array.isArray(lista) || lista.length === 0)
        return callback({ tipo: 'VALIDACAO', mensagem: 'Lista vazia' });

    const values = [];

    for (const r of lista) {
        const v = validarPayload(r, true);
        if (!v.ok) return callback({ tipo: 'VALIDACAO', mensagem: v.erro });

        values.push([
            r.fk_usuario,
            r.fk_sala,
            r.fk_horario,
            r.data_reserva,
            r.motivo || null,
            r.status || 'CONFIRMADA'
        ]);
    }

    reservaDAO.salvarReservasEmLote(values, callback);
}

function buscarTodas(callback) {
    reservaDAO.buscarTodas(callback);
}

function buscarPorId(id, callback) {
    reservaDAO.buscarPorId(id, callback);
}

function atualizarReserva(id, reserva, callback) {
    const v = validarPayload(reserva, false);
    if (!v.ok) return callback({ tipo: 'VALIDACAO', mensagem: v.erro });

    reservaDAO.atualizarReserva(id, reserva, callback);
}

function atualizarParcial(id, campos, callback) {
    const allowed = ['fk_usuario', 'fk_sala', 'fk_horario', 'data_reserva', 'motivo', 'status'];
    const fieldsSQL = [];
    const values = [];

    for (const k of Object.keys(campos)) {
        if (!allowed.includes(k)) {
            return callback({ tipo: 'VALIDACAO', mensagem: `Campo inválido: ${k}` });
        }

        fieldsSQL.push(`${k} = ?`);
        values.push(campos[k]);
    }

    reservaDAO.atualizarParcial(id, fieldsSQL.join(', '), values, callback);
}

function deletar(id, callback) {
    reservaDAO.deletarReserva(id, callback);
}

module.exports = {
    salvar,
    salvarLote,
    buscarTodas,
    buscarPorId,
    atualizarReserva,
    atualizarParcial,
    deletar
};
