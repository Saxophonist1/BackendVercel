const Empresa = require("../models/empresa.model")

exports.findAllEmpresas = async (req, res) => {
    await Empresa.findAllCompanies((error, empresas) => {
        if (error) {
            res.status(500).json(error)
        } else {
            res.status(200).json(empresas)
        }
    })
}

exports.findEmpresasById = async (req, res) => {
    const { id } = req.params
    await Empresa.findCompaniesById(id, (error, empresa) => {
        if (error) {
            res.status(500).json(error)
        } else {
            if (empresa.length > 0) {
                res.status(200).json(empresa)
            } else {
                res.status(404).json({ msg: "Empresa no encontrada" })
            }
        }
    })
}

exports.createEmpresas = async (req, res) => {
    const newEmpresa = new Empresa(req.body)
    await Empresa.createCompany(newEmpresa, (error, empresaCreated) => {
        if (error) {
            res.status(500).json(error)
        } else {
            res.status(200).json(empresaCreated)
        }
    })
}

exports.updateEmpresas = async (req, res) => {
    const empresaToUpdate = req.body
    const { id } = req.params
    await Empresa.updateCompany(id, empresaToUpdate, (error, updatedEmpresa) => {
        if (error) {
            res.status(500).json(error)
        } else {
            res.status(200).json(updatedEmpresa)
        }
    })
}

exports.deleteEmpresas = async (req, res) => {
    const { id } = req.params
    await Empresa.deleteCompany(id, (error, empresaDeleted) => {
        if (error) {
            res.status(500).json(error)
        } else {
            res.status(200).json(empresaDeleted)
        }
    })
}