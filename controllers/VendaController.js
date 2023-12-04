const Venda = require('../models/Venda')
const Item = require('../models/Item')

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
        let mesa = req.body.mesa
        mesa = parseInt(mesa)

        if(!mesa || isNaN(mesa)){
            return res.status(500).json({message: 'Ocorreu um erro'})
        }

        let vendaExistente

        try{
            vendaExistente = await Venda.findById(mesa)
        } catch(erro){
            return res.status(500).json({message: erro})
        }
        
        if(!vendaExistente || vendaExistente.situacao == 'fechada'){
            return res.status(404).json({message: 'Ocorreu um erro'})
        }

        if(vendaExistente.pedidos.length == 0){
            try{
                await Venda.findByIdAndDelete(mesa)
                return res.status(200).json({message: 'A venda foi cancelada por que não possui itens'})
            } catch(erro){
                return res.status(500).json({message: erro})
            }
        }

        for(let i in vendaExistente.pedidos){
            if(vendaExistente.pedidos[i].preparado == false){
                return res.status(404).json({message: 'Há pedido(s) sendo preparado(s)'})
            }
        }

        vendaExistente.situacao = 'fechada'
        vendaExistente.fechamento = new Date()

        try{
            await Venda.findByIdAndUpdate(mesa,vendaExistente)
            return res.status(200).json({message: 'Venda fechada'})
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
        let mesa = req.params.mesa
        mesa = mesa.toString()
        const itens = req.body.pedido
        let objVenda

        try{
            objVenda = await Venda.findById(mesa)
            if(!objVenda){
                return res.status(404).json({message: 'mesa não encontrada'})
            }
        } catch(erro){
            return res.status(404).json({message: erro})
        }
       
        try{
            for(let i in itens){
                const objItem = await Item.findById(itens[i].id).lean().select('-createdAt').select('-updatedAt').select('-__v')
                if(objItem){
                    const quantidade = itens[i].quantidade
                    const item = {
                        _id: objItem._id,
                        nome: objItem.nome,
                        descricao: objItem.descricao,
                        preco: objItem.preco,
                        tipo: objItem.tipo,
                        quantidade,
                        preparado: false
                    }
                    objVenda.pedidos.push(item)
                }
            }
            await Venda.findByIdAndUpdate(mesa,objVenda)
            return res.status(200).json({message: 'Pedido realizado para mesa '+mesa})
        } catch(erro){
            return res.status(500).json({message: erro})
        }
    }

    static async detalhesVenda(req,res){
        let mesa = req.params.mesa
        mesa = mesa.toString()
        let vendas
        try{
            vendas = await Venda.findById(mesa).lean().select('-createdAt').select('-updatedAt').select('-__v')
            return res.status(200).json({vendas})
        } catch(erro){
            return res.status(404).json({message: erro})
        }
    }
}