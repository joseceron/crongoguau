const express = require("express");
// const ngrok = require('ngrok');
// var chalk = require('chalk');

// var lavisaSQL = require('./utils/lavisaSQL.js')
var Petitions = require("./utils/petitions");
var Scheduled = require("scheduled");
var bodyParser = require("body-parser");
const moment = require("moment");

const app = express();
const port = process.env.PORT || 3000;
// // server configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const comodin = "\'";

const date = new Date();
// const dateStart = moment(date).format("YYYY-MM-DDTHH:mm:ss")+".000Z";
const dateStart = moment(date).subtract(3, "hours").format("YYYY-MM-DDTHH:mm:ss")+".000Z";
const dateFinish = moment(date).add(30, "minutes").format("YYYY-MM-DDTHH:mm:ss")+".000Z";

app.post('', (req, res) => {
  return res.send({
    mensaje: 'default'
  })
})

const body = {
  "orden": [
    {
      "campo": "fecha_inicio",
      "ascendente": true,
    },
  ],
  "diaMes": "dia",
  "fechaFin": "",
  "fechaInicio": "",
  "filtros": [  
    {
      "objeto": "servicio",
      "campo": "fecha_inicio",
      "condicional": "BETWEEN",
      "parametro": comodin + dateStart + comodin + 
          " AND " + 
          comodin + dateFinish + comodin,
      "conjuncion": "AND",
    },
  ],
}

app.post('/cron', (req, res) => {
  console.log(req.body)
  

  // var myJob = new Scheduled({
  //   id: "goguau",
  //   pattern: "*/1 6-23 * * 1-6", // Tarea a ejecutar cada minuto de lunes a sábado
  //   task: function () {
      console.log("Job go Guau");
      // console.log(body)
      const payload = {
        url: "https://ema2edgoreader.latinapps.co/apiread/funcion/campospaginacion/5949/696/c256a74679d37c66ff3da35bbf8af58ca39541f8a350e853f442f3e42ab0171d",
        body,
      }
      return Petitions.postRequest(payload).then((response) => {
        // console.log(response);
        const data = response.data;        

        if (data != null && data.length > 0) {                    
          res.status(200).send(response);
        } else {
          res.status(200).send({data: [], total: 0, success: false});
        }
      }).catch((error) => {
        console.log(error);
        res.status(400).send({error});
      })
    // }
  // }).start();

  // return res.send({
  //   mensaje: 'index'
  // })
})

// This metod needs to be last
app.post('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Go Guau',
    errorMessage: 'Page not found.'
  })
})


app.listen(port, () => {
  console.log('Server is up on port ' + port)
})

// ngrok.connect({
//     proto: 'http',
//     addr: 3000
// }, (err, url) => {
//     if (err) {
//         console.error('Error while connecting Ngrok', err);
//         return new Error('Ngrok Failed');
//     } else {
//         console.log('Tunnel Created -> ', url);

//     }
// });