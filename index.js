const express = require('express');
const fs = require('fs');


// tener acceso al server- instanciar express
const server = express();

const objectKodemia = JSON.parse(fs.readFileSync('./kodemia.json'))

// console.log('objeto: ', objectKodemia.koders)

// función promificada para leer un archivo
function readFilePromise(pathToRead) {
    return new Promise((resolve, reject) => {
        fs.readFile(pathToRead, 'utf8', (err, content) => {
            if (err) {
                reject(err)
            }else {
                resolve(content)
            }
        })
    })
}


// middleware
server.use(express.json());

server.get('/hola', (request, response) => {
    response.write('Hola mundo desde express')
    response.end()
})

server.get('/koders', (request, response) => {
    // response.setHeader('Content-Type', 'application/json')
    // const responseObj = {message: 'Hola'}
    
    // response.write(JSON.stringify(responseObj))
    // response.end()
    response.status(200).json({
        message: 'Hola Koders'
    })
})

server.post('/koders', (request, response) => {
    const body = request.body
    console.log('Body: ', body)

    response.status(201).json({
        message: 'Aqui se creará un koder'
    })
})


server.get('/read', (req, res) => {
    readFilePromise('kodemia.json')
        .then((content) => {
            const contentObject = JSON.parse(content);
            res.json({
                koders: contentObject.koders
            })
        })
        .catch((err) => {
            res.status(400).json({error: 'No se pudo leer el archivo'})
        })
})


// fs + express
// leer del archivo koders.json y regresar los koders desde un metodo GET /koders
// GET /koders -> 
// POST /koders ->





server.listen(8080, () => {
    console.log('listening on port: 8080')
})

// mentors
// GET /mentors -> 
// POST /mentors -> 


// Endpoint
// EL conjunto de un METODO y una RUTA
// GET /koders
// GET /koders/:name
// POST /koders
// PUT /koders/:id