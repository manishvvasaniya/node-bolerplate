'use strict';
const http = require('http');
const app =  require('express')();
const bodyParser = require('body-parser')
const path = require('path');
const fileUpload = require("express-fileupload");
var cors= require("cors");
var Apirouter=require("./api/api-authentication");


//------------------  EXPRESS CONFIG  ------------------------//

app.set("view engine", "ejs");
app.set("views", path.join(__dirname));
app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(fileUpload());

//---------------  EXPRESS ROUTING AND ERROR -----------------//

app.use('/api', Apirouter);
app.use((req, res, next) => {
    const error = new Error("Unauthorized Access");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      message: error.message
    });
});

//----------------------  SERVER SETUP  ----------------------//

const server = http.createServer(app);
const port = process.env.port || 8080;
server.listen(8080);
