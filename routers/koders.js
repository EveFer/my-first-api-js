const express = require('express')
const router = express.Router()
const fs = require('fs');

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

// Query params
router.get('/', async (request, response) => {
    // console.log(request.query)
    const {generation, gender, name, count} = request.query
    console.log(count)
    const content = await readFilePromise('kodemia.json')

    let kodersData = content.koders

    // string -> true
    // indefinido -> false
    if(generation) {
      kodersData = kodersData.filter(koder => koder.generation === parseInt(generation))
    }
    
    if(gender) {
        // const dataToFilter = kodersData || content.koders
        kodersData = kodersData.filter(koder => koder.gender === gender)
    }

    if(name) {
        // const dataToFilter = kodersData || content.koders
        kodersData = kodersData.filter(koder => koder.name === name)
    }

    if(count) {
        kodersData = kodersData.slice(0, parseInt(count))
    }
    
    content.koders = kodersData || content.koders

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


router.post('/', async (request, response) => {
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
router.patch('/:id', async (request, response) => {
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

router.get('/:id', async (request, response) => {
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

router.delete('/:id', async (request, response) => {
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

module.exports = router