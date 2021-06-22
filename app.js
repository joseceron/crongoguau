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
const dateStart = moment(date).format("YYYY-MM-DDTHH:mm:ss") + ".000Z";
const dateStartFixed = moment(date).subtract(5, "hours").format("YYYY-MM-DDTHH:mm:ss") + ".000Z";
const dateFinish = moment(date).add(30, "minutes").format("YYYY-MM-DDTHH:mm:ss") + ".000Z";

app.post('', (req, res) => {
  return res.send({
    mensaje: 'default'
  })
})

const body = {
  msg: "Start cron"
}

app.post('/cron', (req, res) => {
  console.log(req.body)
  // console.log(body)
  var myJob = new Scheduled({
    id: "goguau",
    pattern: "*/30 6-23 * * 1-6", // Tarea a ejecutar cada minuto de lunes a sábado
    task: function () {
      console.log("Job Go Guau: ", dateStartFixed);
      const payload = {
        url: 'https://us-central1-test-goguau.cloudfunctions.net/serviceNotification/cron',
        body
      };
      return Petitions.postRequest(payload).then((response) => {
        console.log(response);
        res.status(200).send(response);
      }).catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
    }
  }).start();

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