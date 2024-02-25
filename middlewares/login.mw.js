const requireLogin = (req,res,next) => {
    if(req.session.userLogued){
        next()
    }else{
        res.status(401).json({"err":"Ususuario no logueado"})
    }
}

const requireAdmin = (req,res,next) => {
    if(req.session.userLogued && req.session.userLogued.profile == "ADMIN"){
        next()
    }else{
        res.status(401).json({"err":"Ususuario sin permisos de administrador"})
    }
}

module.exports = {requireLogin, requireAdmin}