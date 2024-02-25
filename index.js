const { generateApiKey } = require("generate-api-key")
const verificar = require("./middlewares/verificar.mw")
const Empresa = require("./models/empresa.model")
const cors = require("cors")
const fs = require("fs")
const morgan = require("morgan")
const express = require("express")
const app = express()
const path = require("path")
const logger = require("./logger")
const AppError = require("./AppError")
const errorHandler = require("./middlewares/errorHandler.mw")
const methodOverride = require("method-override")
const mongoConnection = require("./config/mongoDB.config")
const empresaRoutes = require("./routes/empresa.routes")
const userRoutes = require("./routes/user.routes")
const UserController = require("./controllers/user.controller")
const wrapAsync = require("./utils/functions")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const apiKey = require("./middlewares/apiKey.mw")
const https = require("https")


const { app: appCarrito, server: serverCarrito } = require('./bin/www')
const portMainApp = process.env.PORT || 9020
const portCarrito = 8000

const version = "v1"

let users = []
const crearUsuario = (username) => {
  let usuarioNuevo = {
    _id: Date.now(),
    username: username,
    api_key: generateApiKey()
  }
  users.push(usuarioNuevo)
  return usuarioNuevo
}

// MW Session
app.use(session({ secret: "123456789" }))
//----------

app.use(cors())
app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))

// MVC ---------------------- INICIO
app.use("/users", userRoutes)
app.get("/logueado", UserController.showLogueado)
app.get("/logueadoadmin", UserController.showLogueadoAdmin)

app.post("/crearUsuario", (req, res) => {
  const { username } = req.body
  const usuarioNuevo = crearUsuario(username)
  if (usuarioNuevo) {
    res.redirect("/empresas")
  } else {
    res.render("error_empresa", { err })
  }
})
// MVC ---------------------- FIN

const addMorganToLogger = morgan("combined", {
  stream: fs.createWriteStream("./logs/access.log", { flags: "a" }),
})

const urlAtlas =  process.env.MONGODB_URI

const List = ["http://127.0.0.1:3000","http://localhost:3000","http://127.0.0.1:8000","https://projectvercel-mu.vercel.app"]
const CorsList = {
  origin: (origin, callback) => {
    console.log(origin)
    if (List.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  },
  credentials: true
}
app.use(cors(CorsList))

app.use(cookieParser("passwordforcookies"))
app.use(
  session({
    secret: "contraseñaqueosdelagana",
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 1000,
    },
  })
)

app.use((req, res, next) => {
  res.locals.user = "admin"
  next()
})

app.use(addMorganToLogger)

async function conectarMongoDB(){
  //CAMBIAR CADENA DE CONEXIÓN SEGÚN SE DESEE
  return mongoose.connect(urlAtlas)
}

app.use("/a", morgan("tiny"))
app.use(function (req, res, next) {
  console.log("Ejecutando un middleware!!!")
  next()
})

/* RUTAS */
app.use(`/api/${version}/empresas`, empresaRoutes)
app.use(`/api/${version}/usuarios`, userRoutes)

/* OPERACIONES CRUD PARA EMPRESAS */
app.get("/", (req, res) => {
  res.redirect("/empresas")
})

app.get("/empresas", wrapAsync(async (req, res) => {
  try {
    const empresas = await Empresa.find()
    res.render("main", { empresas })
  } catch (error) {
    next(error) // Pass the error to the next middleware
  }
}))

// - INICIO COOKIES
app.get("/empresas", async (req, res, next) => {
  try {
    if (req.session && req.session.count) {
      const { colorCookie = "blue" } = req.signedCookies
      res.status(200).json({ msg: req.session.count, colorCookie })
    } else {
      res.status(200).json({ msg: "No hay sesión" })
    }
  } catch (error) {
    console.error(error.stack)
    res.status(500).json({ error: 'Error en la gestión de cookies' })
  }
})

app.get("/empresas", async (req, res, next) => {
  try {
    console.log(req.session.count)
    if (req.session && req.session.count) {
      req.session.count += 1
    } else {
      req.session.count = 1
    }
    res.cookie("colorCookie", "newColor", { signed: true })
    res.redirect("/empresas")
  } catch (error) {
    console.error(error.stack)
    res.status(500).json({ error: 'Error en la gestión de cookies' })
  }
})
// - FIN COOKIES

app.get("/empresas/nueva", (req, res) => {
  res.render("new_empresa")
})

app.post("/empresas/nueva", wrapAsync(async (req, res) => {
  try {
    const nuevaEmpresa = new Empresa(req.body)
    await nuevaEmpresa.save()
    res.redirect("/logueadoadmin")
  } catch (err) {
    res.render("error_empresa", { err })
  }
}))

app.get("/empresas/:id", wrapAsync(async (req, res) => {
  try {
    const empresaDetalles = await Empresa.findById(req.params.id)
    res.render("show_empresa", { empresa: empresaDetalles })
  } catch (err) {
    res.render("error_empresa", { err })
  }
}))

app.get("/empresas/:id/editar", wrapAsync(async (req, res) => {
  try {
    const empresaEdit = await Empresa.findById(req.params.id)
    res.render("edit_empresa", { empresa: empresaEdit })
  } catch (err) {
    res.render("error_empresa", { err })
  }
}))

app.patch("/empresas/:id/editar", wrapAsync(async (req, res) => {
  try {
    await Empresa.findByIdAndUpdate(req.params.id, req.body)
    res.redirect("/logueadoadmin")
  } catch (err) {
    res.render("error_empresa", { err })
  }
}))

app.delete("/empresas/:id", wrapAsync(async (req, res) => {
  try {
    await Empresa.findByIdAndDelete(req.params.id)
    res.redirect("/logueadoadmin")
  } catch (err) {
    res.render("error_empresa", { err })
  }
}))

/* ADMINISTRADOR */
app.get("/admin", (req, res, next) => {
  try {
    throw new AppError("No eres Administrador", 403)
  } catch (err) {
    res.render("error_empresa", { err })
  }
})

/* RUTA PROTEGIDA DE USUARIOS */
app.get("/usuarios", verificar, (req, res) => {
  res.send("ESTE ES EL LISTADO SECRETO...")
})

/* CONTROLAR LAS RUTAS NO EXISTENTES */
app.use((req, res, next) => {
  next(new AppError("Ruta no existente", 404))
})

app.use(errorHandler)

/* LEVANTAR EL SERVIDOR */
https.createServer({
  cert:fs.readFileSync("daw.crt"),
  key:fs.readFileSync("daw.key")
},
app).listen(portMainApp, portCarrito, () => {
  console.log("https://localhost:" + portMainApp)
  logger.access.debug(`https://localhost:${portMainApp}`)
  mongoConnection.establecerConexion()
  console.log(`Carrito corriendo en http://localhost:${portCarrito}`)
})