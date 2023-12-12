const jwt = require("jsonwebtoken")
const getToken = require('./get-token')

const verificarToken = (req,res,next) => {
    const authHeader = req.headers.authorization

    if(!authHeader){
        return res.status(401).json({message: 'voce nao esta logado'})
    }

    const token = getToken(req)

    if(!token){
        return res.status(401).json({message: 'voce nao esta logado'})
    }

    try{
        const tokenDecodificado = jwt.verify(token,'nossosecret')
        req.usuario = tokenDecodificado
        next()

    } catch(erro){
        return res.status(400).json({message: 'token invalido'})
    }
}

module.exports = verificarToken