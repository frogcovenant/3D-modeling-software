function draw(gl){
  // draw is called whenever a change is made in the canvas
  gl.clear(gl.COLOR_BUFFER_BIT);
  drawGrid(gl);
  for(var i = 0; i < surfaces.length; i++){
    if(surfaces[i]){
      var n = initVertexBuffers(gl, new Float32Array(surfaces[i].s_points), new Float32Array(surfaces[i].s_colors), surfaces[i]);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
    }
  }
}

function drawGrid(gl){
  // a reference grid so that the user can guide themselves with it as they model
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

function initVertexBuffers(gl, vertices, colors, surface){
  // each surface is sent to be transformed as desired by the user
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
  // set is called once
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
  
  // pespective is needed to make it easier for the user to see a 3D space and model
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