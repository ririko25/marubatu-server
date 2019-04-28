import * as express from "express";
import * as socketIO from "socket.io";

const app = express();
const port = 3333;

app.get("/", (_, res) => res.send("こんにちは!!!!"));

const server = app.listen(port, () => console.log(`ポート番号は ${port}だよ`));

// ↓ここからSocketIOの処理
const io = socketIO(server);

io.on("connection", function(socket) {
  console.log(`ユーザーが繋いできた[id:${socket.id}]`);

  socket.emit("CHAT_MESSAGE", { name: "system", message: "helloかに" });

  socket.on("POST_MESSAGE", function(data) {
    console.log(`posted[name:${data.name},message:${data.message}]`);

    io.emit("CHAT_MESSAGE", data);
  });

  socket.on("BOARD", function(data: { board: string }) {
    io.emit("BOARD", data);
  });
});
