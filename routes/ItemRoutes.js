const express = require('express')
const router = express.Router()
const ItemController = require('../controllers/ItemController')

// helpers
const verificarToken = require('../helpers/verify-token')
const apenasAdministrador = require('../helpers/acesso-apenas-administrador')

router.post('/',verificarToken,apenasAdministrador, ItemController.adicionarItem)
router.get('/',verificarToken,ItemController.consultarItens)
router.delete('/:id',verificarToken,apenasAdministrador,ItemController.excluirItem)
router.patch('/:id',verificarToken,apenasAdministrador,ItemController.editarItem)

module.exports = router