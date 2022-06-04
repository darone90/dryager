const WebSocketServer = require('websocket').server;
const express = require('express');
const http = require('http');
const cors = require('cors');
const fs = require('fs').promises;
const {
    setLightOn,
    setLightOff,
    setLightColor
    } = require('./lightHandler');
    const {
    spawn
} = require('child_process');
    const {
    Spawn
    } = require('./Spawn');
const {
    port, key
} = require('./app.config');
const {
    urlencoded
} = require('express');

let process = new Spawn();
let camera;
let cameraStatus = false;

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(urlencoded({
    extended: true
}));
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
    .get('/light/:red/:green/:blue', (req, res) => {
        const {
            red,
            green,
            blue
        } = req.params;
        setLightColor(red, green, blue)
        res.end();
    })

    .get('/camera/:action', (req, res) => {
        const action = req.params.action

        if (action === 'start') {
            camera = spawn('node', ['./node_modules/raspberrypi-node-camera-web-streamer/index.js']);
            setLightOn();
            cameraStatus = true;
            res.end()
        } else {
            camera.kill()
            cameraStatus = false;
            setLightOff()
            res.end()
        }

    })

    .get('/air', async (req, res) => {
        const coded = await fs.readFile('./params.json');
        const data = JSON.parse(coded);

        const response = {
            ventInterval: data.ventInterval,
            ventTime: data.ventTime,
            dry: data.dry
        }

        res.json(response)
    })

    .get('/temperature', async (req, res) => {
        const coded = await fs.readFile('./params.json');
        const data = JSON.parse(coded);

        const response = {
            tempSET: data.tempSetPoint,
            tempHIS: data.tempHist
        }
        res.json(response)
    })

    .get('/humidity', async (req, res) => {
        const coded = await fs.readFile('./params.json');
        const data = JSON.parse(coded);
        const response = {
            humiSetPoint: data.humiSetPoint,
            humiTolleracne: data.humiTolleracne,
            humiActiveTime: data.humiActiveTime,
            humiInterval: data.humiInterval
        }
        res.json(response)
    })

    .get('/loop', async (req, res) => {
                    const data = process.getStatus();
                    const status = data === 'alive' ? true : false;
                    const coded = await fs.readFile('./params.json');
                    const decoded = JSON.parse(coded);
                    const response = {
                        status,
                        loop: decoded.loopTime
                    }
                    res.json(response)
    })

    .get('/process/:action', async (req, res) => {
        const {
            action
        } = req.params;
        switch (action) {
            case 'start':
                process = new Spawn();
                break;
            case 'stop':
                process.killProcess();
                break;
            case 'restart':
                process.killProcess();
                process = new Spawn();
                break;
        }
        res.json({
            ok: true
        });
    })

    .get('/devices/:device/:action', (req, res) => {
                const device = req.params.device;
                if (device === 'all') {
                    spawn('python3', ['../python/devicesHandler.py', device]);
                    res.json({
                        ok: true
                    });
                } else {
                    const action = req.params.action;
                    spawn('python3', ['../python/devicesHandler.py', device, action]);
                    res.json({
                        ok: true
                    });
                }
    })

    .post('/loop', async (req, res) => {
	process.killProcess();
        const {
            loop
        } = req.body;
        
        const coded = await fs.readFile('./params.json');
        const decoded = JSON.parse(coded);
        const newData = {
            ...decoded,
            loopTime: Number(loop)
        }
        const toSave = JSON.stringify(newData);
        await fs.writeFile('./params.json', toSave)
	process = new Spawn();
        res.json({
            ok: true
        });
    })

    .post('/temperature', async (req, res) => {
	process.killProcess();
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
        process = new Spawn();
        res.json({
        ok: true
        });
        })

        .post('/humidity', async (req, res) => {
                        process.killProcess();
                        const data = req.body;
                        const coded = await fs.readFile('./params.json');
                        const decoded = JSON.parse(coded);
                        const newData = {
                            ...decoded,
                            humiSetPoint: data.humiSetPoint,
                            humiTolleracne: data.humiTolleracne,
                            humiActiveTime: data.humiActiveTime,
                            humiInterval: data.humiInterval
                        }
                        const toSave = JSON.stringify(newData);
                        await fs.writeFile('./params.json', toSave);
			process = new Spawn();
                        res.json({
                            ok: true
                        });
    })
    .post('/air', async (req, res) => {
        process.killProcess();
        const data = req.body;
        const coded = await fs.readFile('./params.json');
        const decoded = JSON.parse(coded);
        const newData = {
            ...decoded,
            ventInterval: data.ventInterval,
            ventTime: data.ventTime,
            dry: data.dry
        }
        const toSave = JSON.stringify(newData);
        await fs.writeFile('./params.json', toSave);
        process = new Spawn();
        res.json({
            ok: true
        });
    })

wsServer.on('request', function (request) {
    const connection = request.accept(`dryager-protocol-${key}`, request.origin);

    const dataLoop = setInterval(() => {
                let message;
        const spawned = spawn('python', ['../python/Test.py'])
        spawned.stdout.on('data', async (data) => {
                        message = data.toString('utf-8');
                        const status = await fs.readFile('../python/devices.json');
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
        if (cameraStatus) {
            camera.kill();
            setLightOff()
        }
        clearInterval(dataLoop)
    })
});
