const mysql = require("mysql")

const dbConnection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database: "usuarios"
})

dbConnection.establecerConexion = async()=>{
    await dbConnection.connect((err)=>{
        if(err){
            console.log("Error 1: " + err)
            process.exit(0)
        }else{
            console.log("Conectado con MySQL")
        }
    })
}

/* PASO ADICIONAL MYSQL */
dbConnection.crearEstructura = async()=>{
    const sql = `CREATE DATABASE IF NOT EXISTS usuarios;
    USE usuarios;
        
    CREATE TABLE IF NOT EXISTS usuarios(
        NIF VARCHAR(9) NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        apellidos VARCHAR(255) NOT NULL,
        PRIMARY KEY (NIF)
    );`

    sql.split(";").forEach(async(q)=>{
        if(q.trim().length!==0){
            dbConnection.query(q,(err,res)=>{
                if(err){
                    console.log(err)
                }
            })
        }
    })
}


module.exports = dbConnection