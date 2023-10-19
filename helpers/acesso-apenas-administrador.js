const apenasAdministrador = (req,res,next) =>{
    if(req.usuario.tipo === 1){
        console.log('a')
        next()
        return
    } else{
        console.log('b')
        return res.status(401).json({message: 'área de administrador, você não tem permissão'})
    }
}

module.exports = apenasAdministrador