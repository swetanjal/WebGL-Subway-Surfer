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
  var barriers = [];
  var jetpacks = [];
  var player;
  var inspector;
  var then = 0;
  var textureTrain;
  var textureTrack;
  var texturePlayer;
  var textureInspector;
  var textureCoin;
  var textureBarrier;
  var textureJetpack;
  var gravity_effect = 1;
  var score = 0;
  var speed = -0.0;
  var inspector_speed = 0.0;
  var timer = 0.0;
  var last_collision = -1;
  var jetpack_timer = -1;
  loadJSONResource('./tracks.json', function (modelErr, modelTrack) {
    loadJSONResource('./train.json', function(modelErr2, modelTrain){
      loadJSONResource('./player.json', function(modelErr3, modelPlayer){
        loadJSONResource('./inspector.json', function(modelErr4, modelInspector){
          loadJSONResource('./coin.json', function(modelErr5, modelCoin){
            loadJSONResource('./roadbarrier.json', function(modelErr6, modelBarrier){
              loadJSONResource('./jetpack.json', function(modelErr7, modelJetpack){
                textureJetpack = loadTexture(gl, 'jetpack.png');
                textureCoin = loadTexture(gl, 'coin.png');
                textureTrain = loadTexture(gl, 'train.png');
                textureTrack = loadTexture(gl, 'tracks.png');
                texturePlayer = loadTexture(gl, 'player.png');
                textureInspector = loadTexture(gl, 'inspector.png');
                textureBarrier = loadTexture(gl, 'roadbarrier.png');
                /* Generating trains */
                var L1 = 0;
                var L0 = -23;
                var L2 = 23;
                trains.push(initBuffersModel(gl, 1, 1, 1, L0, 2, -450, [1.0, 1.0, 0.0, 1.0],modelTrain));
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
                inspector = initBuffersModel(gl, 1, 1, 1, 0, 1.0, 100, [0.0, 0.0, 1.0, 1.0], modelInspector);
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
                coins.push(initBuffersModel(gl, 1, 1, 1, lane0, 0.4, 0.0, [0.0, 0.0, 10.0, 1.0], modelCoin));
                coins[3].scale = [5, 5, 5];
                /******************************************************************/
                /**************** Creating Barriers *********************************/
                lane0 = -57;
                lane1 = 0;
                lane2 = 57;
                barriers.push(initBuffersModel(gl, 1, 1, 1, lane1, 9, -100.0, [0.0, 0.0, 10.0, 1.0], modelBarrier));
                barriers[0].scale = [0.1, 0.1, 0.2];
                barriers.push(initBuffersModel(gl, 1, 1, 1, lane1, 9, -200.0, [0.0, 0.0, 10.0, 1.0], modelBarrier));
                barriers[1].scale = [0.1, 0.1, 0.2];
                /********************************************************************/
                /**************** Creating jetpacks ************************************/
                lane0 = -0.285;
                lane1 = 0.0;
                lane2 = 0.285;
                jetpacks.push(initBuffersModel(gl, 1, 1, 1, lane0, 0.15, -5.0, [0.0, 0.0, 10.0, 1.0], modelJetpack));
                jetpacks[0].scale = [20, 20, 20];
                jetpacks.push(initBuffersModel(gl, 1, 1, 1, lane2, 0.15, -12.0, [0.0, 0.0, 10.0, 1.0], modelJetpack));
                jetpacks[1].scale = [20, 20, 20];
                /**********************************************************************/
              })
            })
            
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
      if(speed == 0 && e.keyCode){
        speed = -0.5 * 1.2;
        inspector_speed = -0.5;
      }
      if(e.keyCode == 37){
        if(player.location[0] > -16.5 )
          player.location[0] -= 16.5;
      }
      else if(e.keyCode == 39){
        if(player.location[0] < 16.5 )
        player.location[0] += 16.5;

      }
      else if(e.keyCode == 32){
        if(player.y_speed == 0 && jetpack_timer == -1){
          player.y_speed = 0.7;
        }
      }
      else if(e.keyCode == 38){
        // Up
        //player.location[2] -= 0.8;
      }
      else if(e.keyCode == 40){
        //Down
        //player.location[2] += 0.8;
      }
      else if(e.keyCode == 81){
        // q
        player.location[1] -= 0.1;
      }
    }
    /************************************************************/
    /***********************  tick  *****************************/
    //player.location[2] -= 0.05;
    if((inspector.location[2] * inspector.scale[2]) <= (player.location[2] * player.scale[2])){
      alert("GAME OVER! YOU HAVE BEEN CAUGHT BY INSPECTOR!");
    }
    inspector.location[2] += inspector_speed;
    if(last_collision!=-1){
      if((timer - last_collision) >= 300){
        //alert("DONE!");
        last_collision = -1;
        speed *= 2;
      }
    }
    if(jetpack_timer != -1){
      if((timer - jetpack_timer) >= 300){
        jetpack_timer = -1;
        player.location[1] = 1;
        gravity_effect = 1;
      }
    }
    player.location[2] += speed;
    player.location[1] = player.location[1] + player.y_speed;
    if(player.location[1] > 1.0 && gravity_effect == 1)
      player.y_speed -= 0.03;
    else
      player.y_speed = 0.0;
    // Check collision with coins
    for(var i = 0; i < coins.length; ++i){
      var player_pos_z = player.location[2] * player.scale[2];
      var coin_pos_z = (coins[i].location[2] * coins[i].scale[2]);

      var player_pos_x = player.location[0] * player.scale[0];
      var coin_pos_x = (coins[i].location[0] * coins[i].scale[0]);

      var player_pos_y = player.location[1] * player.scale[1];
      var coin_pos_y = (coins[i].location[1] * coins[i].scale[1]);
      if(Math.abs(coin_pos_z - player_pos_z) <= 0.2 && Math.abs(coin_pos_x - player_pos_x) <= 0.2 && Math.abs(coin_pos_y - player_pos_y - 2) <= 3)
      {
        coins.splice(i, 1);
        score += 10;
        document.getElementById('coin_sound').play();
        i = i - 1;
      }
    }
    // Check collision with trains(TYPE1 Obstacle)
    for(var i = 0; i < trains.length; ++i){
      var player_pos_z = player.location[2] * player.scale[2];
      var train_pos_z = (trains[i].location[2] * trains[i].scale[2]);

      var player_pos_x = player.location[0] * player.scale[0];
      var train_pos_x = (trains[i].location[0] * trains[i].scale[0]);

      var player_pos_y = player.location[1] * player.scale[1];
      var train_pos_y = (trains[i].location[1] * trains[i].scale[1]);
      if(Math.abs(train_pos_z - player_pos_z) <= 7 && Math.abs(train_pos_x - player_pos_x) <= 0.1 && player_pos_y <= 7.2)
      {
        //trains.splice(i, 1);
        alert("GAME OVER! YOU WERE HIT BY A TRAIN!");
        //i = i - 1;
      }
    }
    // Check collision with road barriers(TYPE2 Obstacles)
    for(var i = 0; i < barriers.length; ++i){
      var player_pos_z = player.location[2] * player.scale[2];
      var barrier_pos_z = (barriers[i].location[2] * barriers[i].scale[2]);

      var player_pos_x = player.location[0] * player.scale[0];
      var barrier_pos_x = (barriers[i].location[0] * barriers[i].scale[0]);

      var player_pos_y = player.location[1] * player.scale[1];
      var barrier_pos_y = (barriers[i].location[1] * barriers[i].scale[1]);
      if(Math.abs(barrier_pos_z - player_pos_z) <= 2 && Math.abs(barrier_pos_x - player_pos_x) <= 0.1 && player_pos_y <= 1.6)
      {
        barriers.splice(i, 1);
        last_collision = timer;
        speed /= 2;
      }
    }

    for(var i = 0; i < jetpacks.length; ++i){
      var player_pos_z = player.location[2] * player.scale[2];
      var jetpack_pos_z = (jetpacks[i].location[2] * jetpacks[i].scale[2]);
    
      var player_pos_x = player.location[0] * player.scale[0];
      var jetpack_pos_x = (jetpacks[i].location[0] * jetpacks[i].scale[0]);

      var player_pos_y = player.location[1] * player.scale[1];
      var jetpack_pos_y = (jetpacks[i].location[1] * jetpacks[i].scale[1]);
      if(Math.abs(jetpack_pos_z - player_pos_z) <= 0.1 && Math.abs(jetpack_pos_x - player_pos_x) <= 0.1 && player_pos_y <= 4)
      {
        jetpack_timer = timer;
        player.location[1] = 23;
        gravity_effect = 0;
      }
    }
    //console.log("TRAIN: " + (trains[0].location[0] * trains[0].scale[0]) + " " + (trains[0].location[1] * trains[0].scale[1]) + " " + (trains[0].location[2] * trains[0].scale[2]));
    //console.log("PLAYER: " + (player.location[0] * player.scale[0]) + " " + (player.location[1] * player.scale[1]) + " " + (player.location[2] * player.scale[2]));
    //console.log("COIN: " + (barriers[0].location[0] * barriers[0].scale[0]) + " " + (barriers[0].location[1] * barriers[0].scale[1]) + " " + (barriers[0].location[2] * barriers[0].scale[2]));
    timer++;
    /************************************************************/
    /************************** Camera **************************/
    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 250.0;
    const projectionMatrix = mat4.create();
    var eye, look, up;
    if(speed != 0 && jetpack_timer == -1){
      eye = [0, 8.5, (player.location[2] * player.scale[2]) + 20];
      look = [0, 0, player.location[2] * player.scale[2]];
      up = [0, 1, 0];
    }
    else if(speed != 0){
      eye = [0, 11.5, (player.location[2] * player.scale[2]) + 20];
      look = [0, 8, player.location[2] * player.scale[2]];
      up = [0, 1, 0];
    }
    else{
      eye = [0, 8.5, 54];
      look = [0, 0, player.location[2] * player.scale[2]];
      up = [0, 1, 0];
    }
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
    drawObjectTextured(gl, programInfoTextured, inspector, deltaTime, viewProjectionMatrix, textureInspector);
    // Drawing the trains
    for(var i = 0; i < trains.length; ++i)
      drawObjectTextured(gl, programInfoTextured, trains[i], deltaTime, viewProjectionMatrix, textureTrain);
    for(var i = 0; i < coins.length; ++i)
      drawObjectTextured(gl, programInfoTextured, coins[i], deltaTime, viewProjectionMatrix, textureCoin);
    for(var i = 0; i < barriers.length; ++i)
      drawObjectTextured(gl, programInfoTextured, barriers[i], deltaTime, viewProjectionMatrix, textureBarrier);
    for(var i = 0; i < jetpacks.length; ++i)
      drawObjectTextured(gl, programInfoTextured, jetpacks[i], deltaTime, viewProjectionMatrix, textureJetpack);
    requestAnimationFrame(render);
    /*****************************************************************/
  }
  //requestAnimationFrame(render);
}