var getFragmentShader = function () {
    const fsSource = `
    varying lowp vec4 vColor;
    void main(void) {
      gl_FragColor = vColor;
    }
  `;
    return fsSource;
}