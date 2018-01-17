'use strict';
var fs = require('fs');
var path = require('path');

var Artist = require('../models/artist.model');
var Album = require('../models/album.model');
var Song = require('../models/song.model');

function getArtist(req,res){
    res.status(200).send({message: 'Metodo getArtist del controlador de artista'});
}

function saveArtist(req,res){
    var artist = new Artist();

    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err,artistStored)=>{
        if(err){
            res.status(500).send({message: ' Error al guardar el artista'});    
        } else {
            if(!artistStored){
                res.status(404).send({message: ' El artista no ha sido guardado'});
            } else {
                res.status(200).send({artist: artistStored});
            }
        }
    });
}
module.exports = {
    getArtist,
    saveArtist
}