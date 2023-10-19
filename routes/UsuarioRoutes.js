const express = require('express')
const router = express.Router()
const UsuarioController = require('../controllers/UsuarioController')

// helpers
const verificarToken = require('../helpers/verify-token')
const apenasAdministrador = require('../helpers/acesso-apenas-administrador')

router.post('/adicionar',verificarToken, UsuarioController.adicionarUsuario)
router.post('/logar',UsuarioController.logarUsuario)
router.get('/consultar/:id',UsuarioController.consultarUsuario)
router.get('/consultar',UsuarioController.consultarTodosUsuarios)
router.patch('/editar/:id',verificarToken,apenasAdministrador, UsuarioController.editarUsuario)
router.get('/verificarUsuarioLogado',verificarToken, UsuarioController.verificarUsuarioLogado)
router.get('/criarUsuarioInicial',UsuarioController.criarUsuarioInicial)

module.exports = router
