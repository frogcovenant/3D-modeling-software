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

  function changeAxis() {
    // currently changes are made globally
    var xAxis = document.getElementById("x-axis");
    var yAxis = document.getElementById("y-axis");
    var zAxis = document.getElementById("z-axis");
    if(xAxis.checked){
      kendoConsole.log("X");
      rotAxis = [1,0,0];
      // try setting the current rotation angle for x
    }
    if(yAxis.checked){
      kendoConsole.log("Y");
      rotAxis = [0,1,0];
      // try setting the current rotation angle for y
    }
    if(zAxis.checked){
      kendoConsole.log("Z");
      rotAxis = [0,0,1];
      // try setting the current rotation angle for z
    }
  }

  function restart(){
    index = 0;
    surfaces = [];
    var table = document.getElementById("bttnssurface");
    table.innerHTML = "<tr><th style='width: 150px'></th></tr>";
    kendoConsole.log("Restart");
    main();
  }

  function sliderOnSlide(e) {
    kendoConsole.log("Slide :: new slide value is: " + e.value);
    // set angle to its corresponding axis in the surface
    if(rotAxis[0] == 1){
      surfaces[currentSurfaceIndex].s_angles[0] = e.value;
    }else if(rotAxis[1] == 1){
      surfaces[currentSurfaceIndex].s_angles[1] = e.value;
    }else if(rotAxis[2] == 1){
      surfaces[currentSurfaceIndex].s_angles[2] = e.value;
    }
    
    main();
  }

  function sliderOnChange(e) {
    kendoConsole.log("Change :: new value is: " + e.value);
    // set angle to its corresponding axis in the surface
    if(rotAxis[0] == 1){
      surfaces[currentSurfaceIndex].s_angles[0] = e.value;
    }else if(rotAxis[1] == 1){
      surfaces[currentSurfaceIndex].s_angles[1] = e.value;
    }else if(rotAxis[2] == 1){
      surfaces[currentSurfaceIndex].s_angles[2] = e.value;
    }
    main();
  }

  function rangeSliderOnSlide(e) {
    kendoConsole.log("Slide :: new slide values are: " + e.value.toString().replace(",", " - "));
  }

  function rangeSliderOnChange(e) {
    kendoConsole.log("Change :: new values are: " + e.value.toString().replace(",", " - "));
    var slider = $("#slider").data("kendoSlider");
    slider.min(e.value[0]);
    slider.max(e.value[1]);

    if(slider.value() < e.value[0]){
      slider.value(e.value[0]);
    } else if(slider.value() > e.value[1]){
      slider.value(e.value[1]);
    }
    slider.resize();
    // set angle to its corresponding axis in the surface
    if(rotAxis[0] == 1){
      surfaces[currentSurfaceIndex].s_angles[0] = slider.value;
    }else if(rotAxis[1] == 1){
      surfaces[currentSurfaceIndex].s_angles[1] = slider.value;
    }else if(rotAxis[2] == 1){
      surfaces[currentSurfaceIndex].s_angles[2] = slider.value;
    }
    main();
  }

  var min = -360;
  var max = 360;
  $(document).ready(function() {
    $("#slider").kendoSlider({
      change: sliderOnChange,
      slide: sliderOnSlide,
      min: min,
      max: max,
      smallStep: 10,
      largeStep: 60,
      value: 0
    });

    $("#rangeslider").kendoRangeSlider({
      change: rangeSliderOnChange,
      slide: rangeSliderOnSlide,
      min: min,
      max: max,
      smallStep: 10,
      largeStep: 60,
      tickPlacement: "both"
    });
  });

function main(){
  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);

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

function drawGrid(gl){
  // grid side x
  for(var x = -gridSize; x <= gridSize; x += 0.1){
    // points
    // start
    grid_points.push(x);
    grid_points.push(-0.5);
    grid_points.push(gridSize);
    // end
    grid_points.push(x);
    grid_points.push(-0.5);
    grid_points.push(-gridSize);
    // colors
    // start
    grid_colors.push(1);
    grid_colors.push(1);
    grid_colors.push(1);
    // end
    grid_colors.push(1);
    grid_colors.push(1);
    grid_colors.push(1);
  }
  // grid side z
  for(var z = -gridSize; z <= gridSize; z += 0.1){
    // points
    // start
    grid_points.push(gridSize);
    grid_points.push(-0.5);
    grid_points.push(z);
    // end
    grid_points.push(-gridSize);
    grid_points.push(-0.5);
    grid_points.push(z);
    // colors
    // start
    grid_colors.push(1);
    grid_colors.push(1);
    grid_colors.push(1);
    // end
    grid_colors.push(1);
    grid_colors.push(1);
    grid_colors.push(1);
  }
  var gridSurface = {
    s_points: grid_colors,
    s_colors: grid_colors,
    s_angles: [0,0,0],
    s_translates: [0,0,0],
    s_scales: [1,1,1]
  };
  
  var n = initVertexBuffers(gl, new Float32Array(grid_points), new Float32Array(grid_colors), gridSurface);
  gl.drawArrays(gl.LINES, 0, n);
}

function rightClick(ev, gl) {
  index++;
  draw(gl);
  // create surface buttons in HTML
  var table = document.getElementById("bttnssurface");
  table.innerHTML += "<tr><td style='width: 150px'><button type='button' onclick='objectSelected(this.id);' id='surface" + index + "'>Surface" + index + "</button></td></tr>";
}

function objectSelected(id){
  currentSurfaceIndex = parseInt(id.replace('surface',''), 10) - 1;
  kendoConsole.log(id);
}

function initVertexBuffers(gl, vertices, colors, surface){
  var n = vertices.length/3;
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position<0){
    console.log('Failed to get program for a_Position');
    return;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  var modelMatrix = new Matrix4();
  // translates the surface
  modelMatrix.setTranslate(surface.s_translates[0], surface.s_translates[1], surface.s_translates[2]);
  
  // rotates the surface in each axis
  modelMatrix.rotate(surface.s_angles[0], 1, 0, 0);
  modelMatrix.rotate(surface.s_angles[1], 0, 1, 0);
  modelMatrix.rotate(surface.s_angles[2], 0, 0, 1);

  // scales the surface
  modelMatrix.scale(surface.s_scales[0], surface.s_scales[1], surface.s_scales[2]);

  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix){ console.log('Failed to get location of u_ModelMatrix'); return;  }
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix){ console.log('Failed to get location of u_ViewMatrix'); return;  }
  var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0.0, 0.0, 1.5, 0.0,0.0,0.0, 0.0,1.0,0.0);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  if(!u_ProjMatrix){ console.log('Failed to get location of u_ProjMatrix'); return;  }
  var projMatrix = new Matrix4();
  //projMatrix.setOrtho(-1.0,1.0,-1.0,1.0,1.0,2.0);
  projMatrix.setPerspective(60.0, 1.0, 0.1, 5.0);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);


  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0){
    console.log('Failed to get location of a_Color');
    return;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Color);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  return n;
}

function draw(gl){
  gl.clear(gl.COLOR_BUFFER_BIT);
  drawGrid(gl);
  for(var i = 0; i < surfaces.length; i++){
    var n = initVertexBuffers(gl, new Float32Array(surfaces[i].s_points), new Float32Array(surfaces[i].s_colors), surfaces[i]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
  }
}
// Global variables
var index = 0;
var currentSurfaceIndex = 0;
var angle = 0.0;
var rotAxis = [1,0,0];
var grid_points = [];
var grid_colors = [];
var gridSize = 0.5;
var surfaces = [];

function click(ev, gl, canvas) {
  if(event.buttons == 1){
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect() ;

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    if(surfaces.length <= index){
      // create empty surface
      var surface = {
        s_points: [],
        s_colors: [],
        s_angles: [0,0,0],
        s_translates: [0,0,0],
        s_scales: [1,1,1]
      };
      surfaces.push(surface);
    }
    // fill in the empty surface
    // points
    surfaces[index].s_points.push(x);
    surfaces[index].s_points.push(y);
    
    var z = 0.0;
    if(ev.ctrlKey){
      z = -0.5;
    } else if(ev.shiftKey) {
      z = -1.0;
    }
    surfaces[index].s_points.push(z);

    // colors
    surfaces[index].s_colors.push(Math.random());
    surfaces[index].s_colors.push(Math.random());
    surfaces[index].s_colors.push(Math.random());

    draw(gl);
  }
}
