let inputGraph = document.getElementById('inputGraph')
let inputCanvas = document.getElementById('mouseInput')
let context = inputCanvas.getContext('2d');

context.beginPath();
context.moveTo(0, 150);
context.lineTo(300, 150);
context.stroke();

context.beginPath();
context.moveTo(150, 0);
context.lineTo(150, 300);
context.stroke();
let get_offset = ()=> {

    let canvas_offset = inputCanvas.getBoundingClientRect();

    let offset_x = canvas_offset.left
    let offset_y = canvas_offset.top
    return [offset_x, offset_y]
}
let [offset_x, offset_y] = get_offset()
let layout = {xaxis:{range:[0,5]}}
Plotly.plot(inputGraph, [{y:[],x:[], type:'line'}],layout)
let t = 0
let mouse_move = (event)=> {
    let mouseX = parseInt(event.clientX - offset_x - 150);
    let mouseY = -1*parseInt(event.clientY - offset_y - 150);
    console.log(mouseX)
    Plotly.extendTraces(inputGraph, {y:[[mouseX]], x:[[t]]}, [0])
    t+=0.02
    range = {range:[t-4.5, t+0.5]}
    layout['xaxis']= range
    if(t>5){
        Plotly.relayout(inputGraph, layout)
    }
}
inputCanvas.addEventListener('mousemove', (e)=>{
    mouse_move(e)
})
