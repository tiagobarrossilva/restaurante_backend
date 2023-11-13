const Item = require('../models/Item')

module.exports = class ItemControllers{

    static async adicionarItem(req,res){
        const id = req.body.id
        const nome = req.body.nome
        const descricao = req.body.descricao
        const preco = req.body.preco
        const tipo = req.body.tipo

        if(!id){
            return res.status(404).json({message: 'informe o codigo do produto'})
        }
        if(!nome){
            return res.status(404).json({message: 'informe o nome'})
        }
        if(!descricao){
            return res.status(404).json({message: 'informe a descricao'})
        }
        if(!preco || preco == 0 ){
            return res.status(404).json({message: 'informe o preco'})
        }
        if(!tipo || tipo == 0){
            return res.status(404).json({message: 'informe o tipo'})
        }

        if(Number.isNaN(preco)){
            return res.status(404).json({message: 'preço invalido'})
        }

        if(Number.isNaN(tipo)){
            return res.status(404).json({message: 'tipo invalido'})
        }

        const itemExistente = await Item.findById(id).lean()

        if(itemExistente){
            return res.status(404).json({message: 'Já existe um item com esse número, escolha outro'})
        }

        const precoVerificado = parseFloat(preco)
        const tipoVerificado = parseInt(tipo)

        const objItem = new Item({
            _id: id,
            nome: nome,
            descricao: descricao,
            preco: precoVerificado,
            tipo: tipoVerificado,
        })

        try{
            await objItem.save()
            return res.status(200).json({message: 'Item adicionado ao cardapio'})
        } catch(error){
            return res.status(400).json({message: error})
        }
    }

    static async consultarItens(req,res){
        try{
            const itens = await Item.find().lean().select('-createdAt').select('-updatedAt').select('-__v')
            return res.status(200).json({itens})
        } catch(error){
            return res.status(400).json({message: error})
        }
    }

    static async excluirItem(req,res){
        let id = req.params.id
        id = parseInt(id)

        if(isNaN(id)){
            return res.status(400).json({message: 'Item invalido'})
        }

        try{
            const itemExcluido = await Item.findByIdAndDelete({_id: id})
            if(itemExcluido){
                return res.status(200).json({message: 'Item removido do cardapio'})
            } else{
                return res.status(400).json({message: 'Ocorreu um erro ao remover o item'})
            }
            
        } catch(error){
            return res.status(400).json({message: error})
        }
    }

    static async editarItem(req,res){
        const id = req.params.id
        const nome = req.body.nome
        const descricao = req.body.descricao
        const preco = req.body.preco
        const tipo = req.body.tipo

        if(!id){
            return res.status(404).json({message: 'Codigo do item não informado'})
        }
        if(!nome){
            return res.status(404).json({message: 'Informe o nome'})
        }
        if(!descricao){
            return res.status(404).json({message: 'Informe a descrição'})
        }
        if(!preco){
            return res.status(404).json({message: 'Informe o preço'})
        }
        if(!tipo){
            return res.status(404).json({message: 'Informe o tipo'})
        }

        const idVerificado = parseInt(id)
        const precoVerificado = parseFloat(preco)
        const tipoVerificado = parseInt(tipo)

        if(Number.isNaN(idVerificado)){
            return res.status(404).json({message: 'id invalido'})
        }
        if(Number.isNaN(precoVerificado)){
            return res.status(404).json({message: 'preço invalido'})
        }
        if(Number.isNaN(tipoVerificado)){
            return res.status(404).json({message: 'preço invalido'})
        }
        if(tipoVerificado <=0 || tipoVerificado >4){
            return res.status(404).json({message: 'preço invalido'})
        }

        const itemAtualizacoes = {
            nome,
            descricao,
            preco: precoVerificado,
            tipo: tipoVerificado
        }
        
        try{
            const item = await Item.findByIdAndUpdate(id, itemAtualizacoes)
            if(item){
                return res.status(200).json({message: 'Item atualizado'})
            } else{
                return res.status(200).json({message: 'erro ao atualizar o item'})
            }
        } catch(erro){
            return res.status(200).json({message: erro})
        }
    }
    
}