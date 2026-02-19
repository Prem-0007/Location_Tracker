const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send-location", (data) => {
    io.emit("receive-location", {
      id: socket.id,
      latitude: data.latitude,
      longitude: data.longitude
    });
  });

  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
  });
});

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
