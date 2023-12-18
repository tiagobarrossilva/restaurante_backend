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

        try{
            await objPagamento.save()
            await Venda.findByIdAndDelete(idMesa)
        } catch(erro){
            return res.status(500).json({message: erro})
        }

        return res.status(200).json({message: 'Pagamento realizado'})
    }

    static async consultarPagamentos(req,res){
        let data = req.params.data

        data = data.toLocaleString()
        data = data.split('-')
        data = data[2]+'/'+data[1]+'/'+data[0]
        
        let objPagamentos
        try{
            objPagamentos = await Pagamento.find().lean().select('-createdAt').select('-updatedAt').select('-__v').select('-venda')
        } catch(erro){
            return res.status(500).json({message: erro})
        }

        //console.log(objPagamentos[1].data.toLocaleString().split(',')[0])

        let pagamentosFiltrados = []

        for(let i in objPagamentos){
            if(objPagamentos[i].data.toLocaleString().split(',')[0] == data){
                pagamentosFiltrados.push(objPagamentos[i])
            }
        }

        let caixas = []
        let encontrado
        for(let i in pagamentosFiltrados){
            encontrado = false
            for(let i2 in caixas){
                if(pagamentosFiltrados[i].caixa == caixas[i2]){
                    encontrado = true
                    break
                }
            }
            if(!encontrado){
                caixas.push(pagamentosFiltrados[i].caixa)
            }
        }

        let total
        let pagamentos = []
        for(let i in caixas){
            total = 0
            for(let i2 in pagamentosFiltrados){
                if(caixas[i] == pagamentosFiltrados[i2].caixa){
                    total = total + pagamentosFiltrados[i2].valor
                }
            }

            // consultar nome do operador de caixa no banco de dados
            let usuario
            try{
                usuario = await Usuario.findById(caixas[i]).lean().select('-senha').select('-createdAt').select('-updatedAt').select('-__v')
            } catch(erro){
                return res.status(500).json({message: erro})
            }

            usuario = usuario.nome
            
            const pagamento = {
                caixa: caixas[i],
                nome: usuario,
                valor: total
            }
            pagamentos.push(pagamento)
        }
        return res.status(200).json({pagamentos})
    }

}