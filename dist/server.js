"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@colyseus/core");
const ws_transport_1 = require("@colyseus/ws-transport");
const http_1 = require("http");
const monitor_1 = require("@colyseus/monitor");
const express_1 = __importDefault(require("express"));
const game_room_1 = require("./game_room");
const port = Number(process.env.port) || 2567;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/colyseus", (0, monitor_1.monitor)());
const server = (0, http_1.createServer)(app);
const gameServer = new core_1.Server({
    transport: new ws_transport_1.WebSocketTransport({
        server
    })
});
gameServer.define("golf", game_room_1.GameRoom, { maxClients: 2 });
gameServer.listen(port).then(() => console.log(`Server Running on ${port}`));
//# sourceMappingURL=server.js.map