let exportBtn = document.getElementById('export')
let importBtn = document.getElementById('import')
let upload = document.getElementById('upload')
var allowClick = true;
// writing

// Must be disabled at the start of the program
$('#canvas-style').addClass("disable");


let exportFilter = ()=> {

    let filter = {
    zeros:zeros, 
    poles:poles
    };

var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filter));
var dlAnchorElem = document.getElementById('downloadAnchorElem');
dlAnchorElem.setAttribute("href",     dataStr     );
dlAnchorElem.setAttribute("download", "Digital Filter.json");
dlAnchorElem.click();
}


let importFilter = (event)=> {
    let filter
    var reader = new FileReader();
        reader.onload = (event)=>{
            filter = JSON.parse(event.target.result);
            zeros = filter.zeros
            poles = filter.poles
            updateRespose() 

        };
        reader.readAsText(event.target.files[0]);
    }

  




exportBtn.onclick = exportFilter
// upload.addEventListener('', (event)=>{
//     importFilter(event)
// })
upload.onchange = (event)=>{
    importFilter(event)
}
importBtn.onclick = ()=> {
    upload.click()
    
}
let working = false
let interval
let uploadSignal = document.getElementById('uploadSignal')
uploadSignal.onchange = (e)=>{
    let x = [];
    let y = [];
    let file = e.target.files[0];
    // let data = d3.csvParse(file);
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (event) {
        var csvData = event.target.result;
        let parsedCSV = d3.csvParse(csvData);
        let keys = Object.keys(parsedCSV[0]);
        parsedCSV.forEach(function (d, i) {
            // if (i == 0) return true; // skip the header
            x.push(d[keys[0]]);
            y.push(d[keys[1]]);
        });
        layout = {xaxis:{range:[0,5]}}
        Plotly.newPlot(inputGraph, [{y:[],x:[], type:'line'}], {xaxis:{range:[0,5]}, title:"input signal"})
        Plotly.newPlot(outputGraph, [{y:[],x:[], type:'line'}], {xaxis:{range:[0,5]}, title:"Filtered signal"})
        t = 0
        i = 0
        if(working){
            clearInterval(interval)
        }
        working = true
        interval = setInterval(()=>{
            if(i<y.length){
                let filtered_point = update_output(y[i]);
                plot_input_Output(y[i], filtered_point, x[i])
                i+=30
            }
            else{
                clearInterval(interval)
                working = false
            }
        }, 100)
  }
  }


$('#import-signal').click(function () {
    $('#canvas-style').removeClass("disable");
    $('#signal').addClass("disable")
    uploadSignal.click()
});

$('#enable-canvas').click(function () {
    $('#canvas-style').addClass("disable");
    $('#signal').removeClass("disable")
    if (working){
        clearInterval(interval)
        working = false
    }
    Plotly.newPlot(inputGraph, [{y:[],x:[], type:'line'}], {xaxis:{range:[0,5]}, title:"input signal"})
    Plotly.newPlot(outputGraph, [{y:[],x:[], type:'line'}], {xaxis:{range:[0,5]}, title:"Filtered signal"})
});