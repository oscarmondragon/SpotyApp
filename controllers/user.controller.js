'use strict';
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user.model');
var jwt = require('../services/jwt');

function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando una accion del controlador de usuarios'
    });
}

function saveUser(req, res) {
    var user = new User();
    var params = req.body;
    console.log(params);
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE-ADMIN';
    user.image = 'null';
    if (params.password) {
        //encriptar contraseña y guardar datos
        bcrypt.hash(params.password, null, null, function(err, hash) {
            user.password = hash;
            if (user.name != "" && user.surname != "" && user.email != "") {
                //guardar el usuario
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({
                            message: 'Error al guardar el usuario'
                        });
                    } else {
                        if (!userStored) {
                            res.status(404).send({
                                message: 'No se ha registrado el usuario'
                            });
                        } else {
                            res.status(200).send({
                                user: userStored
                            });
                        }
                    }
                });
            } else {
                res.status(200).send({
                    message: 'Introduce todos los campos'
                });
            }
        });
    } else {
        res.status(500).send({
            message: 'Introduce la contraseña'
        });
    }
}

function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;
    User.findOne({
        email: email.toLowerCase()
    }, (err, user) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la peticion'
            });
        } else {
            if (!user) {
                res.status(404).send({
                    message: 'El usuario no existe'
                });
            } else {
                //Comprobar la contraseña
                bcrypt.compare(password, user.password, function(err, check) {
                    if (check) {
                        //devolver datos del usuario logueado
                        if (params.gethash) {
                            //devolver un toquen de jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            res.status(200).send({
                                user
                            });
                        }
                    } else {
                        res.status(404).send({
                            message: 'El usuario no ha podido loguearse'
                        });
                    }
                });
            }
        }
    });
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;
    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({
                message: 'Error al actualizar el usuario'
            });
        } else {
            if (!userUpdated) {
                res.status(404).send({
                    message: ' No se ha podido actualizar el usuario'
                });
            } else {
                res.status(200).send({
                    user: userUpdated
                });
            }
        }
    });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = "No subido";
    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\'); // separa el path para obtener solo el nombre de la imagen
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1]; // obtiene la extencion de la imagen
        console.log(file_split);
        console.log(file_name);
        console.log(file_ext);
        if (file_ext == 'png' || file_ext == 'gif' || file_ext == 'jpg'  || file_ext == 'PNG'  || file_ext == 'JPG' || file_ext == 'GIF') {
            User.findByIdAndUpdate(userId, {
                image: file_name
            }, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({
                        message: 'Error al actualizar el usuario'
                    });
                } else {
                    if (!userUpdated) {
                        res.status(404).send({
                            message: ' No se ha podido actualizar el usuario'
                        });
                    } else {
                        res.status(200).send({
                            user: userUpdated
                        });
                    }
                }
            });
        } else {
            res.status(200).send({
                message: ' Extencion del archivo no valida'
            });
        }
    } else {
        res.status(200).send({
            message: ' No ha subido ninguna imagen'
        });
    }
}
module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage
};