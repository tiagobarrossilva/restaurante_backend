const jwt = require("jsonwebtoken")

const criarToken = async(usuarioExistente,req,res) =>{
    const token = jwt.sign(
        {
            id: usuarioExistente._id,
            tipo: usuarioExistente.tipo
        },
        "nossosecret"
    )

    return res.status(200).json({
        token: token,
        tipo: usuarioExistente.tipo,
        nome: usuarioExistente.nome
    })
}

module.exports = criarToken