precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;
uniform float u_presence;
uniform float u_drawing;
uniform float u_mono;
uniform float u_offset;
uniform sampler2D u_mask;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  vec2 curve = local * local * (3.0 - 2.0 * local);
  return mix(
    mix(hash(cell), hash(cell + vec2(1.0, 0.0)), curve.x),
    mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), curve.x),
    curve.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float weight = 0.5;
  for (int i = 0; i < 4; i++) {
    value += noise(p) * weight;
    p = p * 2.03 + 0.17;
    weight *= 0.5;
  }
  return value;
}

void main() {
  float rawY = gl_FragCoord.y - u_offset;
  vec2 frag = vec2(gl_FragCoord.x, abs(rawY));
  // Mirror the last shader rows into the bleed so procedural cells do not
  // cross a hard UV boundary at the bottom of the hero.
  vec2 uv = frag / u_resolution;
  float inside = step(0.0, rawY) * step(rawY, u_resolution.y);
  float cleared = texture2D(u_mask, clamp(uv, 0.0, 1.0)).r * inside;
  float aspect = u_resolution.x / u_resolution.y;

  // Two scales keep the veil broad while retaining soft condensation detail.
  float cloud = fbm(uv * vec2(1.35 * aspect, 1.35) + vec2(u_time * 0.011, -u_time * 0.008));
  float wisp = fbm(uv * vec2(3.1 * aspect, 3.1) + vec2(-u_time * 0.008, u_time * 0.013));
  float body = smoothstep(0.28, 0.78, cloud);
  float detail = smoothstep(0.40, 0.76, wisp);

  // The glass is warm on the open side and cooler where the prism converges.
  vec3 warm = vec3(0.84, 0.835, 0.82);
  vec3 cool = vec3(0.68, 0.69, 0.71);
  float cooling = clamp(uv.x * 0.58 + (cloud - 0.5) * 0.34, 0.0, 1.0);
  vec3 color = mix(warm, cool, cooling);

  vec2 pointer = u_pointer / u_resolution;
  vec2 delta = uv - pointer;
  float distanceToPointer = length(vec2(delta.x * aspect, delta.y));
  float hover = smoothstep(0.14, 0.0, distanceToPointer) * u_presence * (1.0 - u_drawing);
  float wipe = smoothstep(0.075, 0.0, distanceToPointer) * u_drawing;

  float alpha = 0.055 + body * 0.15 + detail * 0.035;
  alpha *= 1.0 - hover * 0.10;
  alpha *= 1.0 - wipe * 0.82;
  alpha *= 1.0 - cleared;

  float grain = hash(frag + fract(u_time) * 97.0) - 0.5;
  color += grain * 0.016;
  color = mix(color, vec3(dot(color, vec3(0.299, 0.587, 0.114))), u_mono);

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), clamp(alpha, 0.0, 0.24));
}
