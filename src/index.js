const path = require('path');
const http = require('http');

require('dotenv').config();
const express = require('express');
const socket = require('socket.io')

const { joinRoom, onDiceRolled, onHoldClicked, restartGame } = require('./utils/gameData');

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.set('view engine', 'ejs');

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/game', (req, res) => {
    res.render('pages/game');
});

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('USER_JOINED', (data) => {

        const { isError, roomData, errorMessage } = joinRoom({ socketId: socket.id, roomId: data.roomId, name: data.name });

        if (isError) {
            return;
        }
        socket.join(roomData.roomId);
        if (roomData.isPlaying) {
            io.to(roomData.roomId).emit('START_GAME', roomData);
        }
    });

    socket.on('DICE_ROLLED', (data) => {
        const roomData = onDiceRolled(data);
        io.to(roomData.roomId).emit('GAME_DATA', roomData);
    });

    socket.on('HOLD_CLICKED', (data) => {
        const roomData = onHoldClicked(data);
        io.to(roomData.roomId).emit('GAME_DATA', roomData);
    });

    socket.on('RESTART_GAME', (data) => {
        const roomData = restartGame(data);
        io.to(roomData.roomId).emit('START_GAME', roomData);
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`listening on *.${PORT}`);
});