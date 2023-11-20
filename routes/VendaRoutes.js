const express = require('express')
const VendaControllers = require('../controllers/VendaController')
const router = express.Router()

router.post('/abrir',VendaControllers.abrirVenda)
router.post('/fechar',VendaControllers.fecharVenda)
router.get('/abertas',VendaControllers.vendasAbertas)
router.get('/fechadas',VendaControllers.vendasFechadas)

module.exports = router