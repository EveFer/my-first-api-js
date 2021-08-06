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
                const json = JSON.parse(content) // de un string a un objeto
                resolve(json)
            }
        })
    })
}


// middleware
server.use(express.json());

// Query params
server.get('/koders', async (request, response) => {
    // console.log(request.query)
    const {generation} = request.query
    const content = await readFilePromise('kodemia.json')

    let kodersByGeneration = null

    // string -> true
    // indefinido -> false
    if(generation) {
      kodersByGeneration = content.koders.filter(koder => koder.generation === parseInt(generation))
    }
    
    content.koders = kodersByGeneration || content.koders

    response.status(200).json({
        success: true,
        message: 'All Koders',
        data: {
            koders: content.koders
        }
    })
})

// Filtrado que sea por genero.
// Filter que sea por name
// ?gender='m'&name='Jose'


server.post('/koders', async (request, response) => {
    const newKoder = request.body
    const content = await readFilePromise('kodemia.json')

    content.koders.push(newKoder)

    fs.writeFileSync('kodemia.json', JSON.stringify(content, null, 2), 'utf8')

    response.status(201)
    response.json({
        success: true,
        message: 'Koders Added',
        data: {
            koder: newKoder
        }
    })
})

// Sintanxis Universal

// METHOD /recurso/identificador
// PATCH /koders/:id
// PATCH /koders/12
// PATCH /koders/123
// PATCH /koders/2
server.patch('/koders/:id', async (request, response) => {
    const { id } = request.params
    const {name, generation} =  request.body
    
    const content = await readFilePromise('kodemia.json')

    const newKoders = content.koders.map((koder) => {
        if (koder.id === parseInt(id)) {
            if(!name) {
                koder = {...koder, generation}
            }else if(!generation){
                koder = {...koder, name}
            }else {
                koder = {...koder, name, generation}
            }
        }
        return koder
    })

    content.koders = newKoders

    fs.writeFileSync('kodemia.json', JSON.stringify(content, null, 2), 'utf8')

    response.json({
        success: true,
        message: 'Koder Updated'
    })
})

server.get('/koders/:id', async (request, response) => {
    const {id} =  request.params
    const content = await readFilePromise('kodemia.json')

    const koderFound = content.koders.find(koder => koder.id === parseInt(id))

    if(!koderFound) {
        response.status(404)
        response.json({
            success: false,
            message: 'Koder Not Found'
        })
    }else {
        response.json({
            success: true,
            message: 'KoderFound',
            data: {
                koder: koderFound
            }
        })
    }
})

server.delete('/koders/:id', async (request, response) => {
    const {id} =  request.params
    const content = await readFilePromise('kodemia.json')

    const kodersFiltered = content.koders.filter(koder => koder.id !== parseInt(id))

    content.koders = kodersFiltered

    fs.writeFileSync('kodemia.json', JSON.stringify(content, null, 2), 'utf8')

    response.json({
        success: true,
        message: 'Koder Deleted'
    })
})

// Práctica:
// DELETE /koders/:id
// GET /koders/:id


// PUT /koders/:id



// fs + express
// leer del archivo koders.json y regresar los koders desde un metodo GET /koders
// GET /koders -> 
// POST /koders ->


// https://www.google.com/search?q=google&oq=goo&aqs=chrome.0.69i59j69i57j69i59j69i60l5.828j0j1&sourceid=chrome&ie=UTF-8



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