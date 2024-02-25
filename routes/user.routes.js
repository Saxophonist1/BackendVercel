const UserController = require("../controllers/user.controller")
const express = require("express")
const router = express.Router()
const { requireLogin, requireAdmin } = require("../middlewares/login.mw")
const rutasProtegidasJWT = require("../middlewares/jwt.mw")

// Cargar la vista de registro
router.get("/", UserController.showRegister)
// Crear/Registrar usuario
router.post("/", UserController.register)

// Cargar la vista de login
router.get("/login", UserController.showLogin)
// Autenticar
router.post("/login", UserController.login)

// Vista de Usuarios
router.get("/list", UserController.showList)

router.get("/secret", requireAdmin, UserController.showSecret)
router.get("/jwt", rutasProtegidasJWT, UserController.showSecret)

// Actualizar usuario
router.get("/:id", UserController.updateUser)
router.patch("/:id", UserController.updateUser)
// Eliminar usuario
router.delete("/:id", UserController.deleteUser)

// Ruta para redirigir al usuario logueado como administrador
router.get("/logueadoadmin", requireLogin, UserController.showLogueadoAdmin);
// Ruta para redirigir al usuario logueado
router.get("/logueado", requireLogin, UserController.showLogueado);

// Limpiar sesión
router.get("/logout", UserController.logout)

module.exports = router