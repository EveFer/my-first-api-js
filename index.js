const express = require('express');
const kodersRouter = require('./routers/koders')


// tener acceso al server- instanciar express
const server = express();


// middleware
server.use(express.json());

server.use('/koders', kodersRouter)


server.get('/', (request, response) => {
    response.json({
        success: true,
        message: 'API Kodemia v1.0.0'
    })
})


server.listen(8080, () => {
    console.log('listening on port: 8080')
})
