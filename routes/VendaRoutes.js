const express = require('express')
const VendaControllers = require('../controllers/VendaController')
const router = express.Router()

router.post('/abrir',VendaControllers.abrirVenda)
router.get('/abertas',VendaControllers.vendasAbertas)

module.exports = router