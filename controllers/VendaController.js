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

    static async vendaFechada(req,res){
        let mesa = req.params.mesa
        mesa = parseInt(mesa)

        let venda

        try{
            venda = await Venda.findById(mesa).select('-createdAt').select('-updatedAt').select('-__v')            
        } catch(erro){
            return res.status(500).json({message: erro})
        }

        if(!venda){
            return res.status(500).json({message: 'Venda não encontrada'})
        }

        if(venda.situacao != 'fechada'){
            return res.status(500).json({message: 'A venda ainda não foi finalizada'})
        }

        let precoTotal = 0
        for(let i in venda.pedidos){
            precoTotal = (venda.pedidos[i].preco * venda.pedidos[i].quantidade) + precoTotal
        }

        const objVenda = {
            _id: venda._id,
            abertura: venda.abertura,
            fechamento: venda.fechamento,
            precoTotal: precoTotal,
            pedido: venda.pedidos
        }

        venda = objVenda

        return res.status(200).json({venda})
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

    static async agurdandoPreparo(req,res){
        let lista = []
        let pedidos = []
        try{
            let vendasAbertas = await Venda.find({'situacao': 'aberta'}).lean().select('-createdAt').select('-updatedAt').select('-__v')
            for(let i in vendasAbertas){
                for(let i2 in vendasAbertas[i].pedidos){
                    if(vendasAbertas[i].pedidos[i2].preparado == false){
                        lista.push(vendasAbertas[i].pedidos[i2])
                    }
                }
                const pedido = {
                    mesa: vendasAbertas[i]._id,
                    pedidos: lista 
                }
                pedidos.push(pedido)
                lista = []
            }
            return res.status(200).json({pedidos})
        } catch(erro){
            return res.status(500).json({message: erro})
        }
    }

    static async confirmarPreparo(req,res){
        let {idMesa,idItem,quantidade} = req.params
        idMesa = parseInt(idMesa)
        idItem = parseInt(idItem)
        quantidade = parseInt(quantidade)
        
        let venda

        try{
            venda = await Venda.findById(idMesa)
        } catch(erro){
            return res.status(500).json({message: erro})
        }

        let itemAtualizado = false
        let notificacaoNome
        let notificacaoQuantidade

        for(let i in venda.pedidos){
            if(venda.pedidos[i]._id == idItem && venda.pedidos[i].quantidade == quantidade && venda.pedidos[i].preparado == false){
                venda.pedidos[i].preparado = true
                itemAtualizado = true
                notificacaoNome = venda.pedidos[i].nome
                notificacaoQuantidade = venda.pedidos[i].quantidade
                break
            }
        }

        if(!itemAtualizado){
            return res.status(500).json({message: 'Ocorreu um erro'})
        }

        try{
            await Venda.findByIdAndUpdate(idMesa,venda)
            return res.status(200).json({message: 'preparado: '+notificacaoNome+' , '+' Quantidade:'+notificacaoQuantidade})

        } catch(erro){
            return res.status(500).json({message: erro})
        }
    }

    static async reabrirVenda(req,res){
        let idMesa = req.params.idMesa
        idMesa = parseInt(idMesa)
        let objVenda
        try{
            objVenda = await Venda.findById(idMesa)
        } catch(erro){
            return res.status(500).json({message: erro})
        }
        console.log(objVenda)
        console.log('testando')
        if(objVenda.situacao == 'fechada'){
            objVenda.situacao = 'aberta'
            try{
                await Venda.findByIdAndUpdate(idMesa,objVenda)
                return res.status(200).json({message: 'Venda reaberta'})
            } catch(erro){
                return res.status(500).json({message: erro})
            }
        } else{
            return res.status(500).json({message: 'Ocorreu um erro'})
        }
    }

}