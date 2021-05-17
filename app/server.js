const express = require('express');
const app = express();
const server = require('http').Server(app);
const socket = require('socket.io')(server);

