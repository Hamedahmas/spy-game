const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const animals = require("./animals");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;
app.use(express.static("public"));

let rooms = {};

io.on("connection", (socket) => {
  console.log("🟢 New connection:", socket.id);

  socket.on("create-room", ({ roomId, playerCount }) => {
    rooms[roomId] = {
      players: [],
      playerCount,
      codes: {},
      spyId: null,
      stage: "waiting",
    };
    socket.join(roomId);
    socket.emit("room-created", { roomId });
  });

  socket.on("join-room", ({ roomId }) => {
    const room = rooms[roomId];
    if (!room || room.players.length >= room.playerCount) return;

    const animalName = animals[room.players.length];
    const player = { id: socket.id, animal: animalName };
    room.players.push(player);
    socket.join(roomId);
    socket.emit("joined-room", { animal: animalName, total: room.playerCount });

    if (room.players.length === room.playerCount) {
      const spyIndex = Math.floor(Math.random() * room.playerCount);
      room.spyId = room.players[spyIndex].id;
      io.to(roomId).emit("start-code-phase", { duration: 180 });
    }
  });

  socket.on("send-code", ({ roomId, targetId, code }) => {
    const room = rooms[roomId];
    if (!room) return;
    if (!room.codes[targetId]) room.codes[targetId] = [];
    room.codes[targetId].push(code);

    io.to(targetId).emit("receive-code", { code });
  });

  socket.on("start-chat", ({ roomId }) => {
    io.to(roomId).emit("chat-started");
  });

  socket.on("send-message", ({ roomId, msg, from }) => {
    io.to(roomId).emit("receive-message", { msg, from });
  });

  socket.on("reveal-vote-phase", ({ roomId }) => {
    io.to(roomId).emit("vote-started", { duration: 120 });
  });

  socket.on("vote", ({ roomId, votedId }) => {
    const room = rooms[roomId];
    if (!room.votes) room.votes = {};
    if (!room.votes[votedId]) room.votes[votedId] = 0;
    room.votes[votedId] += 1;
  });

  socket.on("reveal-result", ({ roomId }) => {
    const room = rooms[roomId];
    const votes = room.votes || {};
    let maxVotes = 0;
    let suspect = null;
    for (const id in votes) {
      if (votes[id] > maxVotes) {
        maxVotes = votes[id];
        suspect = id;
      }
    }

    const spy = room.spyId;
    const result = suspect === spy ? "بازیکن‌ها بردن!" : "جاسوس برد!";
    io.to(roomId).emit("game-result", { result, spyAnimal: getAnimalById(room, spy) });
  });

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
  });
});

function getAnimalById(room, id) {
  const p = room.players.find((pl) => pl.id === id);
  return p ? p.animal : "نامشخص";
}

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
