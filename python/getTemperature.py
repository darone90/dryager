import posix
from fcntl import ioctl
import time
class AM2320:
  I2C_ADDR = 0x5c
  I2C_SLAVE = 0x0703 
  def __init__(self, i2cbus = 1):
    self._fd = posix.open("/dev/i2c-%d" % i2cbus, posix.O_RDWR)
    ioctl(self._fd, self.I2C_SLAVE, self.I2C_ADDR)
  
  def __del__(self):
    posix.close(self._fd)
  
  @staticmethod
  def _calc_crc16(data):
    crc = 0xFFFF
    for x in data:
      crc = crc ^ x
      for bit in range(0, 8):
        if (crc & 0x0001) == 0x0001:
          crc >>= 1
          crc ^= 0xA001
        else:
          crc >>= 1
    return crc
  @staticmethod
  def _combine_bytes(msb, lsb):
    return msb << 8 | lsb
  def readSensor(self):
    try:
      posix.write(self._fd, b'\0x00')
    except:
      pass
    time.sleep(0.001)
    try:
        posix.write(self._fd, b'\x03\x00\x04')
    except:
        pass
    time.sleep(0.0016)

    data = bytearray(posix.read(self._fd, 8))
  

    if data[0] != 0x03 or data[1] != 0x04:
      raise Exception("First two read bytes are a mismatch")

    if self._calc_crc16(data[0:6]) != self._combine_bytes(data[7], data[6]):
      raise Exception("CRC failed")

    temp = self._combine_bytes(data[4], data[5])
    if temp & 0x8000:
      temp = -(temp & 0x7FFF)
    temp /= 10.0
  
    humi = self._combine_bytes(data[2], data[3]) / 10.0
    return (temp, humi)  

