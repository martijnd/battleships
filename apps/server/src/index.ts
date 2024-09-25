// src/server.ts
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config({});
// Create HTTP server
const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server running with TypeScript and ESM!\n");
});

// Initialize WebSocket server instance
const wss = new WebSocketServer({ server });

// Listen for WebSocket connections
wss.on("connection", (ws) => {
  console.log("New client connected");

  // Send a message to the client when they connect
  ws.send("Hello from TypeScript server!");

  // Receive messages from the client
  ws.on("message", (message: string) => {
    console.log(`Received: ${message}`);
    // Echo message back to client
    ws.send(`Server echo: ${message}`);
    // Broadcast the message to all connected clients except the sender
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`Broadcast: ${message}`);
      }
    });
  });

  // Handle client disconnection
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Start the server
server.listen(process.env.APP_PORT, () => {
  console.log(`Server is listening on port ${process.env.APP_PORT}`);
});
