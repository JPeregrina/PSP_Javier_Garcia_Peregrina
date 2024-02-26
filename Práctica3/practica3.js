//Importaciones de modulos necesarios.
const express = require("express");
const mongoose = require("mongoose");
const url = require("url");

//Conexión a la BBDD.
mongoose.connect('mongodb://localhost:27017/biblioteca');

//Creación del modelo de libro y recogida de su esquema.
let libroSchema = new mongoose.Schema({
    titulo: String,
    autor: [String],
    ejemplares: Number
},
{
    versionKey: false
});
    
let Libro = mongoose.model('libros', libroSchema)

//Inicio de la aplicación y definicion del uso de JSON en las request.
let app = express();
app.use(express.json());

//Metodo GET para recogida de libros, ya sea por id, por dos condiciones, o recuperar todos los de la colección.
app.get('/libros', (req, res) => {
    let url_parts = url.parse(req.url, true);
    if (url_parts.query.id != null) {
        Libro.findById(url_parts.query.id).then(result => {
            res.send(result);
        })
    }
    else if (url_parts.query.titulo != null && url_parts.query.ejemplares != null){
        Libro.findOne(
            {
                titulo: url_parts.query.titulo,
                ejemplares: url_parts.query.ejemplares 
            }
        ).then(result => {
            res.send(result);
        });
    }
    else {
        Libro.find().then(result => {
            res.send(result);
        })
    }
});

//Metodo POST para crear un libro nuevo
app.post('/libros', (req, res) => {
    //Si el body de la request tiene mas de un libro añadiremos todos los libros, en cambio si no es asi solo añadiremos el libro señalado en el body.
    if (Array.isArray(req.body)) {
        let bookArray = [];
        req.body.forEach(book => {
            let bookToInsert = {
                titulo: book.titulo,
                autor: book.autor,
                ejemplares: book.ejemplares
            };

            bookArray.push(bookToInsert);
        });

        //Insertamos todos los libros dentro del array.
        Libro.insertMany(bookArray).then(result => {
            res.send(result);
        });
    } 
    else{
        Libro.create({
            titulo: req.body.titulo,
            autor: req.body.autor,
            ejemplares: req.body.ejemplares
        }).then(result => {
            res.send(result);
        })
    }
});

//Metodo PUT para actualizar un libro por su id.
app.put('/libros', (req, res) => {
    let url_parts = url.parse(req.url, true);
    if (url_parts.query.id != null) {
        Libro.findByIdAndUpdate(
            url_parts.query.id,
            {
            titulo: req.body.titulo,
            autor: req.body.autor,
            ejemplares: req.body.ejemplares
            },
            {
                returnDocument: 'after'
            })
            .then(result => {
                res.send(result);
        });
    }
});

//Metodo DELETE para eliminar un libro por su id.
app.delete('/libros', (req, res) => {
    let url_parts = url.parse(req.url, true);
    if (url_parts.query.id != null) {
        Libro.findByIdAndDelete(url_parts.query.id).then(result => {
            res.send(result);
        })
    }
});

//Por ultimo establecemos el puerto de escucha de la API al 8080
app.listen(8080);
