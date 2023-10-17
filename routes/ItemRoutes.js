const express = require('express')
const router = express.Router()
const ItemController = require('../controllers/ItemController')

// helpers
const verificarToken = require('../helpers/verify-token')
const apenasAdministrador = require('../helpers/acesso-apenas-administrador')

router.post('/', ItemController.adicionarItem)


module.exports = router