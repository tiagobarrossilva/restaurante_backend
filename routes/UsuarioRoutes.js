const express = require('express')
const router = express.Router()
const UsuarioController = require('../controllers/UsuarioController')

// helpers
const verificarToken = require('../helpers/verify-token')
const apenasAdministrador = require('../helpers/acesso-apenas-administrador')

router.get('/novo',UsuarioController.usuarioInicial)
router.post('/logar', UsuarioController.logarUsuario)
router.post('/adicionar', UsuarioController.adicionarUsuario)

//router.get('/consultar/:id', UsuarioController.consultarUsuario)
router.get('/consultar', UsuarioController.consultarTodosUsuarios)
//router.patch('/editar/:id', UsuarioController.editarUsuario)
//router.get('/verificarUsuarioLogado', UsuarioController.verificarUsuarioLogado)

module.exports = router