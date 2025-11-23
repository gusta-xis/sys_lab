const express = require('express');
const router = express.Router();
const service = require('../services/reservaService');

router.post('/save', (req, res) => {
    service.salvar(req.body, (err, result) => {
        if (err) {
            if (err.tipo === 'VALIDACAO')
                return res.status(400).json({ sucesso: false, erro: err.mensagem });

            if (err.code === 'ER_DUP_ENTRY')
                return res.status(409).json({ sucesso: false, erro: 'Conflito de reserva' });

            console.error(err);
            return res.status(500).json({ sucesso: false, erro: 'Erro ao cadastrar reserva' });
        }

        return res.status(201).json({ sucesso: true, data: { id_reserva: result.insertId } });
    });
});


router.post('/saveAll', (req, res) => {
    service.salvarLote(req.body, (err, result) => {
        if (err) {
            if (err.tipo === 'VALIDACAO')
                return res.status(400).json({ sucesso: false, erro: err.mensagem });

            if (err.code === 'ER_DUP_ENTRY')
                return res.status(409).json({ sucesso: false, erro: 'Conflito de reserva' });

            console.error(err);
            return res.status(500).json({ sucesso: false, erro: 'Erro ao cadastrar reservas' });
        }

        return res.status(201).json({ sucesso: true, data: { inseridas: result.affectedRows } });
    });
});


router.get('/findAll', (req, res) => {
    service.buscarTodas((err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ sucesso: false, erro: 'Erro ao buscar reservas' });
        }

        res.json({ sucesso: true, data: rows });
    });
});


router.get('/findById/:id', (req, res) => {
    service.buscarPorId(req.params.id, (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ sucesso: false, erro: 'Erro ao buscar reserva' });
        }

        if (!row)
            return res.status(404).json({ sucesso: false, erro: 'Reserva não encontrada' });

        res.json({ sucesso: true, data: row });
    });
});


router.delete('/deleteById/:id', (req, res) => {
    service.deletar(req.params.id, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ sucesso: false, erro: 'Erro ao excluir reserva' });
        }

        if (result.affectedRows === 0)
            return res.status(404).json({ sucesso: false, erro: 'Reserva não encontrada' });

        res.json({ sucesso: true, data: { deleted: result.affectedRows } });
    });
});


router.put('/updateById/:id', (req, res) => {
    service.atualizar(req.params.id, req.body, (err, result) => {
        if (err) {
            if (err.tipo === 'VALIDACAO')
                return res.status(400).json({ sucesso: false, erro: err.mensagem });

            console.error(err);
            return res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar reserva' });
        }

        if (result.affectedRows === 0)
            return res.status(404).json({ sucesso: false, erro: 'Reserva não encontrada' });

        res.json({ sucesso: true, data: { updated: result.affectedRows } });
    });
});


router.patch('/updatePartial/:id', (req, res) => {
    service.atualizarParcial(req.params.id, req.body, (err, result) => {
        if (err) {
            if (err.tipo === 'VALIDACAO')
                return res.status(400).json({ sucesso: false, erro: err.mensagem });

            console.error(err);
            return res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar reserva' });
        }

        if (result.affectedRows === 0)
            return res.status(404).json({ sucesso: false, erro: 'Reserva não encontrada' });

        res.json({ sucesso: true, data: { updated: result.affectedRows } });
    });
});

module.exports = router;
