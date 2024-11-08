const gameData = [];

const playerObject = {
    finalScore: 0,
    socketId: null,
    name: null
}

const gameObject = {
    players: [],
    isPlaying: false,
    score: 0,
    activePlayer: 0,
    diceValue: 0,
    roomId: null
};

export const joinRoom = (data) => {
    let isError = false;
    let errorMessage = '';
    const isRoomPresent = gameData.find((game) => game.roomId === data.roomId);
    if (isRoomPresent) {
        if (isRoomPresent.players.length >= 2) {
            isError = true;
            errorMessage = 'room is full';
            console.log(isError, errorMessage);
            return { isError, isRoomPresent, errorMessage };
        } else {
            isRoomPresent.players.push({
                socketId: data.socketId,
                name: data.name,
                finalScore: 0
            });
        }
        if (isRoomPresent.players.length === 2) {
            isRoomPresent.isPlaying = true;
        }
        const roomData = {
            ...isRoomPresent,
            players: [...isRoomPresent.players]
        }
        return { isError, roomData };
    } else {
        const roomData = {
            ...gameObject,
            roomId: data.roomId,
            players: [
                {
                    socketId: data.socketId,
                    name: data.name,
                    finalScore: 0
                }
            ]
        }
        if (roomData.players.length === 2) {
            roomData.isPlaying = true;
        }
        gameData.push(roomData);
        return { isError, roomData };
    }
};


export const onDiceRolled = (data) => {
    const diceValue = Math.floor((Math.random() * 6)) + 1;
    const roomData = gameData.find((game) => game.roomId === data.roomId);

    roomData.diceValue = diceValue;

    if (diceValue === 1) {
        return nextPlayer(roomData);
    } else {
        roomData.score += diceValue;
        return { ...roomData };
    }
}

export const onHoldClicked = (data) => {
    const roomData = gameData.find((game) => game.roomId === data.roomId);
    roomData.players[roomData.activePlayer].finalScore += roomData.score;
    if (roomData.players[roomData.activePlayer].finalScore >= 100) {
        roomData.isPlaying = false;
        roomData.score = 0;
        return { ...roomData };
    }
    return nextPlayer(roomData);
}

export const nextPlayer = (roomData) => {
    roomData.score = 0;
    if (roomData.activePlayer === 0) {
        roomData.activePlayer = 1;
    } else {
        roomData.activePlayer = 0;
    }
    return { ...roomData };
}

export const restartGame = (data) => {
    const roomData = gameData.find((game) => game.roomId === data.roomId);
    roomData.players[0].finalScore = 0;
    roomData.players[1].finalScore = 0;
    roomData.activePlayer = 0;
    roomData.diceValue = 0;
    roomData.score = 0;
    roomData.isPlaying = true;
    return { ...roomData };
}


export default { joinRoom, onDiceRolled, nextPlayer, onHoldClicked, restartGame };
