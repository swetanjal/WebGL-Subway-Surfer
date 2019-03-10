main();

//
// Start here
//
function main() {
  document.getElementById('backaudio').play();
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
  /******************************* SHADERS FOR GRAYSCALE WORLD ****************************************/
  const vsSourceTexturedgs = getVertexShaderTextured();

  // Fragment shader program

  const fsSourceTexturedgs = getFragmentShaderGrayscale();

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgramTexturedgs = initShaderProgram(gl, vsSourceTexturedgs, fsSourceTexturedgs);
  const programInfoTexturedgs = {
    program: shaderProgramTexturedgs,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgramTexturedgs, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgramTexturedgs, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgramTexturedgs, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgramTexturedgs, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgramTexturedgs, 'uSampler'),
    },
  };
  /*********************************************************************************************/
  /******************************** SHADER FOR LIGHTING WALL ***********************************/
  const vsSourceWall = getVertexShaderWall();

  // Fragment shader program

  const fsSourceWall = getFragmentShaderWall();

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgramWall = initShaderProgram(gl, vsSourceWall, fsSourceWall);
  const programInfoWall = {
    program: shaderProgramWall,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgramWall, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgramWall, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgramWall, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgramWall, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgramWall, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgramWall, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderProgramWall, 'uSampler'),
    },
  };
  /**********************************************************************************************/
  /************************** Gray scale shader for lighting wall ********************************/
  const vsSourceWallgs = getVertexShaderWall();

  // Fragment shader program

  const fsSourceWallgs = getFragmentShaderWallgs();

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgramWallgs = initShaderProgram(gl, vsSourceWallgs, fsSourceWallgs);
  const programInfoWallgs = {
    program: shaderProgramWallgs,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgramWallgs, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgramWallgs, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgramWallgs, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgramWallgs, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgramWallgs, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgramWallgs, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderProgramWallgs, 'uSampler'),
    },
  };
  /**********************************************************************************************/
  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  var PROGRAMINFO = programInfoTextured;
  var bonus_box;
  var dog;
  var barrels = [];
  var cones = [];
  var walls = [];
  var boots = [];
  var tracks = [];
  var trains = [];
  var coins = [];
  var barriers = [];
  var jetpacks = [];
  var player;
  var inspector;
  var then = 0;
  var textureTrain;
  var textureBarrel;
  var textureDog;
  var textureMystery;
  var textureTrack;
  var texturePlayer;
  var textureCone;
  var textureInspector;
  var textureCoin;
  var textureBarrier;
  var textureJetpack;
  var textureBoot;
  var gravity_effect = 1;
  var score = 0;
  var speed = -0.0;
  var SPEED;
  var inspector_speed = 0.0;
  var timer = 0.0;
  var last_collision = -1;
  var jetpack_timer = -1;
  var jump_speed = 0.7;
  var jump_timer = -1;
  var grayscale_timer = -1;
  var flash_timer = 0;
  var light = 0;
  var coin_sound = document.getElementById('coin_sound');
  loadJSONResource('./tracks.json', function (modelErr, modelTrack) {
    loadJSONResource('./train.json', function(modelErr2, modelTrain){
      loadJSONResource('./player.json', function(modelErr3, modelPlayer){
        loadJSONResource('./inspector.json', function(modelErr4, modelInspector){
          loadJSONResource('./coin.json', function(modelErr5, modelCoin){
            loadJSONResource('./roadbarrier.json', function(modelErr6, modelBarrier){
              loadJSONResource('./jetpack.json', function(modelErr7, modelJetpack){
                loadJSONResource('./boots.json', function(modelErr8, modelBoot){
                  loadJSONResource('./cone.json', function(modelErr9, modelCone){
                    loadJSONResource('./barrel.json', function(modelErr10, modelBarrel){
                      loadJSONResource('./mystery.json', function(modelErr11, modelMystery){
                        loadJSONResource('./dog.json', function(modelErr12, modelDog){
                          textureDog = loadTexture(gl, 'dog.png');
                          textureMystery = loadTexture(gl, 'mystery.png');
                          textureBarrel = loadTexture(gl, 'barrel.png');
                          textureCone = loadTexture(gl, 'cone.png');
                          textureWall = loadTexture(gl, 'wall.png');
                          textureBoot = loadTexture(gl, 'boots.png');
                          textureJetpack = loadTexture(gl, 'jetpack.png');
                          textureCoin = loadTexture(gl, 'coin.png');
                          textureTrain = loadTexture(gl, 'train.png');
                          textureTrack = loadTexture(gl, 'tracks.png');
                          texturePlayer = loadTexture(gl, 'player.png');
                          textureInspector = loadTexture(gl, 'inspector.png');
                          textureBarrier = loadTexture(gl, 'roadbarrier.png');
                          /* Creating walls */
                          for(var i = 55; i >= -200; i-=2){
                            walls.push(initBuffersWall(gl, 1, 1, 1, -10, 2, i, [1.0, 1.0, 1.0, 1.0]));
                            walls.push(initBuffersWall(gl, 1, 1, 1, -10, 4, i, [1.0, 1.0, 1.0, 1.0]));
                            //walls.push(initBuffersWall(gl, 1, 1, 1, -10, 6, i, [1.0, 1.0, 1.0, 1.0]));
                          }
                          for(var i = 55; i >= -200; i-=2){
                            walls.push(initBuffersWall(gl, 1, 1, 1, 10, 2, i, [1.0, 1.0, 1.0, 1.0]));
                            walls.push(initBuffersWall(gl, 1, 1, 1, 10, 4, i, [1.0, 1.0, 1.0, 1.0]));
                            //walls.push(initBuffersWall(gl, 1, 1, 1, 10, 6, i, [1.0, 1.0, 1.0, 1.0]));
                          }
                          /* Generating trains */
                          var L1 = 0;
                          var L0 = -23;
                          var L2 = 23;
                          trains.push(initBuffersModel(gl, 1, 1, 1, L0, 2, -450, [1.0, 1.0, 0.0, 1.0],modelTrain));
                          trains[0].rotation = 180;
                          trains[0].scale = [0.25, 0.25, 0.25];
    
                          trains.push(initBuffersModel(gl, 1, 1, 1, L1, 2, -270 / trains[0].scale[2], [1.0, 1.0, 0.0, 1.0],modelTrain));
                          trains[1].rotation = 180;
                          trains[1].scale = [0.25, 0.25, 0.25];
    
                          trains.push(initBuffersModel(gl, 1, 1, 1, L1, 2, -500 / trains[0].scale[2], [1.0, 1.0, 0.0, 1.0],modelTrain));
                          trains[2].rotation = 180;
                          trains[2].scale = [0.25, 0.25, 0.25];
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
                          inspector = initBuffersModel(gl, 1, 1, 1, 0, 1.0, 125, [0.0, 0.0, 1.0, 1.0], modelInspector);
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
                          for(var i = -200; i >= -310; i -= 5)
                          {
                            coins.push(initBuffersModel(gl, 1, 1, 1, lane0, 0.4, i / coins[0].scale[2], [0.0, 0.0, 10.0, 1.0], modelCoin));
                            coins[coins.length - 1].scale = [5, 5, 5];
                          }  
                          for(var i = -60; i >= -100; i -= 5)
                          {
                            coins.push(initBuffersModel(gl, 1, 1, 1, lane1, 0.4, i / coins[0].scale[2], [0.0, 0.0, 10.0, 1.0], modelCoin));
                            coins[coins.length - 1].scale = [5, 5, 5];
                          }
                          for(var i = -157; i >= -185; i -= 3)
                          {
                            coins.push(initBuffersModel(gl, 1, 1, 1, lane2, 0.4, i / coins[0].scale[2], [0.0, 0.0, 10.0, 1.0], modelCoin));
                            coins[coins.length - 1].scale = [5, 5, 5];
                          }
                          /******************************************************************/
                          /**************** Creating Barriers *********************************/
                          lane0 = -57;
                          lane1 = 0;
                          lane2 = 57;
                          barriers.push(initBuffersModel(gl, 1, 1, 1, lane1, 9, -100.0, [0.0, 0.0, 10.0, 1.0], modelBarrier));
                          barriers[0].scale = [0.1, 0.1, 0.2];
                          barriers.push(initBuffersModel(gl, 1, 1, 1, lane1, 9, -200.0, [0.0, 0.0, 10.0, 1.0], modelBarrier));
                          barriers[1].scale = [0.1, 0.1, 0.2];
    
                          barriers.push(initBuffersModel(gl, 1, 1, 1, lane1, 9, -125.0 / barriers[0].scale[2], [0.0, 0.0, 10.0, 1.0], modelBarrier));
                          barriers[barriers.length - 1].scale = [0.1, 0.1, 0.2];
    
                          barriers.push(initBuffersModel(gl, 1, 1, 1, lane0, 9, -335.0 / barriers[0].scale[2], [0.0, 0.0, 10.0, 1.0], modelBarrier));
                          barriers[barriers.length - 1].scale = [0.1, 0.1, 0.2];
    
                          barriers.push(initBuffersModel(gl, 1, 1, 1, lane0, 9, -385.0 / barriers[0].scale[2], [0.0, 0.0, 10.0, 1.0], modelBarrier));
                          barriers[barriers.length - 1].scale = [0.1, 0.1, 0.2];
    
                          barriers.push(initBuffersModel(gl, 1, 1, 1, lane1, 9, -390.0 / barriers[0].scale[2], [0.0, 0.0, 10.0, 1.0], modelBarrier));
                          barriers[barriers.length - 1].scale = [0.1, 0.1, 0.2];
    
                          barriers.push(initBuffersModel(gl, 1, 1, 1, lane2, 9, -400.0 / barriers[0].scale[2], [0.0, 0.0, 10.0, 1.0], modelBarrier));
                          barriers[barriers.length - 1].scale = [0.1, 0.1, 0.2];
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
                          /****************** Creating Jumping boots ******************************/
                          lane0 = -23.08;
                          lane1 = 0.0;
                          lane2 = 23.08;
                          boots.push(initBuffersModel(gl, 1, 1, 1, lane2, 6.0, -90.0 / 0.25, [0.0, 0.0, 10.0, -10.0], modelBoot));
                          boots[0].scale = [0.25, 0.25, 0.25];
                          boots.push(initBuffersModel(gl, 1, 1, 1, lane1, 6.0, -1000, [0.0, 0.0, 10.0, -10.0], modelBoot));
                          boots[1].scale = [0.25, 0.25, 0.25];
                          /************************************************************************/
                          /****************** Creating traffic cones(BONUS TYPE2 Obstacles) *******/
                          lane0 = -28.85;
                          lane1 = 0.0;
                          lane2 = 28.85;
                          cones.push(initBuffersModel(gl, 1, 1, 1, lane2, 1.5, -100.0, [0.0, 0.0, 10.0, -10.0], modelCone));
                          cones[0].scale = [0.2, 0.2, 0.2];
                          cones.push(initBuffersModel(gl, 1, 1, 1, lane1, 1.5, -130.0 / cones[0].scale[2], [0.0, 0.0, 10.0, -10.0], modelCone));
                          cones[cones.length - 1].scale = [0.2, 0.2, 0.2];
    
                          cones.push(initBuffersModel(gl, 1, 1, 1, lane1, 1.5, -135.0 / cones[0].scale[2], [0.0, 0.0, 10.0, -10.0], modelCone));
                          cones[cones.length - 1].scale = [0.2, 0.2, 0.2];
    
                          cones.push(initBuffersModel(gl, 1, 1, 1, lane1, 1.5, -140.0 / cones[0].scale[2], [0.0, 0.0, 10.0, -10.0], modelCone));
                          cones[cones.length - 1].scale = [0.2, 0.2, 0.2];
    
                          cones.push(initBuffersModel(gl, 1, 1, 1, lane1, 1.5, -146.0 / cones[0].scale[2], [0.0, 0.0, 10.0, -10.0], modelCone));
                          cones[cones.length - 1].scale = [0.2, 0.2, 0.2];
    
                          cones.push(initBuffersModel(gl, 1, 1, 1, lane2, 1.5, -140.0 / cones[0].scale[2], [0.0, 0.0, 10.0, -10.0], modelCone));
                          cones[cones.length - 1].scale = [0.2, 0.2, 0.2];
    
                          cones.push(initBuffersModel(gl, 1, 1, 1, lane2, 1.5, -146.0 / cones[0].scale[2], [0.0, 0.0, 10.0, -10.0], modelCone));
                          cones[cones.length - 1].scale = [0.2, 0.2, 0.2];
    
                          cones.push(initBuffersModel(gl, 1, 1, 1, lane0, 1.5, -315.0 / cones[0].scale[2], [0.0, 0.0, 10.0, -10.0], modelCone));
                          cones[cones.length - 1].scale = [0.2, 0.2, 0.2];
    
                          cones.push(initBuffersModel(gl, 1, 1, 1, lane1, 1.5, -410.0 / cones[0].scale[2], [0.0, 0.0, 10.0, -10.0], modelCone));
                          cones[cones.length - 1].scale = [0.2, 0.2, 0.2];
    
                          cones.push(initBuffersModel(gl, 1, 1, 1, lane2, 1.5, -420.0 / cones[0].scale[2], [0.0, 0.0, 10.0, -10.0], modelCone));
                          cones[cones.length - 1].scale = [0.2, 0.2, 0.2];
    
                          cones.push(initBuffersModel(gl, 1, 1, 1, lane2, 1.5, -425.0 / cones[0].scale[2], [0.0, 0.0, 10.0, -10.0], modelCone));
                          cones[cones.length - 1].scale = [0.2, 0.2, 0.2];
                          /************************************************************************/
                          /********************** Creating barrels (BONUS TYPE1 Obstacles) ********/
                          lane0 = -28.85;
                          lane1 = 0.0;
                          lane2 = 28.85;
                          barrels.push(initBuffersModel(gl, 1, 1, 1, lane0, 0.0, -800.0, [0.0, 0.0, 10.0, -10.0], modelBarrel));
                          barrels[0].scale = [0.2, 0.2, 0.2];
                          barrels.push(initBuffersModel(gl, 1, 1, 1, lane2, 0.0, -380.0 / barrels[0].scale[2], [0.0, 0.0, 10.0, -10.0], modelBarrel));
                          barrels[1].scale = [0.2, 0.2, 0.2];
                          /************************************************************************/
                          // Creating bonus box
                          bonus_box = initBuffersModel(gl, 1, 1, 1, 0.0, 0.4, -440 * 1.0/ 8, [0.0, 0.0, 10.0, -10.0], modelMystery);
                          bonus_box.scale = [8, 8, 8];
                          // Creating dog
                          dog = initBuffersModel(gl, 1, 1, 1, 0.0, 0.0, 0.0, [0.0, 0.0, 10.0, -10.0], modelDog);
                          dog.rotation = 180;
                          dog.scale = [0.5, 0.5, 0.5];
                        })
                      })
                    })
                  })
                  
                })
                
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
        SPEED = speed;
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
          player.y_speed = jump_speed;
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
        //player.location[1] -= 0.1;
      }
      else if(e.keyCode == 71){
        grayscale_timer = timer;
        PROGRAMINFO = programInfoTexturedgs;
      }
    }
    /************************************************************/
    /***********************  tick  *****************************/
    dog.location[2] = ((player.location[2] * player.scale[2]) + 7) / dog.scale[2];
    dog.location[0] = ((player.location[0] * player.scale[0])) / dog.scale[0];
    if((player.location[2] * player.scale[2]) <= -450){
      alert("Well done! You are safe from the inspector!");
      location.reload();
    }
    if(Math.abs((player.location[2] * player.scale[2]) - (trains[2].location[2] * trains[2].scale[2])) <= 215)
    {
      trains[2].location[2] += 3;
    }
    if((timer - flash_timer) > 75){
      flash_timer = timer;
      light = 1 - light;
    }
    //player.location[2] -= 0.05;
    if((inspector.location[2] * inspector.scale[2]) <= (player.location[2] * player.scale[2])){
      alert("GAME OVER! YOU HAVE BEEN CAUGHT BY INSPECTOR!");
      location.reload();
    }
    inspector.location[2] += inspector_speed;
    if(last_collision!=-1){
      if((timer - last_collision) >= 300){
        //alert("DONE!");
        last_collision = -1;
        speed *= 2;
        if(speed == SPEED)
          inspector.location[2] = ((player.location[2] * player.scale[2]) + 45) * 1.0/ inspector.scale[2];
      }
    }
    if(jetpack_timer != -1){
      if((timer - jetpack_timer) >= 300){
        jetpack_timer = -1;
        player.location[1] = 1;
        gravity_effect = 1;
      }
    }
    if(jump_timer != -1){
      if((timer - jump_timer) >= 600){
        jump_timer = -1;
        jump_speed = 0.7;
      }
    }
    if(grayscale_timer != -1){
      if((timer - grayscale_timer) >= 300){
        PROGRAMINFO = programInfoTextured;
        grayscale_timer = -1;
      }
    }
    if(speed != 0){
      for(var i = 0; i < walls.length; ++i){
        //if((player.location[2] * player.scale[2]) + 30 < walls[i].location[2])
        //{
          //walls.push(initBuffersWall(gl, 1, 1, 1, walls[i].location[0], walls[i].location[1], walls[walls.length - 1].location[2] - 2, [1.0, 1.0, 1.0, 1.0]));
          //walls.splice(i, 1);
          //i = i - 1;
          walls[i].location[2] += (speed * player.scale[2]);
          
        //}
      }
    }
    player.location[2] += speed;
    player.location[1] = Math.max(1, player.location[1] + player.y_speed);
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
        var tmp = coin_sound.cloneNode();
        tmp.play();
        i = i - 1;
      }
    }
    if(Math.abs(bonus_box.location[2]*bonus_box.scale[2] - player.location[2] * player.scale[2]) <= 0.1 && (player.location[1] * player.scale[1]) <= 0.35
    && Math.abs(bonus_box.location[0]*bonus_box.scale[0] - player.location[0] * player.scale[0]) <= 0.1){
      player.rotation = 0;
      dog.rotation = 0;
      //dog.location[2] = ((player.location[2] * player.scale[2]) + 5) / dog.scale[2];
      //alert("HI");
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
        location.reload();
        //i = i - 1;
      }
    }

    for(var i = 0; i < barrels.length; ++i){
      var player_pos_z = player.location[2] * player.scale[2];
      var barrel_pos_z = (barrels[i].location[2] * barrels[i].scale[2]);

      var player_pos_x = player.location[0] * player.scale[0];
      var barrel_pos_x = (barrels[i].location[0] * barrels[i].scale[0]);

      var player_pos_y = player.location[1] * player.scale[1];
      var barrel_pos_y = (barrels[i].location[1] * barrels[i].scale[1]);
      if(Math.abs(barrel_pos_z - player_pos_z) <= 2 && Math.abs(barrel_pos_x - player_pos_x) <= 0.1 && player_pos_y <= 6.3)
      {
        //trains.splice(i, 1);
        alert("GAME OVER! YOU WERE HIT BY A BARREL!");
        location.reload();
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
        i = i - 1;
      }
    }

    // Check collision with road barriers(TYPE2 Obstacles)
    for(var i = 0; i < cones.length; ++i){
      var player_pos_z = player.location[2] * player.scale[2];
      var cone_pos_z = (cones[i].location[2] * cones[i].scale[2]);

      var player_pos_x = player.location[0] * player.scale[0];
      var cone_pos_x = (cones[i].location[0] * cones[i].scale[0]);

      var player_pos_y = player.location[1] * player.scale[1];
      var cone_pos_y = (cones[i].location[1] * cones[i].scale[1]);
      if(Math.abs(cone_pos_z - player_pos_z) <= 2 && Math.abs(cone_pos_x - player_pos_x) <= 0.1 && player_pos_y <= 1.33)
      {
        cones.splice(i, 1);
        last_collision = timer;
        speed /= 2;
        i = i - 1;
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

    for(var i = 0; i < boots.length; ++i){
      var player_pos_z = player.location[2] * player.scale[2];
      var boot_pos_z = (boots[i].location[2] * boots[i].scale[2]);
    
      var player_pos_x = player.location[0] * player.scale[0];
      var boot_pos_x = (boots[i].location[0] * boots[i].scale[0]);

      var player_pos_y = player.location[1] * player.scale[1];
      var boot_pos_y = (boots[i].location[1] * boots[i].scale[1]);
      if(Math.abs(boot_pos_z - player_pos_z) <= 0.1 && Math.abs(boot_pos_x - player_pos_x) <= 0.1 && player_pos_y <= 0.84)
      {
        boots.splice(i, 1);
        jump_timer = timer;
        i = i - 1;
        jump_speed = 1.0;
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
      eye = [0, 11.5, (player.location[2] * player.scale[2]) + 25];
      look = [0, 8, player.location[2] * player.scale[2]];
      up = [0, 1, 0];
    }
    else{
      eye = [0, 8.5, 68];
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
      drawObjectTextured(gl, PROGRAMINFO, tracks[i], deltaTime, viewProjectionMatrix, textureTrack);
    }
    drawObjectTextured(gl, PROGRAMINFO, dog, deltaTime, viewProjectionMatrix, textureDog);
    drawObjectTextured(gl, PROGRAMINFO, player, deltaTime, viewProjectionMatrix, texturePlayer);
    drawObjectTextured(gl, PROGRAMINFO, inspector, deltaTime, viewProjectionMatrix, textureInspector);
    // Drawing the trains
    for(var i = 0; i < trains.length; ++i)
      drawObjectTextured(gl, PROGRAMINFO, trains[i], deltaTime, viewProjectionMatrix, textureTrain);
    for(var i = 0; i < coins.length; ++i)
      drawObjectTextured(gl, PROGRAMINFO, coins[i], deltaTime, viewProjectionMatrix, textureCoin);
    for(var i = 0; i < barriers.length; ++i)
      drawObjectTextured(gl, PROGRAMINFO, barriers[i], deltaTime, viewProjectionMatrix, textureBarrier);
    for(var i = 0; i < jetpacks.length; ++i)
      drawObjectTextured(gl, PROGRAMINFO, jetpacks[i], deltaTime, viewProjectionMatrix, textureJetpack);
    for(var i = 0; i < boots.length; ++i)
      drawObjectTextured(gl, PROGRAMINFO, boots[i], deltaTime, viewProjectionMatrix, textureBoot);
    
    drawObjectTexturedMystery(gl, PROGRAMINFO, bonus_box, deltaTime, viewProjectionMatrix, textureMystery);
    for(var i = 0; i < cones.length; ++i)
      drawObjectTexturedCone(gl, PROGRAMINFO, cones[i], deltaTime, viewProjectionMatrix, textureCone);
    for(var i = 0; i < barrels.length; ++i)
      drawObjectTexturedCone(gl, PROGRAMINFO, barrels[i], deltaTime, viewProjectionMatrix, textureBarrel);
    for(var i = 0; i < walls.length; ++i){
      if(light && grayscale_timer == -1)
        drawObjectWall(gl, programInfoWall, walls[i], deltaTime, viewProjectionMatrix, textureWall);
      else if(light)
      drawObjectWall(gl, programInfoWallgs, walls[i], deltaTime, viewProjectionMatrix, textureWall);
      else
        drawObjectWall(gl, PROGRAMINFO, walls[i], deltaTime, viewProjectionMatrix, textureWall);
    }
    document.title = "Score: " + score;
    requestAnimationFrame(render);
    /*****************************************************************/
  }
  //requestAnimationFrame(render);
}