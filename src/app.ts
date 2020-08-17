import * as express from "express";
import * as socketIO from "socket.io";
import Message from "./message";
import State from "./state";

const app = express();
const port = 3333;

app.get("/", (_, res) => res.send("こんにちは!!!!"));

const server = app.listen(port, () => console.log(`ポート番号は ${port}だよ`));

// ↓ここからSocketIOの処理
const io = socketIO(server);

const state = new State();
type BoardData = { board: string; lastPlay: number | null };

let currentBoard: BoardData = { board: "---------", lastPlay: null };

io.on("connection", function (socket) {
  console.log(`ユーザーが繋いできた[id:${socket.id}]`);

  socket.on("disconnecting", (reason) => {
    console.log(`ユーザーが切断した[id:${socket.id}, reason:${reason}]`);
    state.removeUser(socket.id);
  });

  socket.on("JOIN_ROOM", function (data: { team: string }) {
    socket.join(data.team);
    state.addUser(socket.id, data.team);
  });

  socket.on("LEAVE_ROOM", function () {
    socket.leaveAll();
    state.removeUser(socket.id);
  });

  socket.on("GET_ALL_MESSAGES", function () {
    const team = state.users.get(socket.id);
    socket.emit("ALL_MESSAGES", state.getTeamMessages(team));
  });

  socket.on("POST_MESSAGE", function (msg: Message) {
    console.log(`posted[user:${msg.user}, team:${msg.team}, text:${msg.text}]`);

    state.addMessage({ id: socket.id, ...msg });

    // for team function
    // io.in(msg.team).emit("CHAT_MESSAGE", msg);
    io.emit("CHAT_MESSAGE", msg);
  });

  socket.on("BOARD", function (data: BoardData) {
    console.log(data);
    currentBoard = data;
    io.emit("BOARD", data);
  });

  socket.on("REQUEST_BOARD", function () {
    socket.emit("BOARD", currentBoard);
  });
});
