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

  
// (event)=>{
//   let x = [];
//   let y = [];
//   let file = e.target.files[0];
//   // let data = d3.csvParse(file);
//   var reader = new FileReader();
//   reader.readAsText(file);
//   reader.onload = function (event) {
//     var csvData = event.target.result;
//     let parsedCSV = d3.csvParse(csvData);
//     let keys = Object.keys(parsedCSV[0]);
//     parsedCSV.forEach(function (d, i) {
//       // if (i == 0) return true; // skip the header
//       x.push(d[keys[0]]);
//       y.push(d[keys[1]]);
//     });
// }


// }



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


$('#import-signal').click(function () {
    $('#canvas-style').removeClass("disable");
    $('#signal').addClass("disable")
});

$('#enable-canvas').click(function () {
    $('#canvas-style').addClass("disable");
    $('#signal').removeClass("disable")
});