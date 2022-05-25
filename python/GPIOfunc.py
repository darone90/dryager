def GPIOhandle(PIN, ACTION):
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BOARD)
    GPIO.setwarnings(False)
    
    GPIO.setup(PIN, GPIO.OUT)
    GPIO.output(PIN, ACTION)
    
    

