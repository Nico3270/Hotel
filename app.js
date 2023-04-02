const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const app = express();

// Configuración del middleware body-parser para manejar datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


app.use(express.static("public"));
app.use(express.static(__dirname));
// Conectar a la base de datos de MongoDB
mongoose.connect('mongodb+srv://cristiannicolasrodriguez3270:Nico96@cluster0.8c8mcxn.mongodb.net/clientesDanarama?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión exitosa a la base de datos'))
  .catch((err) => console.error('Error de conexión a la base de datos', err));

// Crear un esquema de datos para el formulario
const formularioSchema = new mongoose.Schema({
  tipo: String,
  numero: Number,
  expedicion: String,
  nombres: String,
  apellidos: String,
  celular: String,
  correo: String,
  residencia: String,
  procedencia: String,
  ocupacion: String,
  acompanantes: Number,
  habitacion: String,
  tarifa: String,
  llegada: String,
  salida: String,
});

// Crear un modelo para el formulario
const Formulario = mongoose.model('Formulario', formularioSchema);

// Guardar los datos del formulario utilizando el modelo de formulario
app.post("/formulario", (req, res) => {
  const formulario = new Formulario({
    tipo: req.body.tipo,
    numero: req.body.numero,
    expedicion: req.body.city,
    nombres: req.body.nombres,
    apellidos: req.body.apellidos,
    celular: req.body.celular,
    correo: req.body.correo,
    residencia: req.body.home,
    procedencia: req.body.ciudad,
    ocupacion: req.body.ocupacion,
    acompanantes: req.body.acompanantes,
    habitacion: req.body.habitacion,
    tarifa: req.body.tarifa,
    llegada: moment(req.body.llegada).format('DD/MM/YYYY'),
    salida: moment(req.body.salida).format('DD/MM/YYYY'),
  });
  formulario.save()
    .then(() => {
      console.log('Datos guardados en la base de datos');
      res.redirect("/registrado");
    })
    .catch((err) => {
      console.error('Error al guardar los datos en la base de datos', err);
      res.status(500).send({
        message: 'Error al guardar los datos en la base de datos',
        error: err
      });
    })
    .finally(() => {
      console.log("Bien");
    });
});

//En esta ruta se muestran los datos del ultimo cliente ingresado
app.get('/registrado', async (req, res) => {
  try {
    const datos = await Formulario.findOne().sort({ $natural: -1 });
    console.log(datos);
    res.render('exito', { datos });
  } catch (error) {
    console.error('Error al obtener el último registro:', error);
    res.status(500).send('Error al obtener el último registro');
  }
});


app.get('/clientes', async (req, res) => {
  try {
    const result = await Formulario.find().sort({ _id: -1 }).limit(20);
    const datosClientes = result;
    console.log(datosClientes);
    res.render('clientes', { datosClientes });
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).send('Error al obtener los registros');
  }
});

// Ruta inicial del proyecto
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});



// Iniciar el servidor
let port = process.env.PORT;

if (port == null || port == ""){
  port = 3000;
}

app.listen(port, () => {
    console.log("Servidor inicializado en el puerto 3000");
});