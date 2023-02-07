from server.filter import DigitalFilter
from server import app
from flask import request


signal = [1 for i in range(15)]
Dfilter = DigitalFilter([0, 0, 0], [0 ,0 ,0], 1)

@app.route('/digitalFilter', methods=['POST'])
def digitalFilter():
    global Dfilter
    jsonData = request.get_json()
    z = jsonData['zerosvalues']
    p = jsonData['polesvalues']
    z = [complex(x[0], x[1]) for x in z]
    p = [complex(x[0], x[1]) for x in p]
    Dfilter = DigitalFilter(z, p, 1)
    w, h_mag, h_phase = Dfilter.filterResponse()
    
    return [w, h_mag.tolist(), h_phase.tolist()] 

@app.route('/APFFilter', methods=['POST'])
def APFdigitalFilter():
    global Dfilter
    jsonData = request.get_json()
    z = jsonData['zerosvalues']
    p = jsonData['polesvalues']
    z = [complex(x[0], x[1]) for x in z]
    p = [complex(x[0], x[1]) for x in p]
    Dfilter = DigitalFilter(z, p, 1)
    w, _ , h_phase = Dfilter.filterResponse()
    
    return [w,  h_phase.tolist()] 


@app.route('/applyFilter', methods=['POST'])
def applyFilter():
        global Dfilter
        jsonData = request.get_json()
        input_point = float(jsonData['signalPoint'])
        signal.append(input_point)
        if len(signal) >  2 * Dfilter.filterOrder and len(signal)>50:
            del signal[0:Dfilter.filterOrder]
        print
        output_signal = Dfilter.applyFilter(signal)
        output_point = output_signal[-1]
        
        return [float(output_point)] 
        
        