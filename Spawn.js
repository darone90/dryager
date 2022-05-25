const {
    spawn
} = require('child_process');
const {
    defaultParams
} = require('./app.config');

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
        ])
    }
    //add actualization on database

    getData() {
        const data = null // connection to database......
        return data ? data : defaultParams
    }

    killProcess() {
        this.process.kill();
        console.log('process Killed!')
    }
}

module.exports = {
    Spawn
}