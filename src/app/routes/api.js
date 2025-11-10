const express = require('express');
const router = express.Router();

const usuarioRoutes = require('./usuario');
router.use('/usuario', usuarioRoutes);

const horarioDisponivel = require('./horario-disponivel');
router.use ('/horarioDisponivel', horarioDisponivel);

module.exports = router;