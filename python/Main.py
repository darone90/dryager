import sys
from getTemperature import AM2320
from time import sleep
from GPIOfunc import GPIOhandle
from jsonHandler import ActualizeModuleInfo

ON = False
OFF = True

coolingModule1 = 7
coolingModule2 = 11
ventModule = 13
waterModule = 15

temperatureSET = int(sys.argv[1])
temperatureHIS = int(sys.argv[2])

ventInterval = int(sys.argv[3])
ventTimeINIT = int(sys.argv[4])
ventTime = ventTimeINIT


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
        print(temp)
        print(humi)
    except:
        pass
    
    if temp > temperatureSET + temperatureHIS:
        GPIOhandle(coolingModule1, ON)
        ActualizeModuleInfo('coolingModule1','on')
    if temp > temperatureSET + temperatureHIS + 2:
        GPIOhandle(coolingModule2, ON)
        ActualizeModuleInfo('coolingModule2','on')
    if temp < temperatureSET - temperatureHIS:
        GPIOhandle(coolingModule1, OFF)
        ActualizeModuleInfo('coolingModule1','off')
    if temp < temperatureSET:
        GPIOhandle(coolingModule2, OFF)
        ActualizeModuleInfo('coolingModule2','off')
        
        
    if loopClock >= ventInterval and not ventON:
        GPIOhandle(ventModule, ON)
        ActualizeModuleInfo('ventModule','on')
        loopClock = 0
        ventON = True

    if loopClock >= ventTime and ventON:
        GPIOhandle(ventModule, OFF)
        ActualizeModuleInfo('ventModule','off')
        ActualizeModuleInfo('drying','off')
        loopClock = 0
        ventTime = ventTimeINIT
        ventON = False
        
    if humi < humiditySET - humidityTOL and not waterON:
        GPIOhandle(waterModule, ON)
        ActualizeModuleInfo('pumpModule','on')
        GPIOhandle(ventModule, ON)
        ActualizeModuleInfo('ventModule','on')
        sleep(humidityACT)
        GPIOhandle(waterModule, OFF)
        ActualizeModuleInfo('pumpModule','off')
        GPIOhandle(ventModule, OFF)
        ActualizeModuleInfo('ventModule','off')
        waterON = True

    if humi < humiditySET:
        ventTime = ventTimeINIT
        ActualizeModuleInfo('drying','off')

    if humi > humiditySET + humidityTOL:
        ventTime = dry
        ActualizeModuleInfo('drying','on')
        
    if waterON:
        waterBrake += loopInterval
        if waterBrake >= humidityINT:
            waterBrake = 0
            waterON = False
    
    loopClock += loopInterval
    sleep(loopInterval)
    

