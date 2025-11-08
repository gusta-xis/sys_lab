const express = require('express');
const router = express.Router();

const usuarioRoutes = require('./usuario');
router.use('/usuario', usuarioRoutes);

const horaFuncionamentoRoutes = require('./horaFuncionamento');
router.use('/horaFuncionamento', usuarioRoutes);

module.exports = router;