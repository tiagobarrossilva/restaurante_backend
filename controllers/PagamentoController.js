const Pagamento = require('../models/Pagamento')
const Venda = require('../models/Venda')
const Usuario = require('../models/Usuario')

module.exports = class PagamentoControllers{

    static async receberPagamento(req,res){
        let idMesa = req.body.mesa
        idMesa = parseInt(idMesa)
        let idOperadorCaixa
        let objVenda
        let operadorCaixa

        try{
            idOperadorCaixa = req.usuario.id
            objVenda = await Venda.findById(idMesa)
            operadorCaixa = await Usuario.findById(idOperadorCaixa).lean().select('-senha').select('-createdAt').select('-updatedAt').select('-__v')
        } catch(erro){
            return res.status(500).json({message: erro})
        }

        if(!objVenda || !operadorCaixa){
            return res.status(500).json({message: 'erro'})
        }

        if(operadorCaixa.tipo != 3 || objVenda.situacao != 'fechada'){
            return res.status(500).json({message: 'erro'})
        }

        let preco = 0
        for(let i in objVenda.pedidos){
            preco = (objVenda.pedidos[i].preco * objVenda.pedidos[i].quantidade) + preco
        }

        const objPagamento = new Pagamento({
            data: new Date(),
            caixa: idOperadorCaixa,
            mesa: parseInt(idMesa),
            valor: parseFloat(preco),
            venda: objVenda
        })

        console.log(objPagamento)

        try{
            await objPagamento.save()
            await Venda.findByIdAndDelete(idMesa)
        } catch(erro){
            return res.status(500).json({message: erro})
        }

        return res.status(200).json({message: 'Pagamento realizado'})
    }

    
}