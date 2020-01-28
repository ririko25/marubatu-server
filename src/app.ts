import * as express from "express";
import * as socketIO from "socket.io";

const app = express();
const port = 3333;

app.get("/", (_, res) => res.send("こんにちは!!!!"));

const server = app.listen(port, () => console.log(`ポート番号は ${port}だよ`));

// ↓ここからSocketIOの処理
const io = socketIO(server);
type BoardData = { board: string; lastPlay: number | null };

let currentBoard: BoardData = { board: "---------", lastPlay: null };

io.on("connection", function(socket) {
  console.log(`ユーザーが繋いできた[id:${socket.id}]`);

  // socket.emit("CHAT_MESSAGE", { name: "system", message: "helloかに" });

  socket.on("POST_MESSAGE", function(data) {
    console.log(`posted[name:${data.name},message:${data.message}]`);

    io.emit("CHAT_MESSAGE", data);
  });

  socket.on("BOARD", function(data: BoardData) {
    console.log(data);
    currentBoard = data;
    io.emit("BOARD", data);
  });

  socket.on("REQUEST_BOARD", function() {
    socket.emit("BOARD", currentBoard);
  });
});

// setInterval(function() {
//   io.emit("CHAT_MESSAGE", { name: "system", message: Date.now().toString() });
// }, 1000);
