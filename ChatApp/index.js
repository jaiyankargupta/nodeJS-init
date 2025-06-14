const http = require("http");
const express = require("express");
const app = express();
const path = require("path");
const { Server } = require("socket.io");
const server = http.createServer(app);

app.use(express.static(path.resolve("./public")));
const io = new Server(server);

//handle socket io

io.on("connection", (socket) => {
  socket.on("user-message", (message) => {
    console.log(message);
    io.emit("message", message);
  });
});
app.get("/", (req, res) => {
  return res.sendFile("/public/index.html");
});
server.listen(9000, () => {
  console.log("listening.. at 9000");
});
