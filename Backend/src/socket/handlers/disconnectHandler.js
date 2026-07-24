const  {disconnect} = require("../services/disconnectService");
function registerDisconnectHandler(io, socket) {
  socket.on("disconnect", async () => {
      await  disconnect(io, socket);            
  });
}

module.exports = registerDisconnectHandler ;