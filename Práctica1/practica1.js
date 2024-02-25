//Importación de modulos necesarios.
const http = require("http");
const fs = require("fs");
const path = require("path");

const requestListener = function (request, response){
    //Recoger la url de la petición
    let urlPath = "";
    if (request.url == "/") {
        urlPath = "./index.html";
    } 
    else {
        urlPath = "." + request.url;
    }

    //Controlar la extension de la petición y establecer el tipo de contenido.
    let extNameFile = "";
    extNameFile = path.extname(request.url);

    switch(extNameFile) {
        case ".html":
            response.setHeader("Content-Type", "text/html");
            break;
        case ".css":
            response.setHeader("Content-Type", "text/css");
            break;
        case ".jpg":
            response.setHeader("Content-Type", "image/jpg");
            break;
        default:
            response.setHeader("Content-Type", "text/html");    
            break;
    }

    //Cargar el archivo del path y escribirlo para mostrarlo en la página web.
    fs.readFile(urlPath, (err, data) => {
        if (err) {
            response.writeHead(500);
            response.write("<h1>Error al cargar la pagina</h1>")
            response.end();
            return
        }
        
        response.writeHead(200);
        response.write(data)
        response.end();
        
    })
};

//Creación del servidor y establecemos el puerto de escucha.
const server = http.createServer(requestListener);
server.listen(80);
