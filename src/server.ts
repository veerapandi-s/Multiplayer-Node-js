// Colyseus + Express
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport"
import { createServer } from "http";
import { monitor } from "@colyseus/monitor";

import express from "express";
import { GameRoom } from "./game_room";
import { RedisPresence } from "colyseus";
const port = Number(process.env.port) || 2567;

const app = express();
app.use(express.json());

app.use("/colyseus", monitor());

const server = createServer(app); // create the http server manually

const gameServer = new Server({
  // presence: new RedisPresence(),
  transport: new WebSocketTransport({
      server // provide the custom server for `WebSocketTransport`
  })
});

// Define "golf" room
gameServer.define("golf", GameRoom, {maxClients : 2});

gameServer.listen(port).then(() => console.log(`Server Running on ${port}`));