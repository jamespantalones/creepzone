export class BackBuffer {
  gl: WebGLRenderingContext;
  colorBuffer!: WebGLBuffer;
  texBuffer!: WebGLBuffer;
  vertBuffer!: WebGLBuffer;
  constructor(gl: WebGLRenderingContext){
    this.gl = gl;
    this.init();
  }

  init(){
    const { gl } = this;
    this.vertBuffer = gl.createBuffer()!;
    this.initBuffer(this.vertBuffer, [
      -1.0,
      1.0,
      0.0,
      -1.0,
      -1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0,
      -1.0,
      0.0
    ]);
    // L232 in pxslabs.js
    this.texBuffer = gl.createBuffer()!;
    this.initBuffer(this.texBuffer!, [0,1,0,0,1,1,1,0]);

    this.colorBuffer = gl.createBuffer()!;
    this.initBuffer(this.colorBuffer, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  }

  initBuffer(buffer: WebGLBuffer, dataset: number[]){
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dataset), gl.STATIC_DRAW);
  }

  backBufferPredraw(program: WebGLProgram){
    const { gl } = this;
    gl.useProgram(program);

    const a_pos = gl.getAttribLocation(program, 'pos');
    gl.enableVertexAttribArray(a_pos);

    const a_color = gl.getAttribLocation(program, 'color');
    gl.enableVertexAttribArray(a_color);

    const a_tex = gl.getAttribLocation(program, 'texcoord');
    gl.enableVertexAttribArray(a_tex);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.vertexAttribPointer(a_color, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
    gl.vertexAttribPointer(a_pos, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
    gl.vertexAttribPointer(a_tex, 2, gl.FLOAT, false, 0, 0);
  }

  backBufferDraw1(program: WebGLProgram, texture: WebGLTexture){
    const { gl } = this;
    this.backBufferPredraw(program);
    gl.uniform1i(gl.getUniformLocation(program, 'u_texture0'), 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  backBufferDraw2(program: WebGLProgram, texture1: WebGLTexture, texture2: WebGLTexture){
    const { gl } = this;
    this.backBufferPredraw(program);
    gl.uniform1i(gl.getUniformLocation(program, 'u_texture0'), 0);
    gl.uniform1i(gl.getUniformLocation(program, 'u_texture1'), 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  backBufferDraw3(program: WebGLProgram, texture1: WebGLTexture, texture2: WebGLTexture, texture3: WebGLTexture){
    const { gl } = this;
    this.backBufferPredraw(program);
    gl.uniform1i(gl.getUniformLocation(program, 'u_texture0'), 0);
    gl.uniform1i(gl.getUniformLocation(program, 'u_texture1'), 1);
    gl.uniform1i(gl.getUniformLocation(program, 'u_texture2'), 2);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture3);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  backBufferDraw4(program: WebGLProgram, texture1: WebGLTexture, texture2: WebGLTexture, texture3: WebGLTexture, texture4: WebGLTexture){
    const { gl } = this;
    this.backBufferPredraw(program);
    gl.uniform1i(gl.getUniformLocation(program, 'u_texture0'), 0);
    gl.uniform1i(gl.getUniformLocation(program, 'u_texture1'), 1);
    gl.uniform1i(gl.getUniformLocation(program, 'u_texture2'), 2);
    gl.uniform1i(gl.getUniformLocation(program, 'u_texture3'), 3);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture3);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texture4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}