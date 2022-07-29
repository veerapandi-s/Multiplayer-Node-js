let clientInstance = new Colyseus.Client('ws://localhost:2567');
let roomState;

function init() {
    clientInstance.joinOrCreate("golf").then(room => {
        roomState = room;
        console.log(room.sessionId, "joined", room.name);
        registerListener(room);
    }).catch(e => {
        console.log("JOIN create ERROR", e);
    });
}

function gameReady(gameState, myId) {
    let playerIndex = 1;
    for (let index = 0; index < gameState.length; index++) {
        const element = gameState[index];
        let title = 'Player' + playerIndex;
        if(element.id == myId) {
            title = 'mine';
        } else {
            playerIndex++;
        }
        renderImage(element.id, element.avatar, element.x, element.y,title);

    }
}

function renderImage(id, image, x, y,text) {
    const gameBoard = document.getElementById('game-board');
    const img = document.createElement('img');
    img.src = image;
    img.id = 'img' + id;
    img.width = 100;
    img.height = 100;
    const name = document.createElement('p');
    name.innerText = text;
    const divImage = document.createElement('div');
    divImage.classList.add('img-with-text');
    divImage.appendChild(img);
    divImage.appendChild(name);
    divImage.id = id;
//     <div class="img-with-text">
//     <img src="yourimage.jpg" alt="sometext" />
//     <p>Some text</p>
// </div>

    gameBoard.appendChild(divImage);
    moveImage(id,x,y);
}

function moveImage(id, x, y) {
    var el = $(`#${id}`);
    el.css('position', 'absolute');
    el.css("left", x);
    el.css("top", y);
}

function registerListener(roomInstance) {
    if (!roomInstance) return null;
    
        
    roomInstance.onMessage('ready', (message) => {
        console.log("All user joind : ", message);
        gameReady(message.result, roomInstance.sessionId);
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
