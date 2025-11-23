const express = require('express');
const router = express.Router();
const salaService = require('../services/salaServices');

router.post('/save', (req, res) => {
  salaService.salvarSala(req.body, (err, result) => {
    if (err) {
      return res.status(err.status || 500).json({ sucesso: false, erro: err.erro || 'Erro ao salvar sala' });
    }
    const response = Array.isArray(req.body)
      ? { inserted: result.affectedRows }
      : { id_sala: result.insertId };
    res.status(201).json({ sucesso: true, data: response });
  });
});

router.get('/findAll', (req, res) => {
  salaService.buscarTodos((err, rows) => {
    if (err) {
      return res.status(500).json({ sucesso: false, erro: 'Erro ao buscar' });
    }
    res.json({ sucesso: true, data: rows });
  });
});

router.get('/findById/:id', (req, res) => {
  salaService.buscarPorId(req.params.id, (err, row) => {
    if (err) {
      return res.status(404).json({ sucesso: false, erro: 'Erro ao buscar' });
    }
    if (!row) return res.status(404).json({ sucesso: false, erro: 'Sala não encontrada' });
    res.json({ sucesso: true, data: row });
  });
});

router.delete('/deleteById/:id', (req, res) => {
  salaService.deleteSala(req.params.id, (err, result) => {
    if (err) {
      return res.status(500).json({ sucesso: false, erro: 'Erro ao excluir' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ sucesso: false, erro: 'Sala não encontrada' });
    res.json({ sucesso: true, data: { updated: result.affectedRows } });
  });
});

router.put('/updateById/:id', (req, res) => {
  salaService.atualizarSala(req.params.id, req.body, (err, result) => {
    if (err) {
      return res.status(err.status || 500).json({ sucesso: false, erro: err.erro || 'Erro ao atualizar a sala' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ sucesso: false, erro: 'Sala não encontrada' });
    res.json({ sucesso: true, data: { updated: result.affectedRows } });
  });
});

router.patch('/updatePartial/:id', (req, res) => {
  salaService.atualizarParcial(req.params.id, req.body, (err, result) => {
    if (err) {
      return res.status(err.status || 500).json({ sucesso: false, erro: err.erro || 'Erro ao atualizar a sala' });
    }
    if (result.affectedRows === 0) return res.status(404).json({ sucesso: false, erro: 'Sala não encontrada' });
    res.json({ sucesso: true, data: { updated: result.affectedRows } });
  });
});

router.get('/disponiveis', (req, res) => {
  const { data_reserva, fk_horario } = req.query;

  if (!data_reserva) {
    return res.status(400).json({ sucesso: false, erro: "Informe a data_reserva" });
  }

  salaService.buscarDisponiveis(data_reserva, fk_horario, (err, rows) => {
    if (err) {
      return res.status(500).json({ sucesso: false, erro: 'Erro ao buscar salas disponíveis' });
    }
    res.json({ sucesso: true, data: rows });
  });
});

module.exports = router;