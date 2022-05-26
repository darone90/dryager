import json


def ActualizeModuleInfo(moduleName, status):
    data = {}
    with open('devices.json') as read_file:
        data = json.load(read_file)
        data[moduleName] = status
    with open('devices.json', 'w') as read_file:
        json.dump(data, read_file)


ActualizeModuleInfo('ventModule', 'on')
