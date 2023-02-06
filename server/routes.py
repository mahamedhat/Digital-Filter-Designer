from server.filter import DigitalFilter
from server import app
from flask import request


signal = []
@app.route('/digitalFilter', methods=['POST'])
def digitalFilter():
    
    jsonData = request.get_json()
    z = jsonData['z']
    p = jsonData['p']
    z = [complex(x[0], x[1]) for x in z]
    p = [complex(x[0], x[1]) for x in p]
    Dfilter = DigitalFilter(z, p, 1)
    w, h_mag, h_phase = Dfilter.filterResponse()
    
    return [w.tolist(), h_mag.tolist(), h_phase.tolist()] 


@app.route('/applyFilter', methods=['POST'])
def applyFilter():
    
        jsonData = request.get_json()
        input_point = float(jsonData['signal'])
        signal.append(input_point)
        if len(signal) >  2 * Dfilter.filterOrder:
            del signal[0:Dfilter.filterOrder]
        output_signal = Dfilter.applyFilter(signal)
        output_point = output_signal[-1]
        
        return [output_point] 
        
        