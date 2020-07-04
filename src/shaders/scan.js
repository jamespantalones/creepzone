export default `
void main(void){
  vec2 ps = tc;
  vec3 col;
  col.r = texture2D(u_texture1, vec2(ps.x + sin(u_warp), ps.y)).x;
  col.g = texture2D(u_texture1, vec2(ps.x + sin(u_warp) * sin(u_time / 100.0), ps.y)).y;
  col.b = texture2D(u_texture1, vec2(ps.x - sin(u_warp), ps.y)).z;

  col = clamp(col / 1.5, 0.0, 1.0);

  float brightness = 1.0;

  col *= brightness + 0.5 * 16.0 * ps.x * ps.y * (1.0 - ps.x) * (ps.y);

  float s = step(sin(u_time / 50.0 / 8.0), 0.0);

  float alt = 10.0 * (u_time / 50.0) + ps.y * s * 100.0;

  // change scan lines a bit
  if (s <= 0.5){
    alt = 10.0 * u_time + ps.y * 800.0;
  }

  col *= 0.9 + 0.1 * sin(alt);
  col *= 0.99;
  col.r *= 1.1;
  col.b = col.b * 1.5;

  gl_FragColor = vec4(col, 1.0);

}
`;
