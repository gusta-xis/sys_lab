const db = require('../db');

function salvarSala(sala, callback) {
  const { nome, capacidade, status } = sala;
  const querySave = 'INSERT INTO sala (nome, capacidade, status) VALUES (?, ?, ?)';
  db.query(querySave, [nome, capacidade, status || 'DISPONIVEL'], callback);
}

function salvarSalasEmLote(lista, callback) {
  const querySave = 'INSERT INTO sala (nome, capacidade, status) VALUES ?';
  db.query(querySave, [lista], callback);
}

function buscarTodos(callback) {
  const queryFindAll = 'SELECT * FROM sala ORDER BY id_sala ASC';
  db.query(queryFindAll, callback);
}

function buscarPorId(id, callback) {
  const queryFindById = 'SELECT * FROM sala WHERE id_sala = ?';
  db.query(queryFindById, [id], callback);
}

function atualizarSala(id, sala, callback) {
  const { nome, capacidade, status } = sala;
  const queryUpdate = 'UPDATE sala SET nome = ?, capacidade = ?, status = ? WHERE id_sala = ?';
  db.query(queryUpdate, [nome, capacidade, status, id], callback);
}

function atualizarParcial(id, camposSQL, valores, callback) {
  db.query(`UPDATE sala SET ${camposSQL} WHERE id_sala = ?`, [...valores, id], callback);
}

function deleteSala(id, callback) {
  const queryDelete = 'DELETE FROM sala WHERE id_sala = ?';
  db.query(queryDelete, [id], callback);
}

function buscarDisponiveis(data_reserva, fk_horario, callback) {
  const temHorario = fk_horario && fk_horario !== "0" && fk_horario !== "";

  if (temHorario) {
    const sql = `
      SELECT s.*, ? as fk_horario 
      FROM sala s
      WHERE s.id_sala NOT IN (
          SELECT r.fk_sala
          FROM reserva r
          WHERE r.data_reserva = ? 
            AND r.fk_horario = ? 
            AND r.status = 'CONFIRMADA'
      )
      ORDER BY s.nome ASC;
    `;
    db.query(sql, [fk_horario, data_reserva, fk_horario], callback);
  } else {
    const sql = `
      SELECT s.id_sala, s.nome, s.capacidade, s.status, turnos.id as fk_horario
      FROM sala s
      CROSS JOIN (
          SELECT 1 as id UNION SELECT 2 UNION SELECT 3
      ) as turnos
      WHERE NOT EXISTS (
          SELECT 1 
          FROM reserva r 
          WHERE r.fk_sala = s.id_sala 
            AND r.fk_horario = turnos.id 
            AND r.data_reserva = ?
            AND r.status = 'CONFIRMADA'
      )
      ORDER BY s.nome ASC, turnos.id ASC;
    `;
    db.query(sql, [data_reserva], callback);
  }
}

module.exports = {
  salvarSala,
  salvarSalasEmLote,
  buscarTodos,
  buscarPorId,
  atualizarSala,
  atualizarParcial,
  deleteSala,
  buscarDisponiveis
};