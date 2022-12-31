let zplanecanvas = document.getElementById("zplanecanvas");
let ctxzplane = zplanecanvas.getContext("2d");

let type = "zeros";
let hittype;
let magnitude;
let angle;
let w;
let zerosvalues;
let polesvalues;
let hit;
let allpassfilterszeros = [];
let allpassfilterspoles = [];
let slidervalue = 10;
let signalIterator = 0;
let $canvas = $("#zplanecanvas");
let canvasOffset = $canvas.offset();
let offsetX = canvasOffset.left;
let offsetY = canvasOffset.top;
let cw = zplanecanvas.width;
let ch = zplanecanvas.height;

drawReposne([], [], "content2", 'Magnitude Response');
drawReposne([], [], "content4",  'Phase Response');

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
  return ([((element[0] - 150) / 100), (-(element[1] - 150) / 100)])
}

function drawReposne(w, u,  div, label) {
  let trace = {
    x: w,
    y: u,
    type: 'scatter',
    name: label
  };
  let data = [trace];

  let layout = {
    grid: {
      rows: 1,
      columns: 1,
      pattern: 'independent'
    },
  };

  Plotly.newPlot(div, data, layout);

}

drawPlane(ctxzplane);

function drawPlane(context) {
  context.beginPath();
  context.arc(150, 150, 100, 0, 2 * Math.PI);
  context.stroke();
  context.moveTo(10, 150);
  context.lineTo(290, 150);
  context.stroke();
  context.moveTo(150, 10);
  context.lineTo(150, 290);
  context.strokeStyle = '#000000';
  context.stroke();
  context.closePath();
}






function drawAll(context, allzeros, allpoles, color) {



  drawPlane(context);
  for (let i = 0; i < allzeros.length; i++) {
    let zero = allzeros[i];
    context.beginPath();
    context.strokeStyle = color;
    context.arc(zero[0], zero[1], 6, 0, PI2);
    if (hittype == 'zeros' && i == hit) {
      context.strokeStyle = '#2ebf91';

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
    context.strokeStyle = color;
    if (hittype != 'zeros' && i == hit) {
      context.strokeStyle = '#ff0000';
    }
    context.stroke();
    context.closePath();
  }
}

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
    if (dx * dx + dy * dy < 6 * 6) {
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

function getSignals() {
  arr = [signalIterator, slidervalue];
  data = JSON.stringify(arr);
  $.ajax({
    url: '/getSignals',
    type: 'post',
    contentType: 'application/json',
    dataType: 'json',
    data: data,
    success: function(response) {
      xData = response.xAxisData;
      yData = response.yAxisData;
      filtered = response.filter;
      length = response.datalength;
      signalIterator = signalIterator + 1;
      drawReposne(xData, filtered, 'content2', 'signal');
      drawReposne(xData, filtered, 'content4','filtered Signal');

      if (signalIterator * slidervalue < length) {
        setTimeout(getSignals, slidervalue * 10);
      }
    }
  });
}

function sliderValue() {
  oldmult = signalIterator * slidervalue;
  x = document.getElementById("sliderChunks");
  slidervalue = x.value;
  signalIterator = parseInt(oldmult / slidervalue);
}

function sendzeros() {
  zerosvalues = zeros.map(getvalues);
  let js_zeros = JSON.stringify(zerosvalues);
  $.ajax({
    url: '/getzeros',
    type: 'post',
    contentType: 'application/json',
    dataType: 'json',
    data: js_zeros
  });
}

function sendpoles() {
  polesvalues = poles.map(getvalues)
  let js_poles = JSON.stringify(polesvalues);

  $.ajax({
    url: '/getpoles',
    type: 'post',
    contentType: 'application/json',
    dataType: 'json',
    data: js_poles
  });
}

function updateRespose() {
  sendzeros();
  sendpoles();
  ctxzplane.clearRect(0, 0, cw, ch);
  drawAll(ctxzplane, zeros, poles, '#0000FF');
  drawAll(ctxzplane, allpassfilterszeros, allpassfilterspoles, '#91b233')


  $.ajax({
    url: '/sendfrequencyresposedata',
    type: 'get',
    success: function(response) {
      data = response;
      magnitude = data.magnitude;
      w = data.w;
      angle = data.angle;
      drawReposne(w, magnitude, 'content2', 'magnitude');
      drawReposne(w, angle, 'content4', 'angle');

      ctxzplane.clearRect(0, 0, cw, ch);
      drawAll(ctxzplane, zeros, poles, '#0000FF');
      drawAll(ctxzplane, allpassfilterszeros, allpassfilterspoles, '#91b233')
    }
  });
}

// const inputElement = document.getElementById("signalFile");
// inputElement.addEventListener("change", handleFiles, true);

// function handleFiles() {
//   var path = inputElement.value.split("\\"); /* now you can work with the file list */
//   sendPath = JSON.stringify(path.at(-1));
//   $.ajax({
//     url: '/getData',
//     type: 'post',
//     contentType: 'application/json',
//     dataType: 'json',
//     data: sendPath,
//     success: function() {
//       console.log(signalIterator);
//       getSignals();
//     }
//   })
// }



//youssef
//Responsible for deleting of a specific zero or pole
function deleteFreq() {
  getFrequencyArray().splice(hit, 1);
  updateRespose();
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

//Used to add a conjugate
function addConjugate() {
  temp = getFrequencyArray()[hit];
  if (temp[1] > 150) {
    temp = [temp[0], temp[1] - 2 * (150 - temp[1])];
  } else {
    temp = [temp[0], temp[1] + 2 * (150 - temp[1])];
  }
  getFrequencyArray().push([temp[0], (temp[1])]);
  ctxzplane.clearRect(0, 0, cw, ch);
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
  drawReposne(w, magnitude, 'content2', 'magnitude');
  drawReposne(w, angle, 'content4', 'angle');


});
document
  .getElementById("zplanecanvas")
  .addEventListener("mouseout", function(e) {
    handleMouseUp(e);
  })

document.addEventListener("change", function(e) {
    if(e.target.checked){
        type='poles';
  

    }else{type="zeros";}
    console.log(type);


  })

$(".side-button").click(function() {
  if ($(this).css("right") == "0px") {
    $(this).animate({
      right: $('.sidebar').outerWidth()
    }, 500);
    $(".sidebar").animate({
      right: "0"
    }, 500);
  } else {
    $(this).animate({
      right: "0"
    }, 500);
    $(".sidebar").animate({
      right: -$('.sidebar').outerWidth()
    }, 500);
  }
});