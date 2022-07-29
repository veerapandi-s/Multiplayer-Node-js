import { Room, Client } from "colyseus";
import { Schema, MapSchema } from "@colyseus/schema";
export declare class Player extends Schema {
    x: number;
    y: number;
    avatar: string;
}
export declare class GameState extends Schema {
    players: MapSchema<Player, string>;
}
export declare class GameRoom extends Room<GameState> {
    onCreate(options: any): void;
    onAuth(client: Client, options: any): boolean;
    onJoin(client: Client, options: any): void;
    onLeave(client: Client): void;
}
