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
}