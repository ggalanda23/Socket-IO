const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/index.html");

});

// SocketId : username
const users = {};

io.on("connection", (socket) => {
  socket.on("new-connection", (username) => {
    users[socket.id] = username;
    io.emit("count-online", Object.keys(users).length);
  });

    socket.on("send-message", (message) => {
      
      // Who is the USER that sending message
      const username = users[socket.id];
      message = `${username}: ${message}`;
      io.emit("received-message", message);
  });

  socket.on("user-typing", () => {
    io.emit("user-typing", users[socket.id]);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("count-online", Object.keys(users).length);

})
})

const port = 5000;
server.listen(port, () => {
    console.log("Server is running on port:" + port); 
});
