const Empresa = require("../models/empresa.model")
const mongoConnection = require("../config/mongoDB.config")


const ejecutar = async()=>{
    await mongoConnection.conectarMongoDB()
    .then(()=>{
        console.log("¡Conectado a MongoDB!")
    })
    .catch((err)=>{
        console.log(err)
    })

    const empresas = [
        {
            nombre:"Fanta",
            telefono:"923456789",
            direccion:"C/ de Mexico, 20, 03008 Alacant, Alicante"
        },
        {
            nombre:"LaLiga",
            telefono:"987654321",
            direccion:"C/ de Torrelaguna, 60, Cdad. Lineal, 28043 Madrid"
        },
        {
            nombre: "Mercadona",
            telefono: "999888777",
            direccion: "Av. Constitución, 118, 03400 Villena, Alicante"
        }
    ]

    await Empresa.insertMany(empresas)
    .then((res)=>{
        console.log(res)
    })
    .catch((err)=>{
        console.log(err)
    })

    await mongoConnection.close()
    process.exit()
}

ejecutar()