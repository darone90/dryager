import sys
from getTemperature import AM2320
from time import sleep
from GPIOfunc import GPIOhandle

ON = False
OFF = True

coolingModule1 = 7
coolingModule2 = 11
ventModule = 13
waterModule = 15

temperatureSET = int(sys.argv[1])
temperatureHIS = int(sys.argv[2])

ventIntervalINC = int(sys.argv[3])
ventInterval = ventIntervalINC
ventTime = int(sys.argv[4])

humiditySET = int(sys.argv[5])
humidityTOL = int(sys.argv[6])
humidityACT = int(sys.argv[7])
humidityINT = int(sys.argv[8])

loopInterval = int(sys.argv[9])
dry = int(sys.argv[10])

ventON = False
loopClock = 0
waterON =False
waterBrake = 0
while True:
    
    am2320 = AM2320(1)
    temp = temperatureSET
    humi = humiditySET	
    try:
        (t,h) = am2320.readSensor()
        temp = t
        humi = h
        print(t,h)
    except:
        pass
    
    if temp > temperatureSET + temperatureHIS:
        GPIOhandle(coolingModule1, ON)
    if temp > temperatureSET + temperatureHIS + 2:
        GPIOhandle(coolingModule2, ON)
    if temp < temperatureSET - temperatureHIS:
        GPIOhandle(coolingModule1, OFF)
    if temp < temperatureSET:
        GPIOhandle(coolingModule2, OFF)
        
        
    if loopClock >= ventInterval and not ventON:
        GPIOhandle(ventModule, ON)
        loopClock = 0
        ventON = True
        ventInterval = ventIntervalINC
    if loopClock >= ventTime and ventON:
        GPIOhandle(ventModule, OFF)
        loopClock = 0
        ventON = False
        
    if humi < humiditySET - humidityTOL and not waterON:
        GPIOhandle(waterModule, ON)
        GPIOhandle(ventModule, ON)
        sleep(humidityACT)
        GPIOhandle(waterModule, OFF)
        GPIOhandle(ventModule, OFF)
        waterON = True
    if humi > humiditySET + humidityTOL:
        GPIOhandle(ventModule, ON)
        ventInterval = dry
        
    if waterON:
        waterBrake += loopInterval
        if waterBrake >= humidityINT:
            waterBrake = 0
            waterON = False
    
    loopClock += loopInterval
    print(loopClock)
    sleep(loopInterval)

