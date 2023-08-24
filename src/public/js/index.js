const socket = io();
let user = "";
const chatbox = document.getElementById("chatbox");
Swal.fire({
  title: "Autenticación",
  input: "text",
  text: "Ingresá el usuario con el que te identificarás en el chat",
  inputValidator: (value) => {
    return !value && "Necesitás escribir un nombre de usuario para acceder";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  socket.emit("userConected", {
    message: `El usuario ${user} se ha conectado`,
  });
});
socket.on("userConectedMessage", (data) => {
  if (!user) return;
  Swal.fire({
    title: data.message,
    text: "Nuevo Usuario Conectado",
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 3000,
  });
});

chatbox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (chatbox.value.trim().length > 0) {
      socket.emit("message", { user, message: chatbox.value });
      chatbox.value = "";
    }
  }
});

socket.on("messageLogs", (data) => {
  if (!user) return;
  let messageLogs = document.getElementById("messageLogs");
  let messages = "";
  data.forEach((message) => {
    messages += `El usuario ${message.user} dice: ${message.message}<br/>`;
  });
  messageLogs.innerHTML = messages;
});
