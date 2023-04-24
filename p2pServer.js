const webSocket = require("ws");
const { WebSocketServer } = require("ws");

let sockets = [];

const initConnection = (ws) => {
    sockets.push(ws);
    initErrorHandler(ws);
};

const getSockets = () => {
    return sockets;
};

const initErrorHandler = (ws) => {
    ws.on("close", () => {
        closeConnection(ws);
    });
    ws.on("error", () => {
        closeConnection(ws);
    });
};

const closeConnection = (ws) => {
    console.log(`Connection close ${ws.url}`);
    sockets.splice(sockets.indexOf(ws), 1);
};

const initP2PServer = (ws_port) => {
    const server = new WebSocketServer({ port: ws_port });
    server.on("connection", (ws) => {
        initConnection(ws);
    });
    server.on("error", (ws) => {
        console.log("error");
    });
    console.log("Listening webSocket port : " + ws_port);
};

const connectToPeers = (newPeers) => {
    newPeers.forEach((peer) => {
        const ws = new webSocket(peer);
        ws.on("open", () => {
            initConnection(ws);
        });
        ws.on("error", (error) => {
            console.log("connection Failed!" + error);
            return false;
        });
    });
};

module.exports = {
    initP2PServer,
    connectToPeers,
    getSockets,
};