import { IncomingEvent, OutgoingEvent } from "../enums/Event";

export function setup({
  onConnected,
  onEvent,
}: {
  onConnected: () => void;
  onEvent: (type: IncomingEvent, payload: any) => void;
}) {
  // Initialize WebSocket connection to the server
  const socket = new WebSocket(import.meta.env.VITE_ENDPOINT_URL as string);

  // Connection opened
  socket.addEventListener("open", () => {
    console.log("Connected to WebSocket server");
    onConnected();
  });

  // Listen for messages from the server
  socket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data);
    const data = JSON.parse(event.data);
    onEvent(data.type, data.payload);
  });

  // Send message to the server
  function sendMessage(type: OutgoingEvent, payload: unknown) {
    const message = JSON.stringify({ type, payload });
    socket.send(message);
    console.log(`Sent to server: ${message}`);
  }

  // Handle connection close
  socket.addEventListener("close", () => {
    console.log("Disconnected from WebSocket server");
  });

  return {
    sendMessage,
  };
}
