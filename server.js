const express = require('express');
const app = express();
const server = require('http').Server(app);
const cors = require('cors')

app.use(cors());
const options = {
    cors: {
        origin: 'http://localhost:4200',
    },
};

const socketIo = require('socket.io')(server, options);


socketIo.on('connection', (socket) => {

    //generar id cada que una persona se conecte
    const idHandShake = socket.id;

    const { nameRoom } = socket.handshake.query;

    console.log(`Dispositivo ${idHandShake} se unió a ${nameRoom}`);

    // Unirlos a un grupo
    socket.join();

    socket.on('event', (res) => {

        const data = res;
        console.log(data);

        socket.to(nameRoom).emit('event', data);
    })


})

app.set('port', process.env.PORT || 3000);

if (process.env.NODE_ENV !== 'test') {
    app.listen(app.get('port'), () => {
        console.log('Server on port ' + app.get('port') + ' on dev');
    });
}

module.exports = app;