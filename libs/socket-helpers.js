// count how many clients are connected
const countClients = ws => Object.keys(ws.sockets.connected).length;

module.exports = { countClients };