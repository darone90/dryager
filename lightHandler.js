const Gpio = require('pigpio').Gpio;
ledRed1 = new Gpio(21, {mode: Gpio.OUTPUT});
ledGreen1 = new Gpio(20, {mode: Gpio.OUTPUT});
ledBlue1 = new Gpio(16, {mode: Gpio.OUTPUT});
ledRed2 = new Gpio(26, {mode: Gpio.OUTPUT});
ledGreen2 = new Gpio(19, {mode: Gpio.OUTPUT});
ledBlue2 = new Gpio(13, {mode: Gpio.OUTPUT});


const setLightOn = () => {
	ledGreen1.digitalWrite(0)
	ledRed1.digitalWrite(0)
	ledBlue1.digitalWrite(0)
	ledGreen2.digitalWrite(0)
	ledRed2.digitalWrite(0)
	ledBlue2.digitalWrite(0)

}

const setLightOff = () => {
	ledGreen1.digitalWrite(1)
	ledRed1.digitalWrite(1)
	ledBlue1.digitalWrite(1)
	ledGreen2.digitalWrite(1)
	ledRed2.digitalWrite(1)
	ledBlue2.digitalWrite(1)

}

const setLightColor = (red, green, blue) => {
	ledGreen1.pwmWrite(green)
	ledRed1.pwmWrite(red)
	ledBlue1.pwmWrite(blue)
	ledGreen2.pwmWrite(green)
	ledRed2.pwmWrite(red)
	ledBlue2.pwmWrite(blue)

	
}

module.exports = {
	setLightOn,
	setLightOff,
	setLightColor
}
	