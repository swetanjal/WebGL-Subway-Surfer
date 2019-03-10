var getFragmentShader = function () {
    const fsSource = `
    varying lowp vec4 vColor;
    void main(void) {
      gl_FragColor = vColor;
    }
  `;
    return fsSource;
}

var getFragmentShaderTextured = function() {
  const fsSource = `
    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;
    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;
  return fsSource;
}

var getFragmentShaderGrayscale = function() {
  const fsSource = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;
    void main(void) {
      vec4 color = texture2D(uSampler, vTextureCoord);
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      gl_FragColor = vec4(vec3(gray), 1.0);
    }
  `;
  return fsSource;
}

var getFragmentShaderWall = function(){
  const fsSource = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
  `;
  return fsSource;
}
var getFragmentShaderWallgs = function(){
  const fsSource = `
		#ifdef GL_ES
		precision mediump float;
		#endif
		varying highp vec2 vTextureCoord;
		varying highp vec3 vLighting;
		uniform sampler2D uSampler;
		void main(void) {
			highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
			vec3 color = texelColor.rgb;
			float gray = (color.r + color.g + color.b) / 3.0;
			vec3 gr = vec3(gray);
      gl_FragColor = vec4(gr * vLighting, texelColor.a);
		}
	`;
  return fsSource;
}