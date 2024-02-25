const logger = require("../logger")

function errorHandler(err,req,res,next){
    const { status = 500, message = "FALLO GENERAL "} = err
    logger.error.error(status + " " + message)
    res.locals.user = "Sorry " + res.locals.user
    res.render("error_empresa.ejs", {message,status})
}

module.exports = errorHandler