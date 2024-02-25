const empresaController = require("../controllers/empresa.controller")
const express = require("express")
const router = express.Router()

//Obtener todos los empleados
router.get("/",empresaController.findAllEmpresas)
//Obtener un empleado por ID
router.get("/:id",empresaController.findEmpresasById)
//Crear un empleado
router.post("/",empresaController.createEmpresas)
//Actualizar un empleado
router.put("/:id",empresaController.updateEmpresas)
//Eliminar un empleado
router.delete("/:id",empresaController.deleteEmpresas)



module.exports = router