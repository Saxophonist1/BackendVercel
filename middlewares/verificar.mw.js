const logger = require("../logger")

function verificar(req, res, next) {
    const { pass } = req.query
    if (pass && pass == "Proyecto") {
        next()
    } else {
        logger.error.fatal("Sin permiso!!")
        res.render("permiso.ejs")
    }
}

module.exports = verificar