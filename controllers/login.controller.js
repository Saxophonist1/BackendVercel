const User = require("../models/user")
const bcrypt = require("bcrypt")//npm i bcrypt
const jwt = require("jsonwebtoken")

exports.showSecret = function(req,res){
    res.render("secret.ejs")
}

exports.showList = async function(req,res){

    await User.findUsers(function(userList,err){
        if(err){
            res.status(500).json(err)
        }else{
            res.render("users.ejs",{ usuarios:userList, usuarioLogin:req.session.userLogued })
        }
    })
}

exports.showLogin = function(req,res){
    res.render("login.ejs")
}

exports.showRegister = function(req,res){
    res.render("register.ejs")
}

exports.register = async function(req,res){
    const newUser = new User(req.body)

    newUser.password = await bcrypt.hash(newUser.password, 12)

    await User.create(newUser,function(userCreated,err){
        if(err){
            res.status(500).json(err)
        }else{
            res.status(200).json(userCreated)
        }
    })
}

exports.login = async function(req,res){
    const { username, password } = req.body   

    const pwd_textoPlano = password
    let userFoundData = null

    await User.findByUsername(username,function(userFound,err){
        if(err){
            res.status(500).json(err)
        }else{
            userFoundData = userFound
        }
    })

    if(userFoundData){
        const validado = await bcrypt.compare(pwd_textoPlano, userFoundData.password)

        if(validado){
            //CREAR TOKEN JWT
            const token = jwt.sign(
                {check:true},
                "secretJWT",
                {expiresIn:1440}
            )            
            req.session.jwtToken = token
            req.session.userLogued = userFoundData
            res.status(200).json(userFoundData)
        }else{
            res.status(401).json({"err":"Usuario y/o contraseña incorrectos"})
        }

    }

}

exports.loginBasicAuth = async function(req,res){
    const base64Auth = req.session.basicAuthToken
    const authDes = Buffer.from(base64Auth,"base64").toString("ascii")
    const [username, password ] = authDes.split(":")   

    console.log(base64Auth)
    console.log(authDes)

    const pwd_textoPlano = password
    let userFoundData = null

    await User.findByUsername(username,function(userFound,err){
        if(err){
            res.status(500).json(err)
        }else{
            userFoundData = userFound
        }
    })

    if(userFoundData){
        const validado = await bcrypt.compare(pwd_textoPlano, userFoundData.password)

        if(validado){
            req.session.userLogued = userFoundData
            res.status(200).json(userFoundData)
        }else{
            res.status(401).json({"err":"Usuario y/o contraseña incorrectos"})
        }

    }

}

exports.logout = (req,res)=>{
    jwt.sign(req.session.jwtToken, "", {expiresIn:1}, (logout,err) => {
        if(err){

        }
    })
    req.session.destroy()
    res.redirect("/users/login")
}