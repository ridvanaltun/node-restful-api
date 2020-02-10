const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { internalErr, notFoundErr } = require('./lib');
const Task = require('./api/models/todoListModel'); // created model loading here

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tododb');

// extended: false -> req key-val pairs val is should be string or array
// extended: true -> req key-val pairs val is can be any
app.use(bodyParser.urlencoded({ extended: true }));

// basically tells the system that you want json to be used
app.use(bodyParser.json());

const routes = require('./api/routes/todoListRoutes');

// register the route
routes(app);

// handle 404
app.use(notFoundErr());

// handle 500
app.use(internalErr());

app.listen(port);

// eslint-disable-next-line no-console
console.log(`RESTful API server started on: ${port}`);
