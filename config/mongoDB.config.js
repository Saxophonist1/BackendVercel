const mongoose = require("mongoose")
const mongoConnection = mongoose.createConnection()

mongoConnection.conectarMongoDB = async () => {
    //return mongoose.connect("mongodb://127.0.0.1:27017/Empresa")
    return mongoose.connect(process.env.MONGODB_URI)
}

mongoConnection.establecerConexion = async function () {
    try {
        await this.conectarMongoDB()
            .then(() => {
                console.log("Conectado con MongoDB")
            })
            .catch((err) => {
                console.log("Error 1 conectando con MongoDB: " + err)
                process.exit(0)
            })
    } catch (error) {
        console.log("Error 2 conectando con MongoDB: " + error)
        process.exit(0)
    }
}

module.exports = mongoConnection