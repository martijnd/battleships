// src/server.ts
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";
import { randomUUID } from "crypto";

dotenv.config();

interface Player<Initial extends boolean> {
  id: Initial extends true
    ? ReturnType<typeof randomUUID>
    : ReturnType<typeof randomUUID> | null;
  ready: boolean;
}

let games: Record<
  number,
  {
    player1: Player<true>;
    player2: Player<false>;
  }
> = {};

let clients: Record<string, WebSocket> = {};
// Create HTTP server
const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server running with TypeScript and ESM!\n");
});

// Initialize WebSocket server instance
const wss = new WebSocketServer({ server });

type Payload =
  | {
      type: "join";
      payload: {
        gameId: number;
      };
    }
  | {
      type: "player-joined";
      payload: null;
    }
  | {
      type: "ready";
      payload: null;
    }
  | {
      type: "fire";
      payload: {
        x: number;
        y: number;
      };
    };
// Listen for WebSocket connections
wss.on("connection", (ws) => {
  console.log("New client connected");
  const socketId = randomUUID();
  clients[socketId] = ws;
  ws.on("message", (data) => {
    handleMessage(JSON.parse(data.toString()) as Payload);
  });

  function handleMessage(data: Payload) {
    const { type, payload } = data;
    console.log({ type });
    switch (type) {
      case "join": {
        if (games[payload.gameId]) {
          games[payload.gameId].player2.id = socketId;
          const player1 = clients[games[payload.gameId].player1.id];
          player1.send(JSON.stringify({ type: "player-joined" }));
          // emit to both players
        } else {
          games[payload.gameId] = {
            player1: { id: socketId, ready: false },
            player2: { id: null, ready: false },
          };
        }
        console.log("game", games);
        break;
      }
      case "ready": {
        const game = Object.entries(games).find(
          ([, game]) =>
            game.player1.id === socketId || game.player2.id === socketId
        )?.[1];
        if (game) {
          if (game.player1.id === socketId) {
            game.player1.ready = true;
          } else {
            game.player2.ready = true;
          }
          if (game.player1.ready && game.player2.id && game.player2.ready) {
            // start the game
            clients[game.player1.id].send(JSON.stringify({ type: "start" }));
            clients[game.player2.id].send(JSON.stringify({ type: "start" }));
          }
        }
        break;
      }
      case "fire": {
        const game = Object.entries(games).find(
          ([, game]) =>
            game.player1.id === socketId || game.player2.id === socketId
        )?.[1];
        if (game) {
          const opponentId =
            game.player1.id === socketId ? game.player2.id : game.player1.id;
          if (opponentId) {
            clients[opponentId].send(
              JSON.stringify({ type: "player-fired", payload })
            );
          }
        }
        break;
      }
    }
  }

  // Handle client disconnection
  ws.on("close", () => {
    console.log("Client disconnected");
    delete clients[socketId];
    // also delete game if any player is disconnected
    const gameId = Object.entries(games).find(
      ([, game]) => game.player1.id === socketId || game.player2.id === socketId
    )?.[0];
    if (gameId) {
      delete games[parseInt(gameId)];
    }
  });
});

// Start the server
server.listen(process.env.APP_PORT, () => {
  console.log(`Server is listening on port ${process.env.APP_PORT}`);
});
