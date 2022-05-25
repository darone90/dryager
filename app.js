const WebSocketServer = require('websocket').server
const http = require('http');
const {
    spawn
} = require('child_process');

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

const initialParams = {
    //dodać pobieranie paramterów z ostatniego recordu z bazy
    tempSetPoint: 25,
    tempHist: 3,
    ventInterval: 10,
    ventTime: 5,
    humiSetPoint: 55,
    humiTolleracne: 10,
    humiActiveTime: 5,
    humiInterval: 20,
    loopTime: 2,
    dry: 20
}

const process = spawn('python3', ['../python/Main.py',
    initialParams.tempSetPoint,
    initialParams.tempHist,
    initialParams.ventInterval,
    initialParams.ventTime,
    initialParams.humiSetPoint,
    initialParams.humiTolleracne,
    initialParams.humiActiveTime,
    initialParams.humiInterval,
    initialParams.loopTime,
    initialParams.dry
]);

console.log('spawn process finished succesfully');

setTimeout(() => {
    process.kill()
    console.log('process dead')
}, 20000)


wsServer.on('request', function (request) {
    //dodać sprawdzenie tokenem hashowanym
    const connection = request.accept(null, request.origin);
    // wysyłanie danych z python

    connection.on('message', (data) => {
        // aktualizacja parametrów w pętili Pythona
    });

    connection.on('close', function (reasonCode, description) {
        console.log('connection closed')
        console.log(reasonCode, description)
        //dodać logi kiedy było logowanie       
    })
});
