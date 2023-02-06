from scipy import signal
import numpy as np

class DigitalFilter:
    
    def __init__(self, z, p, k):
        
        self.zeros = z
        self.poles = p
        self.gain = k 
        self.b , self.a  = signal.zpk2tf(self.zeros, self.poles, self.gain) 
        self.filterOrder = max(len(self.zeros), len(self.poles))
        
           
    def filterResponse(self):
        w, h = signal.freqz_zpk(self.zeros, self.poles, self.gain)
        h_mag = 20 * np.log10(abs(h))
        h_phase = np.angle(h)
        w = [round(x, 3) for x in w]
        return w, h_mag, h_phase     
        
    def applyFilter(self, input_signal):
        
        output_signal = signal.filtfilt(self.b, self.a, input_signal)
        return output_signal
        