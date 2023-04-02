const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
const port = 3000;
const axios = require('axios');

const { Pool } = require('pg');

// Configura la conexión a la base de datos PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hoteldanarama',
  password: 'Nicolas3270',
  port: 5432, // El puerto por defecto de PostgreSQL es 5432
});



app.use(express.static("public"));
app.use(express.static(__dirname));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// app.get("/registrado", (req,res) => {
//   res.sendFile(__dirname + "/public/exito.html")
// })


app.get('/registrado', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM formulario ORDER BY id DESC LIMIT 1');
    const datos = result.rows[0]; // El primer (y único) registro del resultado
    console.log(datos);
    res.render('exito', { datos });
  } catch (error) {
    console.error('Error al obtener el último registro:', error);
    res.status(500).send('Error al obtener el último registro');
  }
});

app.get('/clientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM formulario ORDER BY id DESC LIMIT 20');
    const datosClientes = result.rows;
    console.log(datosClientes);
    res.render('clientes', { datosClientes });
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
});

app.post("/formulario", (req, res) => {
  async function guardarDatos() {
    try {
      // Obtiene los datos del formulario
      var tipos = req.body.tipo;
      var numero = req.body.numero;
      var expedicion = req.body.city;
      var nombres = req.body.nombres;
      var apellidos = req.body.apellidos;
      var celular = req.body.celular;
      var correo = req.body.correo;
      var residencia = req.body.home;
      var procedencia = req.body.ciudad;
      var ocupacion = req.body.ocupacion;
      var acompanantes = req.body.acompanantes;
      var habitacion = req.body.habitacion;
      var tarifa = req.body.tarifa;
      var llegada = req.body.llegada;
      var salida = req.body.salida;
  
      // Inserta los datos en la base de datos
      const query = 'INSERT INTO formulario (tipo, numero, expedicion, nombres, apellidos, celular, correo, residencia, procedencia, ocupacion, acompanantes, habitacion, tarifa, llegada, salida) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';
      const values = [tipos, numero, expedicion, nombres, apellidos, celular, correo, residencia, procedencia, ocupacion, acompanantes, habitacion, tarifa, llegada, salida];
      await pool.query(query, values);
  
      console.log('Datos guardados en la base de datos');
      res.redirect("/registrado");
    } catch (err) {
      console.error('Error al guardar los datos en la base de datos', err);
    } finally {
      // Libera la conexión a la base de datos
      console.log("Bien");
    }
  }
  guardarDatos();
  
    
  });

app.listen(port, () => {
    console.log("Servidor inicializado en el puerto 3000");
});


