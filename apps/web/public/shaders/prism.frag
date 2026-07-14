precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;
uniform float u_presence;
uniform float u_drawing;
uniform float u_sunlight;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
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

vec3 spectrum(float h) {
  vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return rgb * rgb * (3.0 - 2.0 * rgb);
}

vec3 ray(vec2 p, vec2 apex, vec2 direction, float hue, float reach, float split) {
  vec2 delta = p - apex;
  float along = dot(delta, direction);
  float across = direction.x * delta.y - direction.y * delta.x;
  float forward = smoothstep(-0.02, 0.08, along);
  float width = 0.016 + max(along, 0.0) * 0.18;
  float band = exp(-pow(across / width, 2.0));
  float end = smoothstep(reach, reach - 0.34, along);
  float glow = exp(-max(along, 0.0) * 0.72);
  vec3 color = mix(vec3(0.86, 0.85, 0.84), spectrum(hue - across / width * split), 0.42);
  return color * band * forward * end * (0.34 + glow * 0.9);
}

float caustic(vec2 p, float time) {
  vec2 q = p * 6.28318;
  float value = 0.0;
  for (int i = 0; i < 3; i++) {
    float index = float(i) + 1.0;
    q += vec2(sin(q.y * index + time * 0.2), cos(q.x * index - time * 0.17));
    value += 0.012 / max(abs(sin(q.x) + cos(q.y)), 0.02);
  }
  return clamp(pow(value, 2.2), 0.0, 1.0);
}

float beads(vec2 uv, float time) {
  vec2 cells = uv * 45.0;
  vec2 id = floor(cells);
  vec2 local = fract(cells) - 0.5;
  float random = hash(id);
  vec2 center = vec2(hash(id + 8.3), hash(id + 19.7)) - 0.5;
  float size = mix(0.045, 0.29, random * random);
  float still = smoothstep(size, 0.0, length(local - center * 0.68));
  still *= step(0.16, hash(id + 3.1));

  vec2 grid = uv * vec2(12.0, 2.0);
  vec2 lane = floor(grid);
  vec2 pos = fract(grid) - vec2(0.5, 0.0);
  float seed = hash(lane + 31.4);
  float fall = fract(time * mix(0.035, 0.075, seed) + hash(vec2(lane.x, 4.2)));
  float wave = sin((uv.y + time * 0.025) * 18.0 + seed * 6.0) * 0.08;
  vec2 drop = vec2((seed - 0.5) * 0.52 + wave, fall);
  float body = smoothstep(mix(0.10, 0.25, seed), 0.0, length((pos - drop) * vec2(1.0, 6.0)));
  float trail = smoothstep(0.055, 0.0, abs(pos.x - drop.x));
  trail *= smoothstep(drop.y + 0.03, drop.y + 0.35, pos.y) * smoothstep(1.0, 0.62, pos.y);
  float field = still * 1.6 + body * 0.45 + trail * 0.08;
  return smoothstep(0.30, 1.0, field);
}

vec3 mistScene(vec2 uv, vec2 pointer, float time, float presence) {
  float aspect = u_resolution.x / u_resolution.y;
  vec3 warm = vec3(0.882, 0.875, 0.861);
  vec3 shade = vec3(0.67, 0.665, 0.655);
  float slope = smoothstep(-0.15, 1.25, uv.x + uv.y * 0.26);
  vec3 base = mix(warm, shade, slope * 0.52);
  float cloud = fbm(uv * vec2(2.25 * aspect, 2.25) + vec2(time * 0.012, -time * 0.009));
  base = mix(base, shade, smoothstep(0.42, 0.96, cloud) * 0.27);

  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 apex = vec2((0.96 + sin(time * 0.045) * 0.014) * aspect, 0.51 + sin(time * 0.038) * 0.025);
  vec2 upper = normalize(vec2(0.40 * aspect, 1.07) - apex);
  vec2 lower = normalize(vec2(0.57 * aspect, -0.08) - apex);
  vec2 mp = vec2(pointer.x * aspect, pointer.y);
  float upperHover = smoothstep(0.25, 0.0, abs(upper.x * (mp.y - apex.y) - upper.y * (mp.x - apex.x)));
  float lowerHover = smoothstep(0.25, 0.0, abs(lower.x * (mp.y - apex.y) - lower.y * (mp.x - apex.x)));
  float bloom = smoothstep(0.0, 1.25, time);
  float reach = 0.35 + bloom * 1.5;
  vec3 light = ray(p, apex, upper, 0.58, reach, 0.07 + upperHover * presence * 0.07);
  light += ray(p, apex, lower, 0.04, reach, 0.07 + lowerHover * presence * 0.07);
  light *= 0.69 + caustic(p * 1.8, time) * 0.31;
  float focus = exp(-dot(p - apex, p - apex) * 18.0);
  light += vec3(1.0, 0.92, 0.79) * focus * 0.27 * bloom;
  return 1.0 - (1.0 - base) * (1.0 - clamp(light, 0.0, 1.0));
}

float luminance(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

float box(vec2 p, vec2 size) {
  vec2 distance = abs(p) - size;
  return max(distance.x, distance.y);
}

vec2 windowUv(vec2 uv, float time) {
  vec2 center = vec2(0.56, 0.47) + vec2(sin(time * 0.025), cos(time * 0.021)) * 0.0025;
  vec2 point = uv - center;
  vec2 horizontal = vec2(0.39, -0.11);
  vec2 vertical = vec2(0.13, 0.37);
  float determinant = horizontal.x * vertical.y - horizontal.y * vertical.x;
  vec2 projected = vec2(
    (vertical.y * point.x - vertical.x * point.y) / determinant,
    (-horizontal.y * point.x + horizontal.x * point.y) / determinant
  );
  projected.x *= 0.92 + projected.y * 0.10;
  return projected;
}

vec3 windowLight(vec2 projected) {
  float depth = smoothstep(-0.10, 1.12, -projected.y);
  float penumbra = mix(0.008, 0.045, depth);
  float shape = 1.0 - smoothstep(-penumbra, penumbra, box(projected, vec2(1.0)));
  float border = min(1.0 - abs(projected.x), 1.0 - abs(projected.y));
  float mullion = min(abs(projected.x - 0.02), abs(projected.y - 0.10));
  float opening = smoothstep(0.052 - penumbra, 0.052 + penumbra, border);
  opening *= smoothstep(0.045 - penumbra * 0.52, 0.045 + penumbra, mullion);
  float glass = 0.94 + fbm(projected * vec2(2.1, 2.7) + 7.4) * 0.06;
  vec3 sun = mix(vec3(1.0, 0.77, 0.46), vec3(1.0, 0.94, 0.80), 0.62 + projected.y * 0.08);
  return sun * shape * opening * glass;
}

vec3 lightScene(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  float plaster = fbm(uv * vec2(3.2 * aspect, 3.2) + 4.7);
  vec3 wall = mix(vec3(0.72, 0.69, 0.62), vec3(0.65, 0.67, 0.66), uv.y);
  wall *= 0.96 + plaster * 0.055;

  vec3 ambient = wall * mix(vec3(0.68, 0.70, 0.70), vec3(0.72, 0.72, 0.68), uv.y);
  vec2 projected = windowUv(uv, time);
  vec3 sunlight = windowLight(projected);
  vec3 color = ambient + sunlight * vec3(0.55, 0.49, 0.39);

  float haze = exp(-dot((uv - vec2(0.96, 0.94)) * vec2(aspect, 1.0), (uv - vec2(0.96, 0.94)) * vec2(aspect, 1.0)) * 1.8);
  color += vec3(1.0, 0.84, 0.56) * haze * 0.055;
  return color;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 pointer = u_pointer / u_resolution;
  vec2 delta = uv - pointer;
  vec2 roundDelta = vec2(delta.x * aspect, delta.y);
  float distanceToPointer = length(roundDelta);
  float reveal = smoothstep(0.28, 0.0, distanceToPointer) * u_drawing;

  if (u_sunlight > 0.5) {
    float hover = smoothstep(0.38, 0.015, distanceToPointer) * u_presence;
    vec2 displacement = delta * hover * 0.38;
    vec3 color = lightScene(uv + displacement, u_time);
    float vignette = smoothstep(1.28, 0.24, length(uv - 0.5));
    color *= mix(0.93, 1.0, vignette);
    color += (hash(frag + fract(u_time) * 93.0) - 0.5) * 0.012;
    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    return;
  }

  vec2 wetUv = (frag - u_resolution * 0.5) / u_resolution.y;
  float wet = beads(wetUv, u_time * 0.9);
  float stepSize = 0.0019;
  float wetX = beads(wetUv + vec2(stepSize, 0.0), u_time * 0.9);
  float wetY = beads(wetUv + vec2(0.0, stepSize), u_time * 0.9);
  vec2 wetNormal = vec2(wetX - wet, wetY - wet);
  float clear = smoothstep(0.05, 0.40, uv.x);
  wetNormal *= clear;

  float lens = smoothstep(0.30, 0.0, distanceToPointer) * u_presence * (1.0 - u_drawing);
  vec2 direction = length(delta) > 0.0001 ? normalize(delta) : vec2(0.0);
  vec2 tangent = vec2(-direction.y, direction.x);
  float twist = 0.026 + sin(u_time * 0.38) * 0.012;
  vec2 sampleUv = uv + tangent * lens * twist - wetNormal * 7.2;
  vec3 color = mistScene(sampleUv, pointer, u_time, u_presence);
  vec3 revealLight = mix(vec3(0.28, 0.24, 0.18), spectrum(pointer.x * 0.22 + u_time * 0.015) * 0.32, 0.42);
  color = 1.0 - (1.0 - color) * (1.0 - revealLight * reveal * 0.72);
  float value = luminance(color);
  vec3 glassNormal = normalize(vec3(wetNormal * 115.0, 1.0));
  float shine = pow(max(dot(glassNormal, normalize(vec3(-0.3, 0.6, 0.7))), 0.0), 26.0);
  vec3 fringe = mix(vec3(1.0), spectrum(atan(wetNormal.y, wetNormal.x) * 0.159 + uv.x * 0.33), 0.34);
  color += shine * wet * clear * (0.06 + smoothstep(0.84, 0.99, value) * 0.42) * fringe;
  color *= 1.0 + wet * smoothstep(0.84, 0.99, value) * 0.08;

  float vignette = smoothstep(1.28, 0.24, length(uv - 0.5));
  color *= mix(0.93, 1.0, vignette);
  color += (hash(frag + fract(u_time) * 93.0) - 0.5) * 0.035;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
