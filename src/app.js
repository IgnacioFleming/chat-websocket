import express from "express";
import viewsRouter from "./routes/views.js";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";

const app = express();
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));
app.use("/", viewsRouter);

const server = app.listen(8080, () => {
  console.log("Levantado el servidor 8080");
});

const io = new Server(server);

let messages = [];
io.on("connection", (socket) => {
  console.log("cliente conectado");
  socket.on("message", (data) => {
    messages.push(data);
    io.emit("messageLogs", messages);
  });
  socket.on("userConected", (data) => {
    socket.broadcast.emit("userConectedMessage", data);
  });
});
