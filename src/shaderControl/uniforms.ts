import { Slab } from './Slab';

let uniforms = {
  u_warp: 0.025,
  u_mixin: 0.1,
  u_aspect: 1,
  u_mouse: [0.5, 0.5],
  u_time: 0.0,
  u_resolution: [512,512]
};

export function updateUniforms(newUniforms: any) {
  uniforms = {
    ...uniforms,
    ...newUniforms,
  };
  return uniforms;
}

export function getUniforms(gl: WebGLRenderingContext, slab: Slab) {
  const u = updateUniforms({});
  gl.useProgram(slab.program);
  gl.uniform1f(gl.getUniformLocation(slab.program, 'u_warp'), u.u_warp);
  gl.uniform1f(gl.getUniformLocation(slab.program, 'u_mixin'), u.u_mixin);
  gl.uniform1f(gl.getUniformLocation(slab.program, 'u_aspect'), u.u_aspect);
  gl.uniform2fv(gl.getUniformLocation(slab.program, 'u_mouse'), u.u_mouse);
  gl.uniform1f(gl.getUniformLocation(slab.program, 'u_time'), u.u_time);
  gl.uniform2fv(gl.getUniformLocation(slab.program, 'u_resolution'), u.u_resolution);
}
