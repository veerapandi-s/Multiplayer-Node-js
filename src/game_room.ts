import { Room, Client } from "colyseus";
import { Schema, MapSchema, type } from "@colyseus/schema";
import { plyarInitailState } from "./default";


// An abstract player object, demonstrating a potential 2D world position
export class Player extends Schema {
  @type("number")
  x: number = 100;

  @type("number")
  y: number = 100;

  @type("string")
  avatar: string = 'https://image.similarpng.com/very-thumbnail/2020/08/3D-soccer-ball-on-transparent-background-PNG.png';
}

// Our custom game state, an ArraySchema of type Player only at the moment
export class GameState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();
}

export class GameRoom extends Room<GameState> {
  // Colyseus will invoke when creating the room instance
  onCreate(options: any) {
    // initialize empty room state
    this.setState(new GameState());
    this.maxClients = options.maxClients;

    // Called every time this room receives a "move" message
    this.onMessage("onMove", (client, data) => {
      console.log("Data is : ", data);

      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      console.log(this.state.players);
      player.x = data.pos.x;
      player.y = data.pos.y;
      console.log(client.sessionId + " at, x: " + player.x, "y: " + player.y);
    });
  }
  // Authorize client based on provided options before WebSocket handshake is complete
  onAuth(client: Client, options: any) {
    return true;
  }

  // Called every time a client joins
  onJoin(client: Client, options: any) {
    const playerDefaultStates = plyarInitailState[this.clients.length-1];
    const playerInitialState = new Player();
    playerInitialState.x = playerDefaultStates.x;
    playerInitialState.y = playerDefaultStates.y;
    playerInitialState.avatar = playerDefaultStates.avatar;

    if (this.clients.length == this.maxClients) {
      this.state.players.set(client.sessionId, playerInitialState);
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
    } else {
      this.state.players.set(client.sessionId, playerInitialState);
    }

  }

  onLeave(client: Client) {
    this.broadcast('playerLeft', { id : client.sessionId });
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId);
    }
  }

}