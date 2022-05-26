const WebSocketServer = require('websocket').server;
const express = require('express');
const http = require('http');
const cors = require('cors');
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
const {
    response
} = require('express');
const {
    urlencoded
} = require('express');
const {
    get
} = require('express/lib/response');

let process = new Spawn();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(urlencoded());
app.use(cors({
    origin: 'http://localhost:3000'
}));

server.listen(port, () => {
    console.log(`http server listening on port ${port}`);
});
const wsServer = new WebSocketServer({
    httpServer: server
});

app
    .get('/temperature', async (req, res) => {
        const coded = await fs.readFile('./params.json');
        const data = JSON.parse(coded);

        const response = {
            tempSET: data.tempSetPoint,
            tempHIS: data.tempHist
        }
        res.json(response)
    })

    .get('/loop', async (req, res) => {

    })

    .get('/process/:action', async (req, res) => {
        const action = req.params;
    })

    .get('/devices/:device/:action', async (req, res) => {

    })

    .post('/loop', async (req, res) => {

    })

    .post('/temperature', async (req, res) => {
        const data = req.body;
        const coded = await fs.readFile('./params.json');
        const decoded = JSON.parse(coded);
        const newData = {
            ...decoded,
            tempSetPoint: data.tempSET,
            tempHist: data.tempHIS
        }
        const toSave = JSON.stringify(newData);
        await fs.writeFile('./params.json', toSave)
        process.killProcess();
        process = new Spawn();
    })


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
    connection.on('close', function (reasonCode, description) {
        console.log('connection closed')
        clearInterval(dataLoop)
    })
});
