const express = require('express');
const app = express();
const chalk = require('chalk');
const cors = require('cors');

app.use(cors());
const options = {
    cors: {
        origin: 'http://localhost:4200',
    },
};

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5000"); 
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, Access-Control-Allow-Credentials');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

const server = require('http').Server(app);
const io = require('socket.io')(server, options);



app.get('/', function (req, res) {
    res.send('Hello World!');
});



io.on('connection', function (socket) {

    const handshake = socket.id;

    let { nameRoom } = socket.handshake.query;
    console.log(`${chalk.green(`Nuevo dispositivo: ${handshake}`)} conectado a la ${nameRoom}`);
    socket.join(nameRoom)

    socket.on('evento', (res) => {
    // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje   
    socket.to(nameRoom).emit('evento', res);

    })


    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

server.listen(5000, function () {
    console.log('\n')
    console.log(`>> Socket listo y escuchando por el puerto: ${chalk.green('5000')}`)
})