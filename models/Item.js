const mongoose = require('../db/conn')
const {Schema} = mongoose

const Item = mongoose.model(
    'item',
    new Schema({
        _id: {type: Number, require:true},
        nome: {type: String, required:true},
        descricao: {type: String, require:true},
        preco: {type: Number, require:true},
        tipo: {type: Number, require:true},
    },
    {timestamps: true}
    ),
)

module.exports = Item