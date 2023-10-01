const mongoose = require('../db/conn')
const {Schema} = mongoose

const Usuario = mongoose.model(
    'usuario',
    new Schema({
        _id: {type: String, require:true},
        nome: {type: String, required:true},
        senha: {type: String, require:true},
        tipo: {type: Number, require:true},
    },
    {timestamps: true}
    ),
)

module.exports = Usuario