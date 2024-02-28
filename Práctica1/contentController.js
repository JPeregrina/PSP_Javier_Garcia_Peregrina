//Lista de tipos de contenidos posibles.
const TypeList = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.jpg': 'image/jpg',
};

function getContentType(extension) {
    //Devolvemos el tipo de contenido.
    return TypeList[extension];
}
  
//Exportamos la  función del modulo.
module.exports = {
    getContentType: getContentType,
};