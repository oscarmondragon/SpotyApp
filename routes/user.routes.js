'use strict';

 var express = require('express');
 var UserController = require('../controllers/user.controller');

 var api = express.Router();

 api.get('/prueba-controlador',  UserController.pruebas);

    module.exports = api;