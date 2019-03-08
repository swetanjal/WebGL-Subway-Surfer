main();

//
// Start here
//
function main() {
  //document.getElementById('backaudio').play();
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }
  /***********************SHADERS FOR NON TEXTURED OBJECTS ********************************/
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
  /*********************************SHADERS FOR TEXTURED OBJECTS ****************/
  const vsSourceTextured = getVertexShaderTextured();

  // Fragment shader program

  const fsSourceTextured = getFragmentShaderTextured();

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgramTextured = initShaderProgram(gl, vsSourceTextured, fsSourceTextured);
  const programInfoTextured = {
    program: shaderProgramTextured,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgramTextured, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgramTextured, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgramTextured, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgramTextured, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgramTextured, 'uSampler'),
    },
  };
  /******************************************************************************/
  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  var buffer;
  var tracks = [];
  var trains = [];
  var coins = [];
  var player;
  var inspector;
  var then = 0;
  var textureTrain;
  var textureTrack;
  var texturePlayer;
  var textureInspector;
  var textureCoin;
  loadJSONResource('./tracks.json', function (modelErr, modelTrack) {
    loadJSONResource('./train.json', function(modelErr2, modelTrain){
      loadJSONResource('./player.json', function(modelErr3, modelPlayer){
        loadJSONResource('./inspector.json', function(modelErr4, modelInspector){
          loadJSONResource('./coin.json', function(modelErr5, modelCoin){
            textureCoin = loadTexture(gl, 'coin.png');
            textureTrain = loadTexture(gl, 'train.png');
            textureTrack = loadTexture(gl, 'tracks.png');
            texturePlayer = loadTexture(gl, 'player.png');
            textureInspector = loadTexture(gl, 'inspector.png');
            /* Generating trains */
            trains.push(initBuffersModel(gl, 1, 1, 1, 0, 2, -150, [1.0, 1.0, 0.0, 1.0],modelTrain));
            trains[0].rotation = 180;
            trains[0].scale = [0.25, 0.25, 0.25];
            /************************************************************/
            /* Generating tracks */
            var z = -10000;
            var cnt = 0;
            for(var i = 0; i < 200; ++i){
              tracks.push(initBuffersModel(gl, 0, 0, 0, 0, -50, z, [1.0, 1.0, 0.0, 1.0], modelTrack));
              tracks[cnt].rotation = 90;
              tracks[cnt].scale = [0.1, 0.1, 0.1];
              z += 120;
              cnt = cnt + 1;
            }
            z = -10000;
            for(var i = 0; i < 200; ++i){
              tracks.push(initBuffersModel(gl, 0, 0, 0, 58, -50, z, [1.0, 1.0, 0.0, 1.0], modelTrack));
              tracks[cnt].rotation = 90;
              tracks[cnt].scale = [0.1, 0.1, 0.1];
              z += 120;
              cnt = cnt + 1;
            }
            z = -10000;
            for(var i = 0; i < 200; ++i){
              tracks.push(initBuffersModel(gl, 0, 0, 0, -58, -50, z, [1.0, 1.0, 0.0, 1.0], modelTrack));
              tracks[cnt].rotation = 90;
              tracks[cnt].scale = [0.1, 0.1, 0.1];
              z += 120;
              cnt = cnt + 1;
            }
            /****************************************************************/
            /**************************Creating player***********************/
            player = initBuffersModel(gl, 1, 1, 1, 0, 1.0, 15, [0.0, 0.0, 1.0, 1.0], modelPlayer);
            player.y_speed = 0.0;
            player.rotation = 180.0;
            player.scale = [0.35, 0.35, 0.35];
            requestAnimationFrame(render);
            /****************************************************************/
            /***************************Creating Inspector*******************/
            inspector = initBuffersModel(gl, 1, 1, 1, 0, 1.0, 40, [0.0, 0.0, 1.0, 1.0], modelInspector);
            inspector.scale = [0.4, 0.4, 0.4];
            inspector.rotation = 180;
            /*****************************************************************/
            /****************** Creating Coins *********************************/
            var lane0 = -1.15;
            var lane1 = 0.0;
            var lane2 = 1.15;
            coins.push(initBuffersModel(gl, 1, 1, 1, lane1, 0.4, 1.0, [0.0, 0.0, 10.0, 1.0], modelCoin));
            coins[0].scale = [5, 5, 5];
            coins.push(initBuffersModel(gl, 1, 1, 1, lane2, 0.4, 1.0, [0.0, 0.0, 10.0, 1.0], modelCoin));
            coins[1].scale = [5, 5, 5];
            coins.push(initBuffersModel(gl, 1, 1, 1, lane0, 0.4, 1.0, [0.0, 0.0, 10.0, 1.0], modelCoin));
            coins[2].scale = [5, 5, 5];
            /******************************************************************/
          })
        })
      })
    })
  });
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
        if(player.location[0] > -16.5 && player.location[1] <= 1)
          player.location[0] -= 16.5;
      }
      else if(e.keyCode == 39){
        if(player.location[0] < 16.5 && player.location[1] <= 1)
        player.location[0] += 16.5;

      }
      else if(e.keyCode == 32){
        if(player.y_speed == 0){
          player.y_speed = 0.7;
        }
      }
      else if(e.keyCode == 38){
        // Up
        player.location[2] -= 0.1;
      }
      else if(e.keyCode == 40){
        //Down
        player.location[2] += 0.1;
      }
    }
    /************************************************************/
    /***********************  tick  *****************************/
    //player.location[2] -= 0.05;
    player.location[1] = player.location[1] + player.y_speed;
    if(player.location[1] > 1.0)
      player.y_speed -= 0.03;
    else
      player.y_speed = 0.0;
    for(var i = 0; i < coins.length; ++i){
      var player_pos_z = player.location[2] * player.scale[2];
      var coin_pos_z = (coins[i].location[2] * coins[i].scale[2]);

      var player_pos_x = player.location[0] * player.scale[0];
      var coin_pos_x = (coins[i].location[0] * coins[i].scale[0]);
      if(Math.abs(coin_pos_z - player_pos_z) <= 0.05 && Math.abs(coin_pos_x - player_pos_x) <= 0.1)
      {
        coins.splice(i, 1);
        document.getElementById('coin_sound').play();
        i = i - 1;
      }
    }
    /************************************************************/
    /************************** Camera **************************/
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    var eye = [0, 8, (player.location[2] * player.scale[2]) + 20];
    var look = [0, 0, player.location[2] * player.scale[2]];
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
    // Drawing the tracks
    for(var i = 0; i < tracks.length; ++i){
      drawObjectTextured(gl, programInfoTextured, tracks[i], deltaTime, viewProjectionMatrix, textureTrack);
    }
    drawObjectTextured(gl, programInfoTextured, player, deltaTime, viewProjectionMatrix, texturePlayer);
    //drawObjectTextured(gl, programInfoTextured, inspector, deltaTime, viewProjectionMatrix, textureInspector);
    // Drawing the trains
    for(var i = 0; i < trains.length; ++i)
      drawObjectTextured(gl, programInfoTextured, trains[i], deltaTime, viewProjectionMatrix, textureTrain);
    for(var i = 0; i < coins.length; ++i)
      drawObjectTextured(gl, programInfoTextured, coins[i], deltaTime, viewProjectionMatrix, textureCoin);
    requestAnimationFrame(render);
    /*****************************************************************/
  }
  //requestAnimationFrame(render);
}