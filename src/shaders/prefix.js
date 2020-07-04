export default `
precision mediump float;
varying vec2 tc;
varying vec4 vColor;
uniform sampler2D u_texture0;
uniform sampler2D u_texture1;
uniform sampler2D u_texture2;
uniform sampler2D u_texture3;
uniform float u_warp;
uniform float u_mixin;
uniform float u_aspect;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_time;

vec4 blur5(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3333333333333333) * direction;
  color += texture2D(image, uv) * 0.29411764705882354;
  color += texture2D(image, uv + (off1 / resolution)) * 0.35294117647058826;
  color += texture2D(image, uv - (off1 / resolution)) * 0.35294117647058826;
  return color; 
}

vec3 RGBtoHCV(vec3 rgb) {
  // Based on work by Sam Hocevar and Emil Persson
  vec4 p = (rgb.g < rgb.b) ? vec4(rgb.bg, -1.0, 2.0 / 3.0)
                           : vec4(rgb.gb, 0.0, -1.0 / 3.0);
  vec4 q = (rgb.r < p.x) ? vec4(p.xyw, rgb.r) : vec4(rgb.r, p.yzx);
  float c = q.x - min(q.w, q.y);
  float h = abs((q.w - q.y) / (6.0 * c + 1e-10) + q.z);
  return vec3(h, c, q.x);
}

vec3 rgb2hsl(vec3 rgb) {
  vec3 hcv = RGBtoHCV(rgb);
  float l = hcv.z - hcv.y * 0.5;
  float s = hcv.y / (1.0 - abs(l * 2.0 - 1.0) + 1e-10);
  return vec3(hcv.x, s, l);
}

vec3 rgb2hsl(float r, float g, float b) {
  return rgb2hsl(vec3(r, g, b));
}


`;
