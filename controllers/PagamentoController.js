const Pagamento = require('../models/Pagamento')
const Venda = require('../models/Venda')

module.exports = class PagamentoControllers{

    static async receberPagamento(req,res){
        let idMesa = req.body.idMesa
        idMesa = parseInt(idMesa)

        const objVenda = await Venda.findById(idMesa)

        if(objVenda.situacao != 'fechado'){
            return res.status(500).json({message: 'Ocorreu um erro'})
        }


    }

    
}