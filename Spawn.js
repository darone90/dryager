const {
    spawn
} = require('child_process');
const {
    defaultParams
} = require('./app.config');
const fs = require('fs');


class Spawn {
    constructor(data) {
        if (data) {
            this.initialParams = data
        } else {
            this.initialParams = this.getData()
        }
        this.process = spawn('python3', ['../python/Main.py',
            this.initialParams.tempSetPoint,
            this.initialParams.tempHist,
            this.initialParams.ventInterval,
            this.initialParams.ventTime,
            this.initialParams.humiSetPoint,
            this.initialParams.humiTolleracne,
            this.initialParams.humiActiveTime,
            this.initialParams.humiInterval,
            this.initialParams.loopTime,
            this.initialParams.dry
        ]);
        this.status = 'alive';
    }

    getData() {
        const coded = fs.readFileSync('./params.json');
        const data = JSON.parse(coded);
        return data ? data : defaultParams
    }

    getStatus() {
        return this.status
    }

    killProcess() {
        this.process.kill();
        this.status = 'killed'
    }
}

module.exports = {
    Spawn
}

