const mongoose = require('../db/conn')
const {Schema} = mongoose

const Pagamento = mongoose.model(
    'pagamento',
    new Schema({
        data: {type: Date, required:true},
        caixa: {type: String, required:true},
        mesa: {type: Number, required:true},
        valor: {type: Number, required:true},
        venda: {type: Object, required:true}
    },
    {timestamps: true}
    ),
)

module.exports = Pagamento