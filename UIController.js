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

  function rightClick(ev, gl) {
    index++;
    draw(gl);
    // create surface buttons in HTML
    var table = document.getElementById("bttnssurface");
    table.innerHTML += "<tr><td style='width: 150px'><button type='button' onclick='objectSelected(this.id);' id='surface" + index + "'>Surface" + index + "</button></td></tr>";
  }

  function rotationSliderOnSlide(e) {
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

  function rotationSliderOnChange(e) {
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

  function translationSliderOnSlide(e) {
    kendoConsole.log("Slide :: new slide value is: " + e.value);
    // set translation value to its corresponding axis in the surface
    if(rotAxis[0] == 1){
      surfaces[currentSurfaceIndex].s_translates[0] = e.value;
    }else if(rotAxis[1] == 1){
      surfaces[currentSurfaceIndex].s_translates[1] = e.value;
    }else if(rotAxis[2] == 1){
      surfaces[currentSurfaceIndex].s_translates[2] = e.value;
    }
    
    main();
  }

  function translationSliderOnChange(e) {
    kendoConsole.log("Change :: new value is: " + e.value);
    // set translation value to its corresponding axis in the surface
    if(rotAxis[0] == 1){
      surfaces[currentSurfaceIndex].s_translates[0] = e.value;
    }else if(rotAxis[1] == 1){
      surfaces[currentSurfaceIndex].s_translates[1] = e.value;
    }else if(rotAxis[2] == 1){
      surfaces[currentSurfaceIndex].s_translates[2] = e.value;
    }
    main();
  }

  function scalingSliderOnSlide(e) {
    kendoConsole.log("Slide :: new slide value is: " + e.value);
    // set scaling value to its corresponding axis in the surface
    if(rotAxis[0] == 1){
      surfaces[currentSurfaceIndex].s_scales[0] = e.value;
    }else if(rotAxis[1] == 1){
      surfaces[currentSurfaceIndex].s_scales[1] = e.value;
    }else if(rotAxis[2] == 1){
      surfaces[currentSurfaceIndex].s_scales[2] = e.value;
    }
    
    main();
  }

  function scalingSliderOnChange(e) {
    kendoConsole.log("Change :: new value is: " + e.value);
    // set angle to its corresponding axis in the surface
    if(rotAxis[0] == 1){
      surfaces[currentSurfaceIndex].s_translates[0] = e.value;
    }else if(rotAxis[1] == 1){
      surfaces[currentSurfaceIndex].s_translates[1] = e.value;
    }else if(rotAxis[2] == 1){
      surfaces[currentSurfaceIndex].s_translates[2] = e.value;
    }
    main();
  }

  
  function changeAxis() {
    // selects the axis that will be affected by the desired operation
    var xAxis = document.getElementById("x-axis");
    var yAxis = document.getElementById("y-axis");
    var zAxis = document.getElementById("z-axis");
    if(xAxis.checked){
      kendoConsole.log("X");
      rotAxis = [1,0,0];
      // the surface now can be translated, rotated and scaled in the x axis
    }
    if(yAxis.checked){
      kendoConsole.log("Y");
      rotAxis = [0,1,0];
      // the surface now can be translated, rotated and scaled in the y axis
    }
    if(zAxis.checked){
      kendoConsole.log("Z");
      rotAxis = [0,0,1];
      // the surface now can be translated, rotated and scaled in the y axis
    }
  }
  