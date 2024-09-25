export function setup({ onMessage }: { onMessage: (message: string) => void }) {
  // Initialize WebSocket connection to the server
  const socket = new WebSocket(import.meta.env.VITE_ENDPOINT_URL as string);

  // Connection opened
  socket.addEventListener("open", () => {
    console.log("Connected to WebSocket server");
  });

  // Listen for messages from the server
  socket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data);
    onMessage(event.data);
  });

  // Send message to the server
  function sendMessage(message: string) {
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
