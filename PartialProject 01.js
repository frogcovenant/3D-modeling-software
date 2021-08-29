var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 u_FragColor;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjMatrix;
  void main() {
   gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
   u_FragColor = a_Color;
  }`;

var FSHADER_SOURCE =`
  precision mediump float;
  varying vec4 u_FragColor;
  void main(){
    gl_FragColor = u_FragColor;
  }`;

  function restart(){
    index = 0;
    surfaces = [];
    var table = document.getElementById("bttnssurface");
    table.innerHTML = "<tr><th style='width: 150px'></th></tr>";
    kendoConsole.log("Restart");
    main();
  }

  function deleteSurface(){
    delete surfaces[currentSurfaceIndex];
    var surfaceBttn = document.getElementById("surface"+(currentSurfaceIndex+1).toString());
    var surfaceRow = surfaceBttn.parentNode.parentNode;
    var surfaceBttnsTable = surfaceRow.parentNode;
    surfaceBttnsTable.removeChild(surfaceRow);
    draw(gl);
  }

  function changeSurfaceColor(){
    hexColor = document.getElementById("colorPicker").value;
    redColor = parseInt(hexColor.substring(1,2), 16)/15.0;
    greenColor = parseInt(hexColor.substring(3,4), 16)/15.0;
    blueColor = parseInt(hexColor.substring(5,6), 16)/15.0;
    console.log(redColor);
    surfaces[currentSurfaceIndex].s_colors = [];
    for(var i = 0; i < surfaces[currentSurfaceIndex].s_points.length / 3; i ++){
      surfaces[currentSurfaceIndex].s_colors.push(redColor);
      surfaces[currentSurfaceIndex].s_colors.push(greenColor);
      surfaces[currentSurfaceIndex].s_colors.push(blueColor);
    }
    draw(gl);
  }

  $(document).ready(function() {
    $("#slider_r").kendoSlider({
      change: rotationSliderOnChange,
      slide: rotationSliderOnSlide,
      min: -360,
      max: 360,
      smallStep: 10,
      largeStep: 60,
      value: 0
    });

    $("#slider_t").kendoSlider({
      change: translationSliderOnChange,
      slide: translationSliderOnSlide,
      min: -5,
      max: 5,
      smallStep: 0.1,
      largeStep: 1,
      value: 0
    });

    $("#slider_s").kendoSlider({
      change: scalingSliderOnChange,
      slide: scalingSliderOnSlide,
      min: 0,
      max: 10,
      smallStep: 0.1,
      largeStep: 1,
      value: 1
    });
  });

function main(){
  var canvas = document.getElementById('webgl');

  gl = getWebGLContext(canvas);
  if(!gl){
    console.log('Failed to get the WebGL context');
    return;
  }

  if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
    console.log('Failed to initialize shaders');
    return;
  }

  canvas.onmousedown = function(ev){ click(ev, gl, canvas); };
  canvas.oncontextmenu = function(ev){ rightClick(ev, gl); return false;};

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  draw(gl);
}


function objectSelected(id){
  currentSurfaceIndex = parseInt(id.replace('surface',''), 10) - 1;
  kendoConsole.log(id);
}

// Global variables
var gl;
var index = 0;
var currentSurfaceIndex = 0;
var angle = 0.0;
var rotAxis = [1,0,0];
var grid_points = [];
var grid_colors = [];
var gridSize = 0.5;
var surfaces = [];

