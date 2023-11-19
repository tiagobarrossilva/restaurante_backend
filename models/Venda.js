const mongoose = require('../db/conn')
const {Schema} = mongoose

const Venda = mongoose.model(
    'venda',
    new Schema({
        _id: {type: Number, require:true},
        situacao: {type: String, required:true},
        abertura: {type: Date, require:true},
        fechamento: {type: Date, require:false},
        pedidos: {type: Array}
    },
    {timestamps: true}
    ),
)

module.exports = Venda