import sys
from jsonHandler import ActualizeModuleInfo
from GPIOfunc import GPIOhandle

device = sys.argv[1]

devices = {
   "coolingModule1":7,
   "coolingModule2":11,
   "ventModule":13,
   "pumpModule":15
}
if device == "all":
    for dev in devices:
        pin = devices[dev]
        action = 1
        GPIOhandle(pin,action)
        ActualizeModuleInfo(dev,"off")
else:
    action = int(sys.argv[2])
    GPIOhandle(devices[device],action)
    if action > 0:
        status = "off"
        ActualizeModuleInfo(device,status)
    if action == 0:
        status = "on"
        ActualizeModuleInfo(device,status)

