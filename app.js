const WebSocketServer = require('websocket').server
const http = require('http');
const {
    Spawn
    } = require('./Spawn');
const {
    port
} = require('./app.config');



const server = http.createServer();
server.listen(port, () => {
    console.log(`http server listening on port ${port}`);
});
const wsServer = new WebSocketServer({
    httpServer: server
});

const process = new Spawn();

setTimeout(() => {
    process.killProcess();
    }, 20000)

wsServer.on('request', function (request) {
    //dodać sprawdzenie tokenem hashowanym
    const connection = request.accept(null, request.origin);
    // wysyłanie danych z python
    setInterval(() => {
        const spawned = spawn('python', ['../python/Test.py'])
        spawned.stdout.on('data', (data) => {
            console.log(data.toString('utf-8'))
        })
    }, 2000)
    connection.on('message', (data) => {
        // aktualizacja parametrów w pętili Pythona
    });

    connection.on('close', function (reasonCode, description) {
        console.log('connection closed')
        console.log(reasonCode, description)
        //dodać logi kiedy było logowanie       
    })
});
