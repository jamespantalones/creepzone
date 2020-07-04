export default `
attribute vec3 pos;
attribute vec4 color;
attribute vec2 texcoord;
varying vec4 vColor;
varying vec2 tc;

void main(){
  gl_Position = vec4(pos, 1.0);
  tc = texcoord;
  vColor = color;
}
`;
