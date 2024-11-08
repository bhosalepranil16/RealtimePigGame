console.log('index.js loaded');

const $newGameButton = document.querySelector('.btn-new-game');
const $joinGameButton = document.querySelector('.btn-join-game');
const $nameInput = document.querySelector('.input-name');
const $roomIdInput = document.querySelector('.input-roomId');

function create_UUID() {
    // Get the current time in milliseconds since the Unix epoch.
    let dt = new Date().getTime();
    // Replace the placeholders in the UUID template with random hexadecimal characters.
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        // Generate a random hexadecimal digit.
        const r = (dt + Math.random() * 16) % 16 | 0;
        // Update dt to simulate passage of time for the next random character.
        dt = Math.floor(dt / 16);
        // Replace 'x' with a random digit and 'y' with a specific digit (4 for UUID version 4).
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    // Return the generated UUID.
    return uuid;
}

$newGameButton.addEventListener('click', () => {
    const uuid = create_UUID();
    const name = $nameInput.value.trim();

    if(!name) {
        alert('Please enter a valid name');
        return;
    }

    window.location.href = `/game?roomId=${uuid}&name=${name}`;
});

$joinGameButton.addEventListener('click', () => {
    const name = $nameInput.value.trim();
    const roomId = $roomIdInput.value.trim();

    if(!name) {
        alert('Please enter a valid name');
        return;
    }

    if(!roomId) {
        alert('Please enter a valid room id');
        return;
    }
    window.location.href = `/game?roomId=${roomId}&name=${name}`;
});
