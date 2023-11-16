const express = require('express')
const router = express.Router()
const UsuarioController = require('../controllers/UsuarioController')

// helpers
const verificarToken = require('../helpers/verify-token')
const apenasAdministrador = require('../helpers/acesso-apenas-administrador')

router.get('/novo',UsuarioController.usuarioInicial)
router.post('/logar', UsuarioController.logarUsuario)
router.patch('/:id',UsuarioController.editarUsuario)
router.delete('/:id', UsuarioController.excluirUsuario)
router.post('/', UsuarioController.adicionarUsuario)
router.get('/', UsuarioController.consultarTodosUsuarios)


//router.get('/consultar/:id', UsuarioController.consultarUsuario)

//router.patch('/editar/:id', UsuarioController.editarUsuario)
//router.get('/verificarUsuarioLogado', UsuarioController.verificarUsuarioLogado)

module.exports = router