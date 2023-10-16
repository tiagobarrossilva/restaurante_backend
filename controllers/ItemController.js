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

        const precoVerificado = parseFloat(preco)
        const tipoVerificado = parseInt(tipo)

        if(Number.isNaN(precoVerificado || Number.isNaN(tipoVerificado))){
            return res.status(404).json({message: 'ocorreu um erro, verifique os campos digitados'})
        }

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
}