let inputGraph = document.getElementById('inputGraph')
let outputGraph = document.getElementById('outputGraph')
let inputCanvas = document.getElementById('mouseInput')
let context = inputCanvas.getContext('2d');

context.beginPath();
context.moveTo(10, 150);
context.lineTo(290, 150);
context.stroke();

context.beginPath();
context.moveTo(150, 10);
context.lineTo(150, 290);
context.stroke();
let get_offset = ()=> {

    let canvas_offset = inputCanvas.getBoundingClientRect();

    let offset_x = canvas_offset.left
    let offset_y = canvas_offset.top
    return [offset_x, offset_y]
}
let [offset_x, offset_y] = get_offset()
let layout = {xaxis:{range:[0,5]}}
Plotly.plot(inputGraph, [{y:[],x:[], type:'line'}], {xaxis:{range:[0,5]}, title:"input signal"})
Plotly.plot(outputGraph, [{y:[],x:[], type:'line'}], {xaxis:{range:[0,5]}, title:"Filtered signal"})
let t = 0
let mouse_move = (event)=> {
    let mouseX = parseInt(event.clientX - offset_x - 150);
    let mouseY = -1*parseInt(event.clientY - offset_y - 150);
    // console.log(mouseX)
    let filtered_point = update_output(mouseX);
    // Plotly.extendTraces(inputGraph, {y:[[mouseX]], x:[[t]]}, [0])
    // Plotly.extendTraces(outputGraph, {y:[[filtered_point]], x:[[t]]}, [0])
    // t+=0.02
    // range = {range:[t-4.5, t+0.5]}
    //  layout['xaxis']= range
    // if(t>4.5){
    //     Plotly.relayout(inputGraph, layout)
    //     Plotly.relayout(outputGraph, layout)
    // }
    plot_input_Output(mouseX, filtered_point, t)
    t+=0.02

}
inputCanvas.addEventListener('mousemove', (e)=>{
    mouse_move(e)
})

let update_output = (signalPoint)=>{
    let signalOutput
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:5000//applyFilter',
        data: JSON.stringify({signalPoint}),
        cache: false,
        dataType: 'json',
        async: false,
        contentType: 'application/json',
        processData: false,
        success: function(data) {
            signalOutput = data[0];
          
        },
    });
    return signalOutput
}

let plot_input_Output = (inputPoint, outputPoint, t)=>{

    Plotly.extendTraces(inputGraph, {y:[[inputPoint]], x:[[t]]}, [0])
    Plotly.extendTraces(outputGraph, {y:[[outputPoint]], x:[[t]]}, [0])
    // t+=0.02
    range = {range:[t-4.5, t+0.5]}
     layout['xaxis']= range
    if(t>4.5){
        Plotly.relayout(inputGraph, layout)
        Plotly.relayout(outputGraph, layout)
    }
}