const apenasAdministrador = (req,res,next) =>{
    if(req.usuario.tipo === 1){
        next()
        return
    } else{
        return res.json({message: 'área de administrador, você não tem permissão'})
    }
}

module.exports = apenasAdministrador