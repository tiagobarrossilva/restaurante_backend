const Venda = require('../models/Venda')

module.exports = class VendaControllers{

    static async abrirVenda(req,res){
        const mesa = req.body.mesa
        
        if(!mesa){
            return res.status(404).json({message: 'mesa não informada'})
        }

        const mesaInt = Number.parseInt(mesa)

        if(Number.isNaN(mesaInt)){
            return res.status(404).json({message: 'ocorreu um erro'})
        }

        const vendaExistente = await Venda.findById(mesaInt)

        if(vendaExistente){
            return res.status(500).json({message: 'ja existe uma venda aberta para a mesa informada'})
        }

        const objVenda = new Venda({
            _id: mesaInt,
            situacao: 'aberta',
            abertura: new Date(),
            fechamento: null
        })

        try{
            await objVenda.save()
            return res.status(200).json({message: 'Venda aberta'})
        } catch(erro){
            return res.status(400).json({message: erro})
        }
    }

    static async vendasAbertas(req,res){
        try{
            const vendas = await Venda.find({situacao: 'aberta'}).select('-createdAt').select('-updatedAt').select('-__v')
            return res.status(200).json({vendas})
        } catch(erro){
            return res.status(400).json({message: erro})
        }
    }

    static async fecharVenda(req,res){
        const mesa = req.body.mesa

        if(!mesa){
            return res.status(404).json({message: 'mesa não informada'})
        }

        const mesaInt = parseInt(mesa)

        if(Number.isNaN(mesaInt)){
            return res.status(404).json({message: 'ocorreu um erro'})
        }

        const vendaExistente = await Venda.findById(mesaInt)

        if(!vendaExistente){
            return res.status(404).json({message: 'venda não encontrada'})
        }

        if(vendaExistente.situacao == 'fechada'){
            return res.status(500).json({message: 'A venda ja estava fechada'})
        }

        vendaExistente.situacao = 'fechada'

        if(vendaExistente.pedidos.length == 0){
            try{
                await Venda.findByIdAndDelete(mesaInt)
                return res.status(200).json({message: 'A venda foi cancelada por que não possui itens'})
            } catch(erro){
                return res.status(500).json({message: erro})
            }
        }

        try{
            const venda = await Venda.findByIdAndUpdate(mesa,vendaExistente)
            if(venda){
                //return res.status(200).json('Venda fechada')
                return res.status(200).json({message: 'Venda fechada'})
            } else{
                return res.status(500).json({message: 'Ocoreu um erro'})
            }
        } catch(erro){
            return res.status(500).json({message: erro})
        }
    }

    static async vendasFechadas(req,res){
        try{
            const vendas = await Venda.find({situacao: 'fechada'}).select('-createdAt').select('-updatedAt').select('-__v')
            return res.status(200).json({vendas})
        } catch(erro){
            return res.status(500).json({message: erro})
        }
    }

    static async adicionarItemVenda(req,res){
        const mesa = req.body.mesa
        const itens = req.body.itens

        if(!mesa){
            return res.status(404).json({message: 'mesa não informada'})
        }
        if(!itens){
            return res.status(404).json({message: 'mesa não informada'})
        }

        // receber um array com as ids de cada item, procurar no banco pelas ids e adicionar em
        // um array os itens encontrados no banco, depois fazer a atualização usando os itens encontrados


        const mesaInt = parseInt(mesa)

        if(Number.isNaN(mesaInt)){
            return res.status(404).json({message: 'ocorreu um erro'})
        }
    }
}