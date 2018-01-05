'use strct';

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/spotyDB', (err,res)=> {
    if(err){
        throw err;
    } else{
        console.log('La base de datos esta corriedo correctamente');
    }
});
