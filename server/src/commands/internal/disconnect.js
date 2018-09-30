/*
  Description: This module will be directly called by the server event handler
               when a socket connection is closed or lost.
*/

// module main
exports.run = async (core, server, socket, data) => {
  if (data.cmdKey !== server._cmdKey) {
    // internal command attempt by client, increase rate limit chance and ignore
    return server._police.frisk(socket.remoteAddress, 20);
  }

  // send leave notice to client peers
  if (socket.channel) {
    server.broadcast({
      cmd: 'onlineRemove',
      nick: socket.nick
    }, { channel: socket.channel });
  }

  // commit close just in case
  socket.terminate();
};

// module meta
exports.requiredData = ['cmdKey'];
exports.info = {
  name: 'disconnect',
  usage: 'Internal Use Only',
  description: 'Internally used to relay `onlineRemove` event to clients'
};
