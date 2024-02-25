function apiKey(req,res,next){
    console.log("HEADERS")
    console.log(req.header("api-key"))
    console.log("--------------")
    if(req.header("api-key")){
        req.session.apiKey = req.header("api-key")
        next()
    }else{
        res.status(401).json({"err":"No existe API KEY"})
    }
    
}

module.exports = apiKey