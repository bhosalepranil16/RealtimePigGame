const socket = io();

let gameData = {
    players: [],
    isPlaying: false,
    score: 0,
    activePlayer: 0,
    diceValue: 0,
    roomId: null
};

let diceDOM = document.querySelector('#dice-2');
diceDOM.style.display = 'none';

let btnRoll = document.querySelector('.btn-roll');
let btnHold = document.querySelector('.btn-hold');
let btnNew = document.querySelector('.btn-new');


const params = new URLSearchParams(window.location.search);
const roomId = params.get("roomId");
const name = params.get("name");
if (!roomId || !name) {
    window.location.href = "/";
}
socket.emit('USER_JOINED', { roomId, name });


socket.on('START_GAME', (data) => {
    gameData = { ...data };
    const { players, activePlayer } = gameData;

    const myPlayerIndex = players.findIndex((player) => player.socketId === socket.id);

    document.querySelector('#score-0').textContent = '0';
    document.querySelector('#score-1').textContent = '0';
    document.querySelector('#current-0').textContent = '0';
    document.querySelector('#current-1').textContent = '0';
    document.querySelector('#name-0').textContent = players[0].name;
    document.querySelector('#name-1').textContent = players[1].name;
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.add('active');

    btnNew.style.display = 'none';

    if (myPlayerIndex === activePlayer) {
        btnRoll.style.display = 'block';
        btnHold.style.display = 'block';
    } else {
        btnRoll.style.display = 'none';
        btnHold.style.display = 'none';
    }
});

socket.on('GAME_DATA', (data) => {
    console.log(data);
    gameData = { ...data };
    const { diceValue, score, activePlayer, players } = gameData;
    let notActivePlayer;

    const myPlayerIndex = players.findIndex((player) => player.socketId === socket.id);

    if (activePlayer === 0) {
        notActivePlayer = 1;
    } else {
        notActivePlayer = 0;
    }

    diceDOM.style.display = 'block';
    diceDOM.src = `../images/dice-${diceValue}.png`;

    document.querySelector(`#score-${activePlayer}`).textContent = players[activePlayer].finalScore;
    document.querySelector(`#current-${activePlayer}`).textContent = score;

    if (players[activePlayer].finalScore >= 100) {
        document.querySelector(`#name-${activePlayer}`).textContent = 'Winner!!';
        document.querySelector(`.player-${activePlayer}-panel`).classList.add('winner');
        document.querySelector(`.player-${activePlayer}-panel`).classList.remove('active');
        btnNew.style.display = 'block';
        diceDOM.style.display = 'none';
        btnRoll.style.display = 'none';
        btnHold.style.display = 'none';
        return;
    }

    document.querySelector(`#score-${notActivePlayer}`).textContent = players[notActivePlayer].finalScore;
    document.querySelector(`#current-${notActivePlayer}`).textContent = '0';
    document.querySelector(`.player-${activePlayer}-panel`).classList.add('active');
    document.querySelector(`.player-${notActivePlayer}-panel`).classList.remove('active');

    if (myPlayerIndex === activePlayer) {
        btnRoll.style.display = 'block';
        btnHold.style.display = 'block';
    } else {
        btnRoll.style.display = 'none';
        btnHold.style.display = 'none';
    }
});

btnRoll.addEventListener('click', function (e) {
    e.preventDefault();
    const { players, isPlaying, activePlayer } = gameData;
    const myPlayerIndex = players.findIndex((player) => player.socketId === socket.id);
    if (isPlaying && activePlayer === myPlayerIndex) {
        socket.emit('DICE_ROLLED', { roomId });
    }
});

btnHold.addEventListener('click', function (e) {
    e.preventDefault();
    const { players, isPlaying, activePlayer } = gameData;
    const myPlayerIndex = players.findIndex((player) => player.socketId === socket.id);
    if (isPlaying && activePlayer === myPlayerIndex) {
        socket.emit('HOLD_CLICKED', { roomId });
    }
});

btnNew.addEventListener('click', function (e) {
    e.preventDefault();
    const { isPlaying } = gameData;
    if (!isPlaying) {
        socket.emit('RESTART_GAME', { roomId });
    }
});


