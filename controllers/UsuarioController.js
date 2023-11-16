const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt')

// helpers
const createUserToken = require('../helpers/create-user-token')

module.exports = class UsuarioControllers{

    static async adicionarUsuario(req,res){
        const id = req.body.id
        const nome = req.body.nome
        const senha = req.body.senha
        const tipo = req.body.tipo

        if(!id){
            return res.status(404).json({message: 'Informe o usuario'})
        }
        if(!nome){
            return res.status(404).json({message: 'Informe o nome'})
        }
        if(!senha){
            return res.status(404).json({message: 'Informe a senha'})
        }
        if(!tipo || tipo == 0){
            return res.status(404).json({message: 'Informe o tipo'})
        }
        
        if(!isNaN(id)){
            return res.status(500).json({message: 'A id não pode conter apenas números'})
        }
        if(tipo < 0 || tipo > 4 || isNaN(tipo)){
            return res.status(500).json({message: 'Tipo invalido'})
        }

        try{
            const usuarioExistente = await Usuario.findById(id).lean()
            if(usuarioExistente){
                return res.status(500).json({message: 'ja existe um usuario com essa id'})
            }
        } catch(error){
            return res.status(400).json({message: error})
        }
        
        const salt = bcrypt.genSaltSync(10)
        const hashSenha = bcrypt.hashSync(senha,salt)

        const objUsuario = new Usuario({
            _id: id,
            nome: nome,
            senha: hashSenha,
            tipo: tipo,
        })

        try{
            await objUsuario.save()
            return res.status(200).json({message: 'usuario adicionado'})
        } catch(error){
            return res.status(400).json({message: error})
        }
    }

    static async logarUsuario(req,res){
        const id = req.body.id
        const senha = req.body.senha

        if(!id){
            return res.status(422).json({message: 'digite o id de usuario'})
        }
        if(!senha){
            return res.status(422).json({message: 'digite a senha'})
        }

        const usuarioExistente = await Usuario.findById(id)

        if(usuarioExistente){
            const verificarSenha = bcrypt.compareSync(senha, usuarioExistente.senha)

            if(verificarSenha){
                await createUserToken(usuarioExistente,req,res)
                return
            } else {
                return res.status(422).json({message: 'senha incorreta'})
            }

        } else{
            return res.status(422).json({message: 'id não encontrado'})
        }
    }

    static async consultarTodosUsuarios(req,res){
        try{
            const usuarios = await Usuario.find().lean().select('-senha').select('-createdAt').select('-updatedAt').select('-__v')
            return res.status(200).json({usuarios})
        } catch(erro){
            return res.status(400).json({message: erro})
        }
    }

    static async editarUsuario(req,res){
        console.log('testando')
        const id = req.params.id
        const nome = req.body.nome
        const tipo = req.body.tipo

        if(!id){
            return res.status(422).json({message: 'digite o id de usuario'})
        }
        if(!nome){
            return res.status(422).json({message: 'digite o nome do usuario'})
        }
        if(!tipo){
            return res.status(422).json({message: 'tipo não informado'})
        }
        if(tipo <=0 || tipo > 4){
            return res.status(422).json({message: 'tipo invalido'})
        }

        const usuarioAtualizado = {nome,tipo}

        try{
            const objUsuario = await Usuario.findByIdAndUpdate(id,usuarioAtualizado)
            if(objUsuario){
                return res.json({message: 'usuario atualizado'})
            } else{
                return res.status(404).json({message: 'erro ao atualizar o usuario'})
            }
        } catch(erro){
            return res.status(500).json({message: erro})
        }
    }

    static async excluirUsuario(req,res){
        const id = req.params.id
        const idVerificado = id.toString()

        try{
            const usuario = await Usuario.findByIdAndDelete(idVerificado)
            if(usuario){
                return res.status(200).json({message: 'Usuario excluido'})
            } else{
                return res.status(200).json({message: 'Usuario não encontrado'})
            }
        } catch(erro){
            return res.status(400).json({message: erro})
        }

    }
  
    static async usuarioInicial(req,res){        
        const salt = bcrypt.genSaltSync(10)
        const hashSenha = bcrypt.hashSync('123',salt)

        const objUsuario = new Usuario({
            _id: 'admin',
            nome: 'admin',
            senha: hashSenha,
            tipo: 1,
        })

        try{
            await objUsuario.save()
            return res.json({message: 'usuario inicial adicionado, id: 1 , senha: 123'})
        } catch(erro){
            return res.json({message: erro})
        }
    }
}