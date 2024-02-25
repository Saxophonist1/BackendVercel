const mongoose = require("mongoose") //npm i mongoose

const empresaSchema = new mongoose.Schema({
    nombre:{
        type:String,
        required:true
    },
    telefono:{
        type:Number,
        required:true,
        min:0
    },
    direccion:{
        type:String,
        required:true
    }
})

const Empresa = mongoose.model("Empresa", empresaSchema)

Empresa.findAllCompanies = async function(result){   
    await Empresa.find((error, empresas) => {
        if (error) {
            result(error, null)
        } else {
            result(null, empresas)
        }
    })
}

Empresa.findCompaniesById = async function (id, result) {
    await Empresa.find({ _id: id }, (error, empresa) => {
        if (error) {
            result(error, null)
        } else {
            result(null, empresa)
        }
    })
}

Empresa.createCompany = async function (newEmpresa, result) {
    await newEmpresa.save((error, empresaCreated) => {
        if (error) {
            result(error, null)
        } else {
            result(null, empresaCreated)
        }
    })
}

Empresa.updateCompany = async function (id, empresaToUpdate, result) {
    await Empresa.findByIdAndUpdate(
        id,
        empresaToUpdate,
        { new: true },
        (error, updatedEmpresa) => {
            if (error) {
                result(error, null)
            } else {
                result(null, updatedEmpresa)
            }
        }
    )
}

Empresa.deleteCompany = async function (id, result) {
    await Empresa.findByIdAndDelete(id, (error, empresaDeleted) => {
        if (error) {
            result(error, null)
        } else {
            result(null, empresaDeleted)
        }
    })
}

module.exports = Empresa