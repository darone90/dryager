const WebSocketServer = require('websocket').server;
const express = require('express');
const http = require('http');
const fs = require('fs').promises;
const {
    spawn
} = require('child_process');
    const {
    Spawn
    } = require('./Spawn');
const {
    port
} = require('./app.config');

const app = express();
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`http server listening on port ${port}`);
});
const wsServer = new WebSocketServer({
    httpServer: server
});

// const process = new Spawn();

// setTimeout(() => {
//     process.killProcess();
//     }, 20000)

wsServer.on('request', function (request) {
    const connection = request.accept('dryager-protocol', request.origin);

    const dataLoop = setInterval(() => {
                let message;
        const spawned = spawn('python', ['../python/Test.py'])
        spawned.stdout.on('data', async (data) => {
                        message = data.toString('utf-8');
                        const status = await fs.readFile('./python/devices.json');
                        const decoded = JSON.parse(status);
                        const response = {
                            ...decoded,
                            message
                        }
                        const coded = JSON.stringify(response)
                        connection.send(coded);
        })
    }, 2000);

    connection.on('message', (data) => {
    });

    connection.on('close', function (reasonCode, description) {
        console.log('connection closed')
        clearInterval(dataLoop)
    })
});
