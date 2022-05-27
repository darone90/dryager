from getTemperature import AM2320
from time import sleep


am2320 = AM2320(1)
try:
    
    (t,h) = am2320.readSensor()
    temp = t
    humi = h
    print(temp)
    print(humi)

except:
    pass

