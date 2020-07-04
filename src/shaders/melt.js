export default `
void main(){
  //get current pixel position
  vec2 pos = tc;
  vec2 pos2 = tc;
  pos2.y = 1.0 - pos2.y;
  pos2.x = 1.0 - pos2.x;
  //sample color at that position
  vec3 color = texture2D(u_texture1, pos).rgb;
  vec3 finalColor = color;
  vec3 oldColor = color;
  // vec3 color2 = texture2D(u_previous_texture, pos2).rgb;

  //--ALPHA CHANGE BLOCK--//
  // //linear interpolate based on current mouse posit
  // vec2 mouseLerp = vec2(mix(-0.01, 0.01, (u_mouse.x)));
  // //if red is high
  // if (color.r > 0.5){
  // 	//get set new pixel coordinate location
  // 	vec2 newCoords = vec2(pos.x, pos.y + mouseLerp.y);
  // 	//sample color at that new location and set to texture
  // 	color.r = texture2D(u_texture, newCoords).r;
  // }
  //--END ALPHA CHANGE BLOCK--//
  //get new pixel coordinate location based on u_time
  vec2 e = 0.5 / u_resolution.xy;
  float am1 = 0.5;
  float am2 = 10.0;
  
  for (float i = 0.0; i < 2.0; i += 1.0 ){
    float amt = 200.0;
    float h = dot(texture2D(u_texture0, pos * amt).xyz, vec3(0.5));
    
    float h2 = dot(texture2D(u_texture0, pos + vec2(0.001, pos.y)).xyz, vec3(0.5));
    vec2 g = 0.005 * vec2(h2 - h) / e;
    
    pos.y += g.y * (u_warp * 20.0) / (200.0 / u_warp * u_time);
    vec3 newColor = texture2D(u_texture1, pos).rgb;
    oldColor = newColor;
    finalColor = rgb2hsl(newColor);


  }
  gl_FragColor = vec4(mix(oldColor, finalColor, sin(u_time)), 1.0);
}
`;
