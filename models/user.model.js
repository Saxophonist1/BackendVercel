const mongoose = require("mongoose")
const Empresa = require("./empresa.model")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
        required: true,
        enum: ["ADMIN", "USER"],
    },
})

const User = mongoose.model("User", userSchema)

// Método para obtener el listado de empresas asociadas al usuario
User.findEmpresas = async function() {
    try {
        const empresas = await Empresa.find()
        return empresas
    } catch (error) {
        throw error
    }
}

// Registrar Usuarios
User.create = async function (newUser, result) {
    await newUser
        .save()
        .then(function (data) {
            result(data, null)
        })
        .catch(function (err) {
            result(null, err)
        })
}

// Auxiliar para Login
User.findByUsername = async function (username_param, result) {
    const userFound = await User.findOne({ username: username_param })
    if (userFound) {
        result(userFound, null)
    } else {
        result(null, { "err": "No hay usuarios con ese username" })
    }
}

// Obtener todos los usuarios
User.findUsers = async function (result) {
    const users = await User.find()
    if (users) {
        result(users, null)
    } else {
        result(null, { "err": "No hay usuarios en la base de datos" })
    }
}

// Actualizar Usuario
User.updateUser = async function (id, userToUpdate, result) {
    const update = {
        username: userToUpdate.username,
        password: userToUpdate.password,
        profile: userToUpdate.profile
    };

    await User.findByIdAndUpdate(id, update, { new: true })
        .then(function (updatedUser) {
            result(updatedUser, null)
        })
        .catch(function (err) {
            result(null, err)
        })
}

// Eliminar Usuario
User.deleteUser = async function (id, result) {
    await User.findByIdAndDelete(id)
        .then(function (userDeleted) {
            result(userDeleted, null)
        })
        .catch(function (err) {
            result(null, err)
        })
}

module.exports = User