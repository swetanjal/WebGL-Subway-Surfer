main();

//
// Start here
//
function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program
  const vsSource = getVertexShader();

  // Fragment shader program

  const fsSource = getFragmentShader();

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  var tracks = [];
  tracks.push(initBuffersCube(gl, 9, 0.2, 1000, 0, 0, 0, [1.0, 0.0, 0.0, 1.0]));
  var player = initBuffersCube(gl, 1, 1, 1, 0, 1, -10, [0.0, 0.0, 1.0, 1.0]);
  player.y_speed = 0.0;
  //tracks.push(initBuffersCube(gl, 3, 0.2, 1000, 3.5, 0, -10));
  //tracks.push(initBuffersCube(gl, 3, 0.2, 1000, -3.5, 0, -10));
  //const buffers = initBuffersCube(gl, 3, 0.2, 2, 0, 0, -10);
  //const buffers2 = initBuffersCube(gl, 3, 0.2, 2, 4, 0, -10);
  var then = 0;
  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    /********************** Input *******************************/
    document.onkeydown = checkKey;
    function checkKey(e){
      e = e || window.event;
      if(e.keyCode == 37){
        player.location[0] -= 2;
      }
      else if(e.keyCode == 39){
        player.location[0] += 2;

      }
      else if(e.keyCode == 32){
        if(player.y_speed == 0){
          player.y_speed = 0.5;
        }
      }
    }
    /************************************************************/
    /***********************  tick  *****************************/
    //player.location[2] -= 0.05;
    player.location[1] += player.y_speed;
    if(player.location[1] > 1)
      player.y_speed -= 0.03;
    else
      player.y_speed = 0.0;
    //player.y_speed = max(player.y_speed, 0);
    /************************************************************/
    /************************** Camera **************************/
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    var eye = [0, 5, 3];
    var look = [0, 1, -10];
    var up = [0, 1, 0];
    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);
    var cameraMatrix = mat4.create();
    mat4.translate(cameraMatrix, cameraMatrix, eye);
    var cameraPosition = [
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
    ];          
    mat4.lookAt(cameraMatrix, cameraPosition, look, up);
    var viewMatrix = cameraMatrix;
    var viewProjectionMatrix = mat4.create();
    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);
    /******************* Thank You Manan Sir!!! *********************/
    
    /******************** Render Scene ******************************/
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    for(var i = 0; i < tracks.length; ++i){
      drawSceneCube(gl, programInfo, tracks[i], deltaTime, viewProjectionMatrix);
    }
    drawSceneCube(gl, programInfo, player, deltaTime, viewProjectionMatrix);
    requestAnimationFrame(render);
    /*****************************************************************/
  }
  requestAnimationFrame(render);
}