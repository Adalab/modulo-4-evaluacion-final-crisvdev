// Servidor Express

// Imports

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require('dotenv').config()


// Arracar el servidor

const server = express();


// Configuración del servidor

server.use(cors());
server.use(express.json({limit: "25mb"}));
server.set('view engine', 'ejs');


// Conexion a la base de datos

async function getConnection() {
  const connection = await mysql.createConnection(
    {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS, 
      database: process.env.DB_NAME || "recetas_db",
    }
  );

  connection.connect();

  return connection;
}


// Poner a escuchar el servidor

const port = process.env.PORT || 4500;
server.listen(port, () => {
  console.log(`Ya se ha arrancado nuestro servidor: http://localhost:${port}/`);
});


// Endpoints

server.get('/api/recetas', async (req,res) =>{
  const user = req.params.user;
  const select = 'select * from recetas';
  const conn = await getConnection();
  const [result] = await conn.query(select);
  res.json({
    info: { count: result.length},
   results: result

  })
});

server.post('/api/recetas', async (req,res) =>{
  const user = req.params.user;
  const newReceta = req.body;
  try{
    const insert = 'insert into recetas (nombre , ingredientes, instrucciones) values (?,?,?)';
  const conn = await getConnection()
  const [result] = await conn.query(insert, [
    newReceta.nombre, 
    newReceta.ingredientes, 
    newReceta.instrucciones 
  ]);
  conn.end();
  res.json({
   success: true,
   id:recetas_id
});
  } catch (error){
    res.json({
      success :false,
      message : "Compruebe los datos introducidos"
    });
  }
  });

  server.put('/api/recetas/:recetas_id', async(req,res) =>{
    const user = req.params.user;
    const recetasId = req.params.recetas_id;
    const {nombreFront , ingredientesFront , instruccionesFront} = req.body;
    try{
      const update = 'UPDATE recetas SET nombre = ? , ingredientes = ?, instrucciones = ? WHERE id = ?';
      const conn = await getConnection();
      const [result] = await conn.query (update, [nombreFront , ingredientesFront , instruccionesFront, recetasId]);
      conn.end();
      res.json({
        success:true
      })

    } catch(error){
      res.json({
        success:false ,
        message : "Comprueba los datos"
      })
    }
});

server.delete('/api/recetas/:recetas_id', async (req,res) =>{
  const {recetas_id} = req.params;
try {
  const deleteD = "Delete from recetas where id = ?";
  const conn = await getConnection();
  const [result] = await conn.query (deleteD, [recetas_id])
conn.end()
res.json({
  success:true
});
} catch (error) {
  res.json({
    success : false,
    message : "error",
  });
}
});