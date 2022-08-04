let clientInstance = new Colyseus.Client('ws://localhost:2567');
let roomState;



function hideElementByID(id) {
    const elementRef = document.getElementById(id);
    elementRef.style.display = 'none';
}

function showElementByID(id) {
    const elementRef = document.getElementById(id);
    elementRef.style.display = 'block'; 
}

async function joinRoom() {
    const roomId = document.getElementById('room-id');
    const sessionId = document.getElementById('session-id');
    
    if(roomId.value && sessionId.value) {
        console.log(roomId.value);
        console.log(sessionId.value);
        try {
            const room = await clientInstance.reconnect(roomId.value, sessionId.value);
            roomState = room;
        } catch (error) {
            alert("Couldn't Re - Join the match");
            console.log("RE-JOIN create ERROR", error);
        }
        
        
        return null;
    
    }
    
    clientInstance.joinOrCreate("golf").then(room => {
        roomState = room;
        console.log(room.sessionId, "joined", room.name);
        showElementByID('wait-text');
        hideElementByID('join-button');
        hideElementByID('form-data');
        registerListener(room);
    }).catch(e => {
        alert("Couldn't join the match");
        console.log("JOIN create ERROR", e);
    });
}

function gameReady(gameState, myId) {
    let playerIndex = 1;
    for (let index = 0; index < gameState.length; index++) {
        const element = gameState[index];
        let title = 'Player' + playerIndex;
        if (element.id == myId) {
            title = 'mine';
        } else {
            playerIndex++;
        }
        hideElementByID('wait-text');
        hideElementByID('join-button');
        hideElementByID('form-data');
        renderImage(element.id, element.avatar, element.x, element.y, title);

    }
}

function renderImage(id, image, x, y, text) {
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
    gameBoard.appendChild(divImage);
    moveImage(id, x, y);
}

function moveImage(id, x, y) {
    var el = $(`#${id}`);
    el.css('position', 'absolute');
    el.css("left", x);
    el.css("top", y);
    // const ele = document.getElementById(id);
    // if(!ele) return null; 
    // ele.style.position = 'absolute';
    // ele.style.left = x;
    // ele.style.top = y;
    
}

function registerListener(roomInstance) {
    if (!roomInstance) return null;

    // Event will be fired once the All Players are joined
    roomInstance.onMessage('ready', (message) => {
        console.log("All user joind : ", message);
        gameReady(message.result, roomInstance.sessionId);
    });

    // Event will be fired once the Any Player Left the room
    roomInstance.onMessage('playerLeft', (message) => {
        alert(`Player Left the Room with id ${message.id}`);
        window.location.reload();
        console.log(message);
    });

    // Event will be fired All State Changes
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
            moveImage(id, element.x, element.y);
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

