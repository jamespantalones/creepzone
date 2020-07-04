export default `
void main(){
  vec2 pos = tc;
  vec4 color = texture2D(u_texture0, pos);
  vec2 asp = vec2(u_aspect,1.0);
  vec2 wack = tc + (tc - vec2(0.5))
    * clamp(length((tc - vec2(0.5)) * asp ) ,0.0, 1.0)
    *- u_warp * 2.0
    * 0.75 * 2.0;
  vec4 a = texture2D(u_texture0, wack)*0.56-vec4(0.025);
  vec4 b = texture2D(u_texture1, tc);
  vec3 newColor = mix(a, b, sin(u_time * u_mouse.x)).bgr;
  vec3 finalColor = rgb2hsl(newColor) / 0.25;
  gl_FragColor = vec4((newColor / finalColor / 2.0).rgb, 1.0);
}
`;
