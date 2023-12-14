const express = require('express')
const router = express.Router()
const PagamentoControllers = require('../controllers/PagamentoController')

// helpers
const verificarToken = require('../helpers/verify-token')
const apenasAdministrador = require('../helpers/acesso-apenas-administrador')

router.post('/',verificarToken,PagamentoControllers.receberPagamento)

module.exports = router