const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.showSecret = function(req, res) {
    res.render("secret.ejs")
}

exports.showList = async function(req, res) {
    await User.findUsers(function(userList, err) {
        if (err) {
            res.status(500).json(err)
        } else {
            userList.userBackEnd = req.session.userLogued
            res.status(200).json(userList)
        }
    })
}

exports.showLogin = function(req, res) {
    res.render("login.ejs")
}

exports.showRegister = function(req, res) {
    res.render("register.ejs")
}

exports.login = async function(req, res) {
    const { username, password } = req.body
    const pwd_textoPlano = password
    let userFoundData = null

    await User.findByUsername(username, async function(userFound, err) {
        if (err) {
            res.render("error_login.ejs")
        } else {
            userFoundData = userFound

            const empresas = await User.findEmpresas()

            if (userFoundData) {
                const validado = await bcrypt.compare(pwd_textoPlano, userFoundData.password)
        
                if (validado) {
                    // CREAR TOKEN JWT
                    const token = jwt.sign(
                        { check: true },
                        "secretJWT",
                        { expiresIn: 1440 }
                    )
                    req.session.jwtToken = token
                    req.session.userLogued = userFoundData

                    req.session.authType = userFoundData.profile === 'ADMIN' ? 'admin' : 'user'

                    const userLogged = req.session.userLogued
                
                    if (userFoundData.profile === 'ADMIN') {
                        res.render("main_admin.ejs", { empresas, userLogged, session: req.session })
                    } else {
                        res.render("main_user.ejs", { empresas, userLogged, session: req.session })
                    }
                } else {
                    res.render("error_login.ejs")
                }
            }
        }        
    })
}

exports.register = async function(req, res) {
    const newUser = new User(req.body)
    newUser.password = await bcrypt.hash(newUser.password, 12)
    const empresas = await User.findEmpresas()

    await User.create(newUser, function(userCreated, err) {
        if (err) {
            res.render("error_usuario_existente.ejs", { empresas })
        } else {
            req.session.userLogued = userCreated
            req.session.authType = userCreated.profile === 'ADMIN' ? 'admin' : 'user'

            if (userCreated.profile === 'ADMIN') {
                res.render("main_admin.ejs", { empresas, session: req.session })
            } else {
                res.render("main_user.ejs", { empresas, session: req.session })
            }
        }
    })
}


exports.showLogueadoAdmin = async function(req, res) {
    const empresas = await User.findEmpresas()
    const userLogged = req.session.userLogued
    const authType = req.session.authType

    let view = "main_admin.ejs"

    if (userLogged && userLogged.profile === 'USER') {
        view = "main_user.ejs"
    }

    res.render(view, { empresas, userLogged, authType, session: req.session })
}

exports.showLogueado = async function(req, res) {
    const empresas = await User.findEmpresas()
    const userLogged = req.session.userLogued
    const authType = req.session.authType

    let view = "main_user.ejs"

    if (userLogged && userLogged.profile === 'ADMIN') {
        view = "main_admin.ejs"
    }

    res.render(view, { empresas, userLogged, authType, session: req.session })
}

exports.updateUser = async function(req, res) {
    const userToUpdate = req.body
    const { id } = req.params

    console.log("ID del usuario a actualizar:", id)
    console.log("Datos del usuario a actualizar:", userToUpdate)

    if (!id || !userToUpdate) {
        return res.status(400).json({ error: "ID de usuario o datos de usuario no proporcionados" })
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, userToUpdate, { new: true })
        console.log("Usuario actualizado correctamente:", updatedUser)
        res.status(200).json(updatedUser)
    } catch (error) {
        console.error("Error al actualizar el usuario:", error)
        res.status(500).json({ error: "Error al actualizar el usuario" })
    }
}

exports.deleteUser = async function(req, res) {
    const { id } = req.params

    await User.deleteUser(id, function(error, userDeleted) {
        if (error) {
            res.status(500).json(error)
        } else {
            res.status(200).json(userDeleted)
        }
    })
}

exports.logout = (req, res) => {
    req.session.destroy()
    res.redirect("/users/login")
}