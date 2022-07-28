let clientInstance = new Colyseus.Client('ws://localhost:2567');
let roomState;
let sampleState;

function init() {
    clientInstance.joinOrCreate("golf").then(room => {
        roomState = room;
        console.log(room.sessionId, "joined", room.name);
        registerListener(room);
    }).catch(e => {
        console.log("JOIN create ERROR", e);
    });
}

function gameReady(gameState) {
    for (let index = 0; index < gameState.length; index++) {
        const element = gameState[index];
        renderImage(element.id, element.avatar, element.x, element.y);
    }
}

function renderImage(id, image, x, y) {
    const gameBoard = document.getElementById('game-board');
    const img = document.createElement('img');
    img.src = image;
    img.id = id;
    img.width = 100;
    img.height = 100;
    gameBoard.appendChild(img);
    moveImage(id,x,y);
}

function moveImage(id, x, y) {
    var el = $(`#${id}`);
    el.css('position', 'absolute');
    el.css("left", x);
    el.css("top", y);
    console.log("pos", x, y)
}

function registerListener(roomInstance) {
    if (!roomInstance) return null;

    roomInstance.onMessage('ready', (message) => {
        console.log("All user joind : ", message);
        gameReady(message.result)
    });

    roomInstance.onMessage('onMove', (message) => {
        console.log("Message is : ", message);
    });

    roomInstance.onStateChange((state) => {
        let playerEntries = Array.from(state.players.entries());
        let players = [];
        for (let index = 0; index < playerEntries.length; index++) {
            const id = playerEntries[index][0];
            const element = state.players.get(id);
            players.push(id);
            if (roomInstance.sessionId == id) {
                console.log(`My Location is : ${id}`, element.x, element.y);
            } else {
                console.log(`Other Player Location is : ${id}`, element.x, element.y);
            }
            moveImage(id,element.x,element.y);
        }
        // state.players.forEach(element => {
        //     console.log(element.x, element.y);
        //     // console.log("POS Y is", element.x);
        // });
        sampleState = state;
    });
}

window.addEventListener("click", function (event) {
    let pos = {
        x: event.clientX,
        y: event.clientY
    };
    if (roomState) {
        roomState.send('onMove', { pos });
    }
});

init();
