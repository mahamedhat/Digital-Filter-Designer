let zplanecanvas = document.getElementById("zplanecanvas");
let ctxzplane = zplanecanvas.getContext("2d");


let type = "zeros";
let hittype;
let zerosvalues;
let polesvalues;
let hit;
let apfzeros=[];
let apfpoles=[];
let flag;

let $canvas = $("#zplanecanvas");
let canvasOffset = $canvas.offset();
let offsetX = canvasOffset.left;
let offsetY = canvasOffset.top;
let cw = zplanecanvas.width;
let ch = zplanecanvas.height;



// flag to indicate a drag is in process
// and the last XY position that has already been processed
let isDown = false;
let lastX;
let lastY;

// the radian value of a full circle is used often, cache it
let PI2 = Math.PI * 2;

// letiables relating to existing zeros and poles
let zeros = [];
let poles = [];
let draggingelement = -1;

function getvalues(element) {
  return ([((element[0] - 150) / 100), (( 150-element[1]) / 100)])
}
function denormalize(a,b) {
  return [(150 + 100 * a), ( 150 - 100 * b)]
}


drawPlane(ctxzplane);

function drawPlane(context) {
  context.beginPath();
  context.arc(150, 150, 100, 0, PI2);
  context.strokeStyle = '#000000';
  context.stroke();

  context.moveTo(10, 150);
  context.lineTo(290, 150);
  context.strokeStyle = '#000000';
  context.stroke();

  context.moveTo(150, 10);
  context.lineTo(150, 290);
  context.strokeStyle = '#000000';
  context.stroke();
  context.closePath();
}



function drawAll(context, allzeros, allpoles) {

  drawPlane(context);
  for (let i = 0; i < allzeros.length; i++) {
    let zero = allzeros[i];
    context.beginPath();
    context.strokeStyle = '#5FD068';
    context.arc(zero[0], zero[1], 6, 0, PI2);
    if (hittype == 'zeros' && i == hit ) {
      context.strokeStyle = '#DC0000' ;

    }
    context.stroke();
    context.closePath();

  }

  for (let i = 0; i < allpoles.length; i++) {
    let pole = allpoles[i];
    let x = pole[0];
    let y = pole[1];
    context.beginPath();
    context.moveTo(x + 6 / Math.sqrt(2), y + 6 / Math.sqrt(2));
    context.lineTo(x - 6 / Math.sqrt(2), y - 6 / Math.sqrt(2));
    context.moveTo(x + 6 / Math.sqrt(2), y - 6 / Math.sqrt(2));
    context.lineTo(x - 6 / Math.sqrt(2), y + 6 / Math.sqrt(2));
    context.strokeStyle = '#590696';
    if (hittype != 'zeros' && i == hit) {
      context.strokeStyle ='#DC0000' ;
    }
    context.stroke();
    context.closePath();
  }
}


// Plot for responses
class Plot {
    constructor(w, h) {
        this.width = w;
        this.height = h;
    }


    apfplot = (x , y) =>{


      d3.select("#filteredphaseres").append("canvas")
      .attr("id", "filteredphasecanvas");

      this.ctx3 = document.getElementById('filteredphasecanvas');

      let data3 = {
        labels: x,
        datasets: [{
            label: "APF phase",
            data: y,
            fill: false,
            borderColor: '#007aff'
        }]}

      let options = {
          maintainAspectRatio: false,
          animation: false,
          scales : {
              x : {
                  ticks : {
                      sampleSize : 5
                  }
              }
              
          }

      }
      let filteredphasecanvas = new Chart(this.ctx3, {
        type: 'line',
        options: options,
        data: data3});
    return {filteredphasecanvas};
    }

    plot = (x1, y1, x2, y2, label1, label2) => {

         d3.select("#magres").append("canvas")
            .attr("id", "magcanvas");

        d3.select("#phaseres").append("canvas")
            .attr("id", "phasecanvas");

        this.ctx1 = document.getElementById('magcanvas');
        this.ctx2 = document.getElementById('phasecanvas');


        let data1 = {
            labels: x1,
            datasets: [{
                label: label1,
                data: y1,
                fill: false,
                borderColor: '#03C988'
            }]
        }

        let data2 = {
            labels: x2,
            datasets: [{
                label: label2,
                data: y2,
                fill: false,
                borderColor: '#007aff'
            }]
        }


        let options = {
            maintainAspectRatio: false,
            animation: false,
            scales : {
                x : {
                    ticks : {
                        sampleSize : 5
                    }
                }
                
            }

        }
        var magcanvas = new Chart(this.ctx1, {
            type: 'line',
            options: options,
            data: data1
        });

        var phasecanvas = new Chart(this.ctx2, {
            type: 'line',
            options: options,
            data: data2
        });

      

        return {magcanvas , phasecanvas};
    }
    
    destroy = () => {
        d3.select("#magcanvas").remove();
        d3.select("#phasecanvas").remove();

    }
    apfdestroy = () => {
      d3.select("#filteredphasecanvas").remove();}

}


// Draw Plot
let plt = new Plot(520, 280);
let charts = plt.plot([], [], [], [], "Magnitude", "Phase");
let apfchart = plt.apfplot([],[]);



function drawResponse(w, h_mag, h_phase){
    
  plt.destroy();
  charts = plt.plot(w, h_mag, w, h_phase, "Magnitude", "Phase");

}

function drawApfResponse(w, h_phase){
    
  plt.apfdestroy();
  charts = plt.apfplot(w, h_phase);

}
function getapfzap(r,i){
  let sq= r*r + i*i;
  let p =denormalize(r,i);
  let zreal = r / sq ;
  let zimj =  i / sq ;
  let z=denormalize(zreal,zimj);
  let zarr=[z[0],z[1]];
  let parr=[p[0],p[1]];
  return [zarr , parr];
  
}
function applyAPF(a){

  let sq= a[0]*a[0]+a[1]*a[1];
  poles.push([(a[0]*100 + 150),(150 - a[1]*100)]);
  let real = a[0] / sq ;
  let imj =  a[1] / sq ;
  zeros.push([(real*100 + 150),(150 - imj*100)]);
  updateRespose();
   
}

function review(){
  const real=parseFloat(document.querySelector('#real').value);
  const imaginary= parseFloat(document.querySelector('#imaginary').value);
  if((document.querySelector('#real').value=="" || document.querySelector('#imaginary').value=="" )||(real ==0 && imaginary==0) ){
    return}
  // if(document.querySelector('#real').value == '' && document.querySelector('#imaginary').value == ''){return}
  flag = 'review'
  console.log(real);
  let apf  =getapfzap(real,imaginary);
  console.log(apf[0]);
  console.log(apf[1]);

  let polesvalues = [getvalues(apf[1])];
  let zerosvalues = [getvalues(apf[0])];

  $.ajax({
    type: 'POST',
    url: 'http://127.0.0.1:5000//digitalFilter',
    data: JSON.stringify({zerosvalues, polesvalues, flag}),
    cache: false,
    dataType: 'json',
    async: false,
    contentType: 'application/json',
    processData: false,
    success: function(data) {
      w = data[0];
      y_phase = data[1];
    },
});

  drawApfResponse(w,y_phase) ;



}


// ----------------------- Mouse Events -----------------------------------------


function handleMouseDown(e) {

  // tell the browser we'll handle this event
  e.preventDefault();
  e.stopPropagation();
  // save the mouse position
  // in case this becomes a drag operation
  lastX = parseInt(e.clientX - offsetX);
  lastY = parseInt(e.clientY - offsetY);
  hit = -1;

  // hit test all existing zeros
  for (let i = 0; i < zeros.length; i++) {
    let zero = zeros[i];
    let dx = lastX - zero[0];
    let dy = lastY - zero[1];
    if (dx * dx + dy * dy < 6 * 6) {
      hit = i;
      hittype = "zeros"

    }
  }
  // hit test all existing poles
  for (let i = 0; i < poles.length; i++) {
    let pole = poles[i];
    let dx = lastX - pole[0];
    let dy = lastY - pole[1];
    if (dx * dx + dy * dy < 6 * 6) {  //pythagoras theorem
      hit = i;
      hittype = "poles"

    }
  }


  // if no hits then add a zeros or pole
  // if hit then set the isDown flag to start a drag
  if (hit < 0) {
    if (type == "zeros") {
      hittype = 'zeros';
      hit = zeros.length
      zeros.push([lastX, lastY]);
      console.log(zeros)
    } else {
      hittype = 'poles';
      hit = poles.length
      poles.push([lastX, lastY]);
      console.log(poles)

    }
  } else {

    if (hittype == "zeros") {
      draggingelement = zeros[hit];
    } else {
      draggingelement = poles[hit];
    }

    isDown = true;
  }
  updateRespose();


}

function handleMouseUp(e) {
  // tell the browser we'll handle this event
  e.preventDefault();
  e.stopPropagation();

  // stop the drag
  isDown = false;
}

function handleMouseMove(e) {
  // if we're not dragging, just exit
  if (!isDown) {
    return;
  }

  // tell the browser we'll handle this event
  e.preventDefault();
  e.stopPropagation();

  // get the current mouse position
  mouseX = parseInt(e.clientX - offsetX);
  mouseY = parseInt(e.clientY - offsetY);

  // calculate how far the mouse has moved
  // since the last mousemove event was processed
  let dx = mouseX - lastX;
  let dy = mouseY - lastY;

  // reset the lastX/Y to the current mouse position
  lastX = mouseX;
  lastY = mouseY;

  if(hittype=="zeros"){
    zeros[hit][0]=lastX;
    zeros[hit][1]=lastY;
    }else{
        poles[hit][0]=lastX;
        poles[hit][1]=lastY;
        
    }

    
  // change the target circles position by the
  // distance the mouse has moved since the last
  // mousemove event
  draggingelement[0] += dx;
  draggingelement[1] += dy;

  // redraw all the circles
  updateRespose();

}

let w, y_mag, y_phase
function updateRespose() {

  ctxzplane.clearRect(0, 0, cw, ch);
  drawAll(ctxzplane, zeros, poles);

  polesvalues = poles.map(getvalues);
  zerosvalues = zeros.map(getvalues);
  flag = 'apply'
  $.ajax({
    type: 'POST',
    url: 'http://127.0.0.1:5000//digitalFilter',
    data: JSON.stringify({zerosvalues, polesvalues, flag}),
    cache: false,
    dataType: 'json',
    async: false,
    contentType: 'application/json',
    processData: false,
    success: function(data) {
      w = data[0];
      y_mag = data[1];
      y_phase = data[2];
    },
});

  drawResponse(w, y_mag, y_phase);
  drawApfResponse(w,y_phase) ;
}



//Responsible for deleting of a specific zero or pole
function deleteFreq() {
  getFrequencyArray().splice(hit, 1);
  updateRespose();
  closeMenu();
  

}

// Deleting All zeros
function clearallZeros() {
  zeros.splice(0, zeros.length);
  updateRespose();
}
// Deleting ALL poles
function clearallPoles() {
  poles.splice(0, poles.length);
  updateRespose();
}

function clearAll() {
  zeros.splice(0, zeros.length);
  poles.splice(0, poles.length);
  updateRespose();
}




// Call this function to know whether you want the zeros or poles array of objects AND RETURNS IT
function getFrequencyArray() {
  if (hittype == "zeros") {
    return zeros;
  } else {
    return poles;
  }
}




// listen for mouse events

document
  .getElementById("zplanecanvas")
  .addEventListener("mousedown", function(e) {
    handleMouseDown(e);
  });
document
  .getElementById("zplanecanvas")
  .addEventListener("mousemove", function(e) {
    handleMouseMove(e);

  });
document.getElementById("zplanecanvas").addEventListener("mouseup", function(e) {
  handleMouseUp(e);



});
document
  .getElementById("zplanecanvas")
  .addEventListener("mouseout", function(e) {
    handleMouseUp(e);
  })
let zerosOrPoles = document.getElementById('check1')
zerosOrPoles.addEventListener("change", function(e) {
    if(e.target.checked){
        type='poles';
  

    }else{type="zeros";}
    console.log(type);


  })

  function closeMenu(){
    document.body.removeChild(document.getElementById("ctxmenu"))
  }
  document
  .getElementById("zplanecanvas").oncontextmenu = (e) => {
    e.preventDefault()
    let menu = document.createElement("div")
    menu.id = "ctxmenu"
    menu.style = `top:${e.pageY-10}px;left:${e.pageX-40}px`
    menu.onmouseleave = () => ctxmenu.outerHTML = ''
    menu.innerHTML = "<p onclick='deleteFreq();'>Delete</p><p onclick='closeMenu();'>Close</p>"
    document.body.appendChild(menu)
  }


function del(e){
  if(e.keyCode === 100 && hit!=-1){
      e.preventDefault(); // Ensure it is only this code that runs
      deleteFreq();


  }
}