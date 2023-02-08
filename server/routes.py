from server.filter import DigitalFilter
from server import app
from flask import request


signal = [1 for i in range(15)]
Dfilter = DigitalFilter([0, 0, 0], [0 ,0 ,0], 1)
alp_review = DigitalFilter([0, 0, 0], [0 ,0 ,0], 1)

@app.route('/digitalFilter', methods=['POST'])
def digitalFilter():
    global Dfilter
    jsonData = request.get_json()
    z = jsonData['zerosvalues']
    p = jsonData['polesvalues']
    flag = jsonData['flag']
    z = [complex(x[0], x[1]) for x in z]
    p = [complex(x[0], x[1]) for x in p]
    if flag == 'apply':
        Dfilter = DigitalFilter(z, p, 1)
        w, h_mag, h_phase = Dfilter.filterResponse()
        return [w, h_mag.tolist(), h_phase.tolist()] 

    else:
        alp_review = DigitalFilter(z, p, 1)
        w, h_mag, h_phase = alp_review.filterResponse()
        return [w,  h_phase.tolist()] 




@app.route('/applyFilter', methods=['POST'])
def applyFilter():
        global Dfilter
        jsonData = request.get_json()
        input_point = float(jsonData['signalPoint'])
        signal.append(input_point)
        if len(signal) >  2 * Dfilter.filterOrder and len(signal)>50:
            del signal[0:Dfilter.filterOrder]
        output_signal = Dfilter.applyFilter(signal)
        output_point = output_signal[-1]
        
        return [float(output_point)] 
        
        