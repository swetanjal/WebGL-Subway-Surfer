var cubeRotation = 0.0;
//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//
function initBuffersCube(gl, l, b, h, x, y, z, col) {

  // Create a buffer for the cube's vertex positions.

  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the cube.

  const positions = [
    // Front face
    -(l / 2) * 1.0, -(b / 2) * 1.0,  (h / 2) * 1.0,
    (l / 2) * 1.0, -(b / 2) * 1.0,  (h / 2) * 1.0,
    (l / 2) * 1.0,  (b / 2) * 1.0, (h / 2) * 1.0,
    -(l / 2) * 1.0,  (b / 2) * 1.0, (h / 2) * 1.0,

    // Back face
    -(l / 2) * 1.0, -(b / 2) * 1.0,  (h / 2) * -1.0,
    (l / 2) * 1.0, -(b / 2) * 1.0,  -(h / 2) *1.0,
    (l / 2) * 1.0,  (b / 2) * 1.0,  -(h / 2) * 1.0,
    -(l / 2) * 1.0,  (b / 2) * 1.0,  -(h / 2) * 1.0,

    // Top face
    -(l / 2) * 1.0, (b / 2) * 1.0, (h / 2) *1.0,
    (l / 2) * 1.0, (b / 2) * 1.0, (h / 2) *1.0,
    (l / 2) * 1.0, (b / 2) * 1.0, -(h / 2) *1.0,
    -(l / 2) * 1.0, (b / 2) * 1.0, -(h / 2) *1.0,
    // Bottom face
    -(l / 2) * 1.0, -(b / 2) * 1.0, (h / 2) *1.0,
    (l / 2) * 1.0, -(b / 2) * 1.0, (h / 2) *1.0,
    (l / 2) * 1.0, -(b / 2) * 1.0, -(h / 2) *1.0,
    -(l / 2) * 1.0, -(b / 2) * 1.0, -(h / 2) *1.0,

    // Left face
    -(l / 2) * 1.0, (b / 2) * 1.0, (h / 2) *1.0,
    -(l / 2) * 1.0, (b / 2) * 1.0, -(h / 2) *1.0,
    -(l / 2) * 1.0, -(b / 2) * 1.0, -(h / 2) *1.0,
    -(l / 2) * 1.0, -(b / 2) * 1.0, (h / 2) *1.0,
    // Right face
    (l / 2) * 1.0, (b / 2) * 1.0, (h / 2) *1.0,
    (l / 2) * 1.0, (b / 2) * 1.0, -(h / 2) *1.0,
    (l / 2) * 1.0, -(b / 2) * 1.0, -(h / 2) *1.0,
    (l / 2) * 1.0, -(b / 2) * 1.0, (h / 2) *1.0,
  ];

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Now set up the colors for the faces. We'll use solid colors
  // for each face.

  const faceColors = [
    [1.0,  0.0,  1.0,  1.0],    // Left face: purple
    [0.0,  0.0,  1.0,  1.0],    // Left face: purple
    [0.0,  1.0,  0.0,  1.0],    // Left face: purple
    [0.0,  1.0,  1.0,  1.0],    // Left face: purple
    [1.0,  1.0,  1.0,  1.0],    // Left face: purple
    [0.3,  0.1,  0.5,  1.0],    // Left face: purple
  ];

  // Convert the array of colors into a table for all the vertices.

  var colors = [];

  for (var j = 0; j < positions.length / 3; ++j) {
    //const c = faceColors[j];

    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(col);
  }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,  // top
    12,  13,  14,   12,  14, 15, // bottom
    16,  17,  18,   16, 18, 19,   // left
    20 , 21 , 22,    20, 22, 23   // right
  ];

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    vertex_count : indices.length,
    location: [x, y, z],
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}


/***********************MODEL IMPORTING ************************************/
function initBuffersModel(gl, l, b, h, x, y, z, col, model) {

  // Create a buffer for the cube's vertex positions.

  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the cube.

  const positions = model.meshes[0].vertices;

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Now set up the colors for the faces. We'll use solid colors
  // for each face.

  const faceColors = [
    [1.0,  0.0,  1.0,  1.0],    // Left face: purple
    [0.0,  0.0,  1.0,  1.0],    // Left face: purple
    [0.0,  1.0,  0.0,  1.0],    // Left face: purple
    [0.0,  1.0,  1.0,  1.0],    // Left face: purple
    [1.0,  1.0,  1.0,  1.0],    // Left face: purple
    [0.3,  0.1,  0.5,  1.0],    // Left face: purple
  ];

  // Convert the array of colors into a table for all the vertices.

  var colors = [];

  for (var j = 0; j < positions.length / 3; ++j) {
    //const c = faceColors[j];

    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(col);
  }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [].concat.apply([], model.meshes[0].faces);

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    vertex_count : indices.length,
    location: [x, y, z],
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}


//
// Draw the scene.
//
function drawObject(gl, programInfo, buffers, deltaTime, projectionMatrix) {
  
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 buffers.location);  // amount to translate

  //Write your code to Rotate the cube here//

  /*mat4.rotate(modelViewMatrix,
              modelViewMatrix,
              cubeRotation,
              [1, 0, 1]);
  mat4.rotate(modelViewMatrix,
    modelViewMatrix,
    cubeRotation,
    [0, 0, 1]);
  */
  
  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const vertexCount = buffers.vertex_count;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

  // Update the rotation for the next draw

  cubeRotation += deltaTime;
}