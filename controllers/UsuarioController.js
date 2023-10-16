const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt')

// helpers
const createUserToken = require('../helpers/create-user-token')

module.exports = class UsuarioControllers{
    
    static verificarUsuarioLogado(req,res){
        res.json(req.usuario)
    }

    static async adicionarUsuario(req,res){
        const id = req.body.id
        const nome = req.body.nome
        const senha = req.body.senha
        const tipo = req.body.tipo

        if(!id){
            return res.status(404).json({message: 'informe o usuario'})
        }
        if(!nome){
            return res.status(404).json({message: 'informe o nome'})
        }
        if(!senha){
            return res.status(404).json({message: 'informe a senha'})
        }
        if(!tipo || tipo == 0){
            return res.status(404).json({message: 'informe o tipo'})
        }

        const usuarioExistente = await Usuario.findById(id).lean()

        if(usuarioExistente){
            return res.status(500).json({message: 'ja existe um usuario com essa id'})
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
        }catch(error){
            return res.status(400).json({message: error})
        }
    }

    static async logarUsuario(req,res){
        const id = req.body.id
        const senha = req.body.senha

        if(!id){
            res.status(422).json({message: 'digite o id de usuario'})
            return
        }

        if(!senha){
            res.status(422).json({message: 'digite a senha'})
            return
        }

        const usuarioExistente = await Usuario.findOne({_id: id}).lean()

        if(usuarioExistente){
            
            const verificarSenha = bcrypt.compareSync(senha, usuarioExistente.senha)

            if(verificarSenha){
                await createUserToken(usuarioExistente,req,res)
                return
            } else {
                res.status(422).json({message: 'senha incorreta'})
                return
            }

        } else{
            res.status(422).json({message: 'id não encontrado'})
            return
        }
    }

    static async consultarUsuario(req,res){
        const id = req.params.id

        const usuarioExistente = await Usuario.findById(id).select('-senha')

        if(usuarioExistente){
            res.json(usuarioExistente)
            return
        } else{
            res.json({message: 'usuario não encontrado'})
            return
        }
    }

    static async consultarTodosUsuarios(req,res){
        const todosUsuarios = await Usuario.find().select('-senha')

        if(todosUsuarios){
            res.json(todosUsuarios)
            return
        } else{
            res.json({message: 'sem usuarios cadastrados'})
            return
        }
    }

    static async editarUsuario(req,res){
        const id = req.params.id
        const nome = req.body.nome
        const tipo = req.body.tipo

        const usuarioAtualizado = {nome,tipo}

        try{
            const objUsuario = await Usuario.findOneAndUpdate(
                { _id: id },
                { $set: usuarioAtualizado },
                { new: true },
                )
            if(objUsuario){
                res.json({message: 'usuario atualizado'})
                return
            } else{
                res.status(200).json({objUsuario})
                return
            }

        } catch(erro){
            res.status(500).json({message: erro})
            return
        }
    }
  
    static async criarUsuarioInicial(req,res){

        const senha = '123'

        const salt = bcrypt.genSaltSync(10)
        const hashSenha = bcrypt.hashSync(senha,salt)

        const objUsuario = new Usuario({
            _id: '1000',
            nome: 'admin',
            senha: hashSenha,
            tipo: 1,
        })

        try{
            await objUsuario.save()
            res.json({message: 'usuario inicial adicionado'})
        } catch(erro){
            res.json(erro)
        }
    }

}