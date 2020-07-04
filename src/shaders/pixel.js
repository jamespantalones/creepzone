export default `

void main() {

  vec2 uv = tc;

  float u_amt = 0.1;

  float pixel_w = (15.0 / u_warp / 5.0) + 5.0;
  float pixel_h = (10.0 / u_warp / 5.0) + 5.0;

  
  float dx = pixel_w*(1.0/u_resolution.x);
  float dy = pixel_h*(1.0/u_resolution.y);
  vec2 asp = vec2(u_aspect,1.0);
  vec2 coord = vec2(dx*floor(uv.x/dx),
                    dy*floor(uv.y/dy));
  vec2 wack = tc + (tc - vec2(0.5))
    * clamp(length((tc - vec2(0.5)) * asp ) ,0.5, 1.0)
    *- u_warp
    * vec2(sin(u_time));

  vec4 a = texture2D(u_texture0, wack)*1.06-vec4(0.025);
  vec4 b = texture2D(u_texture1, coord);
  gl_FragColor = mix(a,b,0.5);
}
`;
