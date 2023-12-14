const express = require('express')
const router = express.Router()
const UsuarioController = require('../controllers/UsuarioController')

// helpers
const verificarToken = require('../helpers/verify-token')
const apenasAdministrador = require('../helpers/acesso-apenas-administrador')

router.get('/novo',verificarToken,apenasAdministrador,UsuarioController.usuarioInicial)
router.post('/logar', UsuarioController.logarUsuario)
router.patch('/:id',verificarToken,apenasAdministrador,UsuarioController.editarUsuario)
router.delete('/:id',verificarToken,apenasAdministrador, UsuarioController.excluirUsuario)
router.post('/',verificarToken,apenasAdministrador, UsuarioController.adicionarUsuario)
router.get('/',verificarToken, UsuarioController.consultarTodosUsuarios)

module.exports = router