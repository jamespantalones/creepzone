import { Slab } from './Slab';
import { Feedback } from './Feedback';
import { getUniforms, updateUniforms } from './uniforms';

import { shaders } from '../shaders';

export class ShaderStore {
  aspect!: number;
  canvas: HTMLCanvasElement;
  canvasId: string;
  canvasContainer: HTMLElement;
  delta: number;
  source: HTMLImageElement | HTMLVideoElement;
  gl: WebGLRenderingContext;
  program!: WebGLProgram;
  feedback!: Feedback;
  nextFragmentShader!: Slab;
  shaderTexture!: WebGLTexture;
  shaderName: string;

  constructor(
    canvasContainer: HTMLElement,
    source: HTMLImageElement | HTMLVideoElement,
    shaderName: string,
  ) {
    const { width, height } = canvasContainer.getBoundingClientRect();
    this.canvasContainer = canvasContainer;
    this.destroy();
    this.delta = 0.001;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvasContainer.appendChild(this.canvas);
    this.source = source;
    this.gl = this.canvas.getContext('webgl')!;
    this.shaderName = shaderName;
    this.canvasId = 'asdf';
    this.init();
  }

  init() {
    const { gl, canvas } = this;
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 1);
    gl.viewport(0, 0, canvas.width, canvas.height);

    const s = shaders[this.shaderName];

    const baseVertexShader = this.createShader(s.baseVert, gl.VERTEX_SHADER)!;
    const baseFragmentShader = this.createShader(
      s.baseFrag,
      gl.FRAGMENT_SHADER,
    )!;
    const heightFs = this.createShader(s.fboFrag!, gl.FRAGMENT_SHADER)!;

    console.log(s);

    this.program = this.createProgram(baseVertexShader, baseFragmentShader);

    // create next
    this.nextFragmentShader = new Slab(gl, baseVertexShader, heightFs);
    this.nextFragmentShader.allocate(canvas.width, canvas.height);

    this.feedback = new Feedback(gl);
    this.feedback.allocate2(canvas.width, canvas.height);

    getUniforms(gl, this.nextFragmentShader);

    this.resizeCanvas();
    this.attachInputs();
    this.initSources();
    this.animate();
  }

  attachInputs() {
    window.addEventListener('mousemove', this.handleMouseMove, false);
  }

  handleMouseMove = (ev: MouseEvent) => {
    const { clientX, clientY } = ev;

    const x = (clientX / this.canvas.width) * 2 - 1;
    const y = (clientY / this.canvas.height) * -2 + 1;

    updateUniforms({
      u_mouse: [x, y],
    });
  };

  initSources() {
    const { gl } = this;
    this.shaderTexture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.shaderTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.source,
    );
  }

  animate = () => {
    const { gl } = this;
    requestAnimationFrame(this.animate);
    this.delta += 0.011;
    updateUniforms({
      u_aspect: this.canvas.height / this.canvas.width,
      u_resolution: [this.canvas.width, this.canvas.height],
      u_time: this.delta,
    });
    getUniforms(this.gl, this.nextFragmentShader);

    // clear frame
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.nextFragmentShader.start();

    // clear color buffer
    gl.clear(gl.COLOR_BUFFER_BIT);

    // draw feedback with camera into buffer
    this.feedback.draw2(this.nextFragmentShader.program, this.shaderTexture);

    // bind feedback slab
    this.feedback.start();

    // clear color buffer
    gl.clear(gl.COLOR_BUFFER_BIT);

    // draw buffer into feedback buffer
    this.nextFragmentShader.draw1(this.program);

    // unbind framebuffer so we draw to screen
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // draw buffer to screen
    this.nextFragmentShader.draw1(this.program);

    // update camtex
    gl.bindTexture(gl.TEXTURE_2D, this.shaderTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.source,
    );
  };

  createShader(
    source: string,
    type:
      | WebGLRenderingContext['VERTEX_SHADER']
      | WebGLRenderingContext['FRAGMENT_SHADER'],
  ) {
    const { gl } = this;
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  createProgram(vertex: WebGLShader, fragment: WebGLShader): WebGLProgram {
    const { gl } = this;
    const pg = gl.createProgram()!;
    gl.attachShader(pg, vertex);
    gl.attachShader(pg, fragment);
    gl.linkProgram(pg);
    if (!gl.getProgramParameter(pg, gl.LINK_STATUS)) {
      throw gl.getProgramInfoLog(pg);
    }
    return pg;
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.aspect = this.canvas.width / this.canvas.height;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.feedback.allocate2(this.canvas.width, this.canvas.height);
    this.nextFragmentShader.allocate(this.canvas.width, this.canvas.height);
  }

  destroy() {
    if (this.canvasContainer) {
      while (this.canvasContainer.firstChild) {
        this.canvasContainer.removeChild(this.canvasContainer.lastChild!);
      }
    }
  }
}
