"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoom = exports.GameState = exports.Player = void 0;
const colyseus_1 = require("colyseus");
const schema_1 = require("@colyseus/schema");
const default_1 = require("./default");
class Player extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.x = 100;
        this.y = 100;
        this.avatar = 'https://image.similarpng.com/very-thumbnail/2020/08/3D-soccer-ball-on-transparent-background-PNG.png';
    }
}
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "x", void 0);
__decorate([
    (0, schema_1.type)("number")
], Player.prototype, "y", void 0);
__decorate([
    (0, schema_1.type)("string")
], Player.prototype, "avatar", void 0);
exports.Player = Player;
class GameState extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.players = new schema_1.MapSchema();
    }
}
__decorate([
    (0, schema_1.type)({ map: Player })
], GameState.prototype, "players", void 0);
exports.GameState = GameState;
class GameRoom extends colyseus_1.Room {
    onCreate(options) {
        this.setState(new GameState());
        this.maxClients = options.maxClients;
        this.onMessage("onMove", (client, data) => {
            const player = this.state.players.get(client.sessionId);
            if (!player)
                return;
            console.log(this.state.players);
            player.x = data.pos.x;
            player.y = data.pos.y;
        });
    }
    onAuth(client, options) {
        return true;
    }
    onJoin(client, options) {
        if (this.clients.length == this.maxClients) {
            const playerData = default_1.plyarInitailState[this.clients.length];
            const nextPlayer = new Player();
            nextPlayer.x = playerData.x;
            nextPlayer.y = playerData.y;
            nextPlayer.avatar = playerData.avatar;
            this.state.players.set(client.sessionId, nextPlayer);
            let toSendData = [];
            for (let index = 0; index < this.clients.length; index++) {
                const element = this.clients[index];
                let playerState = this.state.players.get(element.id);
                if (playerState)
                    toSendData.push({
                        id: element.id,
                        x: playerState.x,
                        y: playerState.y,
                        avatar: playerState.avatar
                    });
            }
            this.broadcast('ready', { result: toSendData });
        }
        else {
            const playerData = default_1.plyarInitailState[this.clients.length];
            const nextPlayer = new Player();
            nextPlayer.x = playerData.x;
            nextPlayer.y = playerData.y;
            nextPlayer.avatar = playerData.avatar;
            this.state.players.set(client.sessionId, nextPlayer);
        }
    }
    onLeave(client) {
        if (this.state.players.has(client.sessionId)) {
            this.state.players.delete(client.sessionId);
        }
    }
}
exports.GameRoom = GameRoom;
//# sourceMappingURL=game_room.js.map