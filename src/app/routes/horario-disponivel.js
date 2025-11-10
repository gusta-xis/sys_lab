const express = require('express');
const router = express.Router();
const db = require('../db');


router.post('/save', (req, res) => {
    if (Array.isArray(req.body)) {
        const horarios = req.body;
        const values = horarios.map(h => [h.dia_semana, h.hora_inicio, h.hora_fim]);
        const query = 'INSERT INTO horario_disponivel (dia_semana, hora_inicio, hora_fim) VALUES ?';

        db.query(query, [values], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao cadastrar múltiplos registros' });
            }
            res.status(201).json({
                message: `${result.affectedRows} horarios cadastrados com sucesso`
            });
        });
    }

    const { dia_semana, hora_inicio, hora_fim } = req.body;
    const query = 'INSERT INTO horario_disponivel (dia_semana, hora_inicio, hora_fim) VALUES (?, ?, ?)';
    db.query(query, [dia_semana, hora_inicio, hora_fim], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao cadastrar horario' });
        res.status(201).json({ message: 'Horario cadastrado com sucesso', userId: result.insertId });
    });
});

router.get('/findAll', (req, res) => {
    const query = 'SELECT * FROM horario_disponivel';

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar horarios' });
        res.status(200).json(results);
    });
});

router.get('/findById/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM horario_disponivel WHERE id_horario_disponivel = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar horario' });
        if (results.length === 0) return res.status(404).json({ message: 'Horario não encontrado' });
        res.status(200).json(results[0]);
    });
});

router.delete('/deleteById/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM horario_disponivel WHERE id_horario_disponivel = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao deletar horario' });
        res.status(200).json({ message: 'Horario deletado com sucesso' });
    });
});

router.put('/updateById/:id', (req, res) => {
    const { id } = req.params;
    const { dia_semana, hora_inicio, hora_fim } = req.body;
    const query = 'UPDATE horario_disponivel set dia_semana = ?, hora_inicio = ?, hora_fim = ? WHERE id_horario_disponivel = ?';
    db.query(query, [dia_semana, hora_inicio, hora_fim, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar horario' });
        res.status(200).json({ message: 'Horario atualizado com sucesso' });
    });
});

router.patch('/updatePartial/:id', (req, res) => {
    const {id} = req.params;
    const fields = [];
    const values = [];
    for (const key in req.body) {
        fields.push(`${key} = ?`);
        values.push(req.body[key]);
    };

    const query = `UPDATE horario_disponivel SET ${fields.join(', ')} WHERE id_horario_disponivel = ?`;
    values.push(id);
    db.query(query, values, (err, result) => {
        if (err) return res.status(500).json({error: 'Erro ao atualizar horario'});
        res.status(200).json({ message: 'Horario atualizado com sucesso'});
    });
});

module.exports = router;