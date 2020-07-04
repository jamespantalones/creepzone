import { BackBuffer } from "./BackBuffer";

export class Feedback {
  gl: WebGLRenderingContext;
  bb: BackBuffer;
  fbo!: WebGLFramebuffer;
  texture!: WebGLTexture;


  constructor(gl: WebGLRenderingContext){
    this.gl = gl;
    this.bb = new BackBuffer(this.gl);
  }

  start(){
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
  }


  allocate(width: number, height: number){
    const {gl} = this;
    this.fbo = gl.createFramebuffer()!;
    this.texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture,0);
  }

  allocate2(width: number, height: number){
    const {gl} = this;
    // make framebuffer and texture output
    this.fbo = gl.createFramebuffer()!;
    this.texture = gl.createTexture()!;

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.texture,
      0
    );
  }
  draw1(program: WebGLProgram){
    this.bb.backBufferDraw1(program, this.texture);
  }
  draw2(program: WebGLProgram, texture2: WebGLTexture){
    this.bb.backBufferDraw2(program, this.texture, texture2);
  }
  draw3(program: WebGLProgram, texture2: WebGLTexture, texture3: WebGLTexture){
    this.bb.backBufferDraw3(program, this.texture, texture2, texture3);
  }
  draw4(program: WebGLProgram, texture2: WebGLTexture, texture3: WebGLTexture, texture4: WebGLTexture){
    this.bb.backBufferDraw4(program, this.texture, texture2, texture3, texture4);
  }
}