precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;
uniform float u_presence;
uniform float u_drawing;
uniform float u_sunlight;
uniform float u_night;
uniform float u_scene;
uniform float u_mono;
uniform float u_offset;
uniform sampler2D u_mask;

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
  rgb = rgb * rgb * (3.0 - 2.0 * rgb);
  return mix(rgb, vec3(dot(rgb, vec3(0.299, 0.587, 0.114))), u_mono);
}

float sceneIs(float n) {
  return step(n - 0.5, u_scene) * (1.0 - step(n + 0.5, u_scene));
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
  // Daylight stays close to neutral glass; night can carry more color.
  vec3 color = mix(
    mix(vec3(0.86, 0.85, 0.84), vec3(0.42, 0.44, 0.5), step(0.5, u_night)),
    spectrum(hue - across / width * split),
    mix(0.45, 0.72, step(0.5, u_night))
  );
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
  float age = fract(time * 0.035 + hash(id + 11.7));
  float fade = smoothstep(0.0, 0.06, age) * (1.0 - smoothstep(0.88, 1.0, age));
  float visibility = mix(mix(0.24, 1.0, hash(id + 27.2)) * fade, 1.0, step(0.5, u_night));
  still *= visibility;

  vec2 grid = uv * vec2(12.0, 2.0);
  vec2 lane = floor(grid);
  vec2 pos = fract(grid) - vec2(0.5, 0.0);
  float seed = hash(lane + 31.4);
  float fall = 1.0 - fract(time * mix(0.035, 0.075, seed) + hash(vec2(lane.x, 4.2)));
  float wave = sin((uv.y + time * 0.025) * 18.0 + seed * 6.0) * 0.08;
  vec2 drop = vec2((seed - 0.5) * 0.52 + wave, fall);
  float body = smoothstep(mix(0.10, 0.25, seed), 0.0, length((pos - drop) * vec2(1.0, 6.0)));
  float trail = smoothstep(0.055, 0.0, abs(pos.x - drop.x));
  trail *= smoothstep(drop.y + 0.03, drop.y + 0.35, pos.y) * smoothstep(1.0, 0.62, pos.y);
  float field = still * 1.6 + body * 0.45 + trail * 0.08;
  return smoothstep(0.30, 1.0, field);
}

float dots(vec2 uv, float aspect) {
  vec2 a = vec2(uv.x * aspect, uv.y) * 42.0;
  vec2 b = a + vec2(0.5);
  float primary = smoothstep(0.18, 0.0, length(fract(a) - 0.5));
  float secondary = smoothstep(0.16, 0.0, length(fract(b) - 0.5));
  return max(primary, secondary * 0.85);
}

vec3 mistBase(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  float night = step(0.5, u_night);
  vec3 warm = mix(vec3(0.894, 0.886, 0.871), vec3(0.145, 0.148, 0.155), night);
  vec3 shade = mix(vec3(0.69, 0.682, 0.667), vec3(0.08, 0.082, 0.09), night);
  float slope = smoothstep(mix(-0.2, -0.15, night), 1.25, uv.x + uv.y * mix(0.25, 0.26, night));
  vec3 base = mix(warm, shade, slope * mix(0.55, 0.52, night));
  float cloudScale = mix(2.2, 2.25, night);
  vec2 cloudDrift = mix(vec2(time * 0.02, -time * 0.015), vec2(time * 0.012, -time * 0.009), night);
  float cloud = fbm(uv * vec2(cloudScale * aspect, cloudScale) + cloudDrift);
  vec3 fog = mix(shade, vec3(0.22, 0.235, 0.26), night);
  float cloudMask = smoothstep(mix(0.4, 0.42, night), mix(0.95, 0.96, night), cloud);
  base = mix(base, fog, cloudMask * mix(0.30, 0.42, night));
  float field = dots(uv, aspect);
  base = mix(base, mix(base + 0.04, vec3(0.22, 0.225, 0.235), night), field * mix(0.0, 0.55, night));
  return base;
}

vec3 prismLight(vec2 uv, vec2 pointer, float time, float presence) {
  float aspect = u_resolution.x / u_resolution.y;
  float night = step(0.5, u_night);
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

  // The lower rainbow catches the glass near its edge, then leaves a broader,
  // softer reflection as surface roughness scatters the mirror direction.
  vec2 normal = normalize(vec2(0.08, 1.0));
  float travel = (0.08 - apex.y) / lower.y;
  vec2 hit = apex + lower * travel;
  vec2 bounce = reflect(lower, normal);
  vec2 delta = p - hit;
  vec2 field = vec2(delta.x / aspect, delta.y);
  vec2 axis = normalize(vec2(bounce.x / aspect, bounce.y));
  float along = dot(field, axis);
  float across = axis.x * field.y - axis.y * field.x;
  float width = 0.045 + max(along, 0.0) * 0.26;
  float rough = fbm(p * vec2(1.35, 7.5) + vec2(time * 0.012, -time * 0.009));
  float ripple = (rough - 0.5) * width * 0.16;
  float lobe = exp(-pow((across + ripple) / width, 2.0));
  float core = exp(-pow((across + ripple * 0.3) / (width * 0.2), 2.0));
  float forward = smoothstep(-0.015, 0.06, along);
  float span = 0.22 + bloom * 1.08;
  float end = 1.0 - smoothstep(span * 0.78, span, along);
  float falloff = 1.0 / (1.0 + max(along, 0.0) * 0.72);
  float incidence = clamp(dot(-lower, normal), 0.0, 1.0);
  float fresnel = 0.04 + 0.96 * pow(1.0 - incidence, 5.0);
  vec3 white = mix(vec3(0.94, 0.91, 0.86), vec3(0.46, 0.48, 0.56), night);
  vec3 tint = mix(
    white,
    spectrum(0.04 + (across + ripple) / width * 0.32),
    mix(0.8, 0.88, night)
  );
  float energy = mix(0.42, 0.3, night) * (0.72 + fresnel * 2.8);
  vec3 reflection = tint * lobe * 0.86 + white * core * 0.22;
  light += reflection * forward * end * falloff * energy * mix(0.84, 1.14, rough) * bloom;

  float shimmer = caustic(p * 1.8, time);
  light *= mix(0.3 + bloom * 0.7, 1.0, night);
  light *= mix(0.82 + shimmer * 0.42, 0.69 + shimmer * 0.31, night);
  float focus = exp(-dot(p - apex, p - apex) * 18.0);
  float glow = mix(0.30 + shimmer * 0.20, 0.38, night);
  light += mix(vec3(0.98, 0.93, 0.84), vec3(0.72, 0.78, 1.0), night) * focus * glow * bloom;
  light *= mix(1.0, 1.18, night);
  light = mix(light, vec3(dot(light, vec3(0.299, 0.587, 0.114))), u_mono);
  return clamp(light, 0.0, 1.0);
}

vec3 cityLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 grid = p * vec2(7.0, 5.0);
  vec2 id = floor(grid);
  vec2 local = fract(grid) - 0.5;
  float seed = hash(id + 12.7);
  vec2 center = vec2(hash(id + 3.8), hash(id + 9.1)) - 0.5;
  float radius = mix(0.055, 0.18, hash(id + 21.4));
  float distanceToLight = length(local - center);
  float orb = exp(-pow(distanceToLight / radius, 2.0)) * step(0.48, seed);
  float kind = hash(id + 34.6);
  vec3 tint = mix(vec3(1.0, 0.44, 0.12), vec3(1.0, 0.08, 0.04), step(0.58, kind));
  tint = mix(tint, vec3(0.18, 0.58, 1.0), step(0.84, kind));
  float flicker = 0.88 + sin(time * mix(0.2, 0.7, seed) + seed * 31.0) * 0.12;
  float below = 1.0 - smoothstep(center.y - 0.02, center.y + 0.02, local.y);
  float fade = smoothstep(-0.5, center.y, local.y);
  float streak = exp(-pow((local.x - center.x) / (radius * 0.18 + 0.012), 2.0));
  streak *= below * fade * step(0.62, seed);
  float horizon = exp(-pow((uv.y - 0.34) * 3.2, 2.0));
  vec3 haze = mix(vec3(0.04, 0.07, 0.12), vec3(0.16, 0.08, 0.05), uv.x);
  return haze * horizon * 0.22 + tint * (orb * 1.35 + streak * 0.24) * flicker;
}

vec3 moonLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 moon = vec2(0.78 * aspect, 0.77);
  vec2 delta = p - moon;
  float distanceToMoon = length(delta);
  float disc = smoothstep(0.06, 0.038, distanceToMoon);
  float halo = exp(-distanceToMoon * distanceToMoon * 4.2);
  vec2 direction = normalize(vec2(-0.72 * aspect, -0.6));
  float along = dot(delta, direction);
  float across = direction.x * delta.y - direction.y * delta.x;
  float shaft = exp(-pow(across / (0.09 + max(along, 0.0) * 0.18), 2.0));
  shaft *= smoothstep(-0.04, 0.12, along) * exp(-max(along, 0.0) * 0.7);
  float cloud = fbm(p * 2.1 + vec2(time * 0.008, -time * 0.004));
  shaft *= mix(0.35, 1.0, smoothstep(0.34, 0.72, cloud));
  float reflection = exp(-dot(p - vec2(0.38 * aspect, 0.2), p - vec2(0.38 * aspect, 0.2)) * 3.8);
  vec3 silver = vec3(0.44, 0.58, 0.92);
  return silver * (disc * 0.95 + halo * 0.3 + shaft * 0.48 + reflection * 0.055);
}

vec3 duskLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 sun = vec2(0.72 * aspect, 0.34);
  vec2 delta = p - sun;
  float glow = exp(-dot(delta, delta) * 7.5);
  float core = exp(-dot(delta, delta) * 95.0);
  float horizon = exp(-pow((uv.y - 0.32) * 4.5, 2.0));
  float upper = smoothstep(0.2, 0.92, uv.y);
  float ripple = 0.84 + fbm(p * vec2(1.3, 3.4) + vec2(time * 0.005, 2.7)) * 0.16;
  float reflection = exp(-pow((p.x - sun.x) / 0.075, 2.0));
  reflection *= (1.0 - smoothstep(0.12, 0.34, uv.y)) * ripple;
  vec3 amber = vec3(1.0, 0.28, 0.06);
  vec3 violet = vec3(0.24, 0.12, 0.48);
  vec3 sky = mix(amber * 0.2, violet * 0.18, upper);
  return sky + amber * (horizon * 0.34 + glow * 0.5 + core * 0.72 + reflection * 0.3);
}

vec3 lamp(vec2 p, vec2 source, float size, float strength, float phase, float time) {
  vec2 delta = p - source;
  float span = length(delta);
  float core = exp(-pow(span / size, 2.0));
  float halo = exp(-span * span / (size * size * 18.0));
  float down = mix(0.28, 1.0, 1.0 - smoothstep(-0.01, 0.025, delta.y));
  float smear = exp(-pow(delta.x / (size * 0.16 + 0.0025), 2.0));
  smear *= exp(-abs(delta.y) / (size * 5.8)) * down;
  float wave = sin(delta.y * 82.0 + phase) * size * 0.11;
  float fold = exp(-pow((abs(delta.x + wave) - size * 0.52) / (size * 0.13), 2.0));
  fold *= exp(-abs(delta.y) / (size * 3.8));
  float rings = exp(-pow((span - size * 1.38) / (size * 0.15), 2.0));
  rings += exp(-pow((span - size * 2.12) / (size * 0.22), 2.0)) * 0.42;
  float pulse = 0.97 + sin(time * 0.18 + phase) * 0.03;
  vec3 sodium = vec3(1.0, 0.42, 0.075);
  vec3 amber = vec3(1.0, 0.23, 0.018);
  return (sodium * (core * 1.32 + rings * 0.16) + amber * (halo * 0.34 + smear * 0.32 + fold * 0.12)) * strength * pulse;
}

vec3 sodiumLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec3 light = lamp(p, vec2(0.18 * aspect, 0.31), 0.026, 0.72, 1.4, time);
  light += lamp(p, vec2(0.49 * aspect, 0.48), 0.042, 1.0, 3.7, time);
  light += lamp(p, vec2(0.78 * aspect, 0.37), 0.032, 0.82, 5.1, time);
  light += lamp(p, vec2(0.94 * aspect, 0.63), 0.021, 0.54, 0.3, time);
  float fog = fbm(p * vec2(1.25, 2.1) + vec2(time * 0.006, -time * 0.004));
  float haze = exp(-pow((uv.y - 0.40) * 2.45, 2.0));
  light += vec3(0.19, 0.045, 0.004) * haze * mix(0.14, 0.3, fog);
  return light;
}

vec3 neonLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 grid = vec2(uv.x * 16.0, uv.y * 3.4);
  vec2 id = floor(grid);
  vec2 local = fract(grid);
  float seed = hash(id + 51.7);
  float center = mix(0.16, 0.84, hash(id + 8.9));
  float width = mix(0.018, 0.065, hash(id + 23.4));
  float offset = abs(local.x - center);
  float span = smoothstep(0.05, 0.16, local.y) * (1.0 - smoothstep(0.82, 0.96, local.y));
  float sides = smoothstep(0.04, 0.38, abs(uv.x - 0.5));
  float gate = step(0.24, seed) * mix(0.42, 1.0, sides);
  float core = exp(-pow(offset / width, 2.0)) * span;
  float bloom = exp(-offset * mix(8.0, 15.0, seed)) * span;
  float marks = 0.68 + smoothstep(-0.12, 0.32, sin((local.y + seed) * 78.0)) * 0.32;
  float kind = hash(id + 37.2);
  vec3 tint = mix(vec3(0.02, 0.88, 1.0), vec3(1.0, 0.03, 0.54), step(0.36, kind));
  tint = mix(tint, vec3(0.94, 0.08, 1.0), step(0.76, kind));
  float flicker = 0.9 + sin(time * mix(0.7, 2.1, seed) + seed * 43.0) * 0.1;

  float lane = exp(-pow((p.x - aspect * 0.51) / (0.12 + uv.y * 0.26), 2.0));
  float depth = exp(-pow((uv.y - 0.48) * 3.4, 2.0));
  vec3 haze = mix(vec3(0.06, 0.18, 0.24), vec3(0.28, 0.02, 0.18), uv.x);

  vec2 road = vec2(uv.x * 18.0, uv.y);
  float rseed = hash(vec2(floor(road.x), 72.6));
  float rcenter = mix(0.2, 0.8, hash(vec2(floor(road.x), 18.3)));
  float streak = exp(-pow((fract(road.x) - rcenter) / mix(0.025, 0.09, rseed), 2.0));
  streak *= (1.0 - smoothstep(0.02, 0.42, uv.y)) * (0.72 + noise(vec2(uv.y * 42.0, rseed)) * 0.28);
  vec3 rcolor = mix(vec3(0.0, 0.62, 0.82), vec3(0.84, 0.01, 0.42), step(0.48, rseed));

  vec3 signs = tint * gate * flicker * (core * marks * 1.45 + bloom * 0.22);
  return signs + haze * depth * (0.08 + lane * 0.2) + rcolor * streak * 0.24;
}

const float stormSpan = 6.8;

float stormPulse(float time, float decay) {
  float span = stormSpan;
  float cycle = floor(time / span);
  float phase = mod(time, span);
  float start = 0.8 + hash(vec2(cycle, 4.7)) * 1.6;
  float delay = 0.12 + hash(vec2(cycle, 8.9)) * 0.16;
  float first = step(start, phase) * exp(-max(phase - start, 0.0) * decay);
  float second = step(start + delay, phase) * exp(-max(phase - start - delay, 0.0) * decay);
  second *= mix(0.48, 0.78, hash(vec2(cycle, 12.1)));
  return clamp(first + second, 0.0, 1.0);
}

float boltNoise(float progress, float cycle, float seed) {
  float cells = 9.0;
  float segment = floor(progress * cells);
  float local = fract(progress * cells);
  float current = hash(vec2(segment + seed, cycle * 1.37 + seed)) - 0.5;
  float next = hash(vec2(segment + 1.0 + seed, cycle * 1.37 + seed)) - 0.5;
  return mix(current, next, local);
}

float boltX(float progress, float cycle, float aspect) {
  float root = mix(0.18, 0.82, hash(vec2(cycle, 17.3)));
  float lean = (hash(vec2(cycle, 29.1)) - 0.5) * progress * 0.12;
  float jag = boltNoise(progress, cycle, 0.0) * mix(0.018, 0.065, progress);
  return (root + lean + jag) * aspect;
}

float boltLine(float distance, float span) {
  float core = exp(-pow(distance / 0.0022, 2.0));
  float glow = exp(-pow(distance / 0.018, 2.0)) * 0.28;
  return (core + glow) * span;
}

float boltBranch(vec2 p, float progress, float cycle, float aspect, float seed) {
  float start = 0.32 + hash(vec2(cycle, seed)) * 0.2;
  float length = 0.28 + hash(vec2(cycle + seed, 31.7)) * 0.2;
  float local = clamp((progress - start) / length, 0.0, 1.0);
  float direction = mix(-1.0, 1.0, step(0.5, hash(vec2(cycle, seed + 8.2))));
  float root = boltX(start, cycle, aspect);
  float drift = direction * local * mix(0.12, 0.22, hash(vec2(seed, cycle + 4.1))) * aspect;
  float jag = boltNoise(local, cycle, seed) * local * 0.035 * aspect;
  float distance = abs(p.x - root - drift - jag) / aspect;
  float span = step(start, progress) * step(progress, start + length);
  span *= smoothstep(0.0, 0.06, local) * (1.0 - smoothstep(0.82, 1.0, local));
  return boltLine(distance, span);
}

float stormBolt(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float cycle = floor(time / stormSpan);
  float ground = mix(0.13, 0.34, hash(vec2(cycle, 42.6)));
  float progress = (1.04 - p.y) / (1.04 - ground);
  float distance = abs(p.x - boltX(progress, cycle, aspect)) / aspect;
  float span = step(0.0, progress) * step(progress, 1.0);
  float trunk = boltLine(distance, span);
  float branches = boltBranch(p, progress, cycle, aspect, 4.2);
  branches += boltBranch(p, progress, cycle, aspect, 9.7) * 0.72;
  return clamp(trunk + branches, 0.0, 1.4);
}

vec3 stormStrike(vec2 uv, float time) {
  float pulse = stormPulse(time, 10.0);
  float bolt = stormBolt(uv, time);
  vec3 color = mix(vec3(0.48, 0.66, 1.0), vec3(0.98, 0.99, 1.0), pulse);
  color *= bolt * pulse * 1.8;
  return mix(color, vec3(dot(color, vec3(0.299, 0.587, 0.114))), u_mono);
}

vec3 stormLight(vec2 uv, vec2 pointer, float time, float presence) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float cycle = floor(time / stormSpan);
  vec2 source = vec2(mix(0.18, 0.82, hash(vec2(cycle, 17.3))) * aspect, 0.76);
  vec2 delta = p - source;
  vec2 drift = vec2(time * 0.008, -time * 0.005);
  float cloud = fbm(p * vec2(1.35, 2.35) + drift);
  float detail = fbm(p * vec2(2.8, 4.2) - drift * 1.7 + 6.3);
  float ridge = smoothstep(0.36, 0.78, cloud * 0.7 + detail * 0.3);
  float halo = exp(-dot(delta * vec2(0.65, 1.0), delta * vec2(0.65, 1.0)) * 1.35);
  float sky = smoothstep(-0.1, 1.0, uv.y);
  float sheet = mix(0.28, 1.0, ridge) * mix(0.52, 1.0, halo);
  float flash = stormPulse(time, 18.0);
  float afterglow = stormPulse(time, 2.6);
  vec3 faint = vec3(0.012, 0.022, 0.045) * mix(0.35, 1.0, ridge) * mix(0.55, 1.0, sky);
  vec3 cold = vec3(0.36, 0.56, 0.92) * afterglow * sheet * 0.32;
  vec3 white = vec3(0.86, 0.94, 1.0) * flash * mix(0.38, 1.0, halo) * mix(0.45, 1.0, ridge) * 0.92;
  vec3 rain = prismLight(uv, pointer, time, presence) * mix(0.78, 0.62, step(0.5, u_night));
  vec3 weather = faint + cold + white + stormStrike(uv, time);
  return 1.0 - (1.0 - rain) * (1.0 - clamp(weather, 0.0, 1.0));
}

// ---- scene 7: aurora ----
// --- aurora private helpers ---
vec3 aurora_curtain(vec2 p, float y, float time, float baseX, float seed) {
  // horizontal waver: two swaying sines plus low-freq fbm turbulence so it breathes
  float sway = sin(y * 3.5 + time * 0.5 + seed) * 0.05
             + sin(y * 7.0 - time * 0.35 + seed * 1.7) * 0.025;
  float turb = (fbm(vec2(y * 2.2 + seed * 4.0, time * 0.12 + seed)) - 0.5) * 0.22;
  float cx = baseX + sway + turb;

  float d = abs(p.x - cx);
  float width = mix(0.018, 0.07, fbm(vec2(y * 3.0 + seed * 9.0, time * 0.08)));
  float core = exp(-pow(d / width, 2.0));
  float halo = exp(-(d * d) / (width * width * 9.0)) * 0.4;
  float glow = core + halo;

  // vertical extent confined to upper ~60% of sky, feathered top and bottom
  float vFade = smoothstep(0.36, 0.5, y) * (1.0 - smoothstep(0.82, 1.02, y));
  // brighter near the base of the curtain, fading toward the top
  float vGrad = mix(1.0, 0.35, smoothstep(0.4, 1.0, y));

  // vertical ray striations riding along the curtain
  float rays = 0.55 + 0.45 * fbm(vec2((p.x - cx) * 18.0 + seed * 7.0, y * 4.0 - time * 0.25));
  float flick = 0.85 + 0.15 * sin(time * 1.3 + seed * 5.0 + y * 2.0);

  float intensity = glow * vFade * vGrad * rays * flick;

  // color shift along length: emerald -> teal -> violet
  vec3 emerald = vec3(0.184, 0.933, 0.604);
  vec3 teal    = vec3(0.137, 0.788, 0.839);
  vec3 violet  = vec3(0.478, 0.294, 1.0);
  float t = smoothstep(0.38, 1.0, y);
  vec3 c = mix(emerald, teal, smoothstep(0.0, 0.55, t));
  c = mix(c, violet, smoothstep(0.5, 1.0, t));

  return c * intensity * 1.5;
}

vec3 aurora_stars(vec2 uv, float time) {
  vec2 scale = vec2(90.0, 60.0);
  vec2 g = uv * scale;
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  float h = hash(id + 3.3);
  float present = step(0.9, h);
  float d = length(f);
  float star = smoothstep(0.18, 0.0, d) * present;
  float tw = 0.5 + 0.5 * sin(time * 2.0 + h * 30.0);
  float skyMask = smoothstep(0.2, 0.6, uv.y);
  vec3 starCol = mix(vec3(0.7, 0.8, 1.0), vec3(1.0, 0.9, 0.8), hash(id + 7.7));
  return starCol * star * (0.4 + 0.6 * tw) * skyMask * 0.9;
}

vec3 auroraLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  vec3 col = vec3(0.0);

  // three drifting curtains at different horizontal anchors and phases
  col += aurora_curtain(p, uv.y, time, 0.30 * aspect, 0.0);
  col += aurora_curtain(p, uv.y, time, 0.55 * aspect, 3.7);
  col += aurora_curtain(p, uv.y, time, 0.74 * aspect, 8.1);

  // twinkling stars in the black above
  col += aurora_stars(uv, time);

  // low cold ground glow at the very bottom
  float g = exp(-uv.y * 16.0);
  col += vec3(0.04, 0.14, 0.20) * g * 0.8;

  return col;
}

// ---- scene 8: fireflies ----
// fireflies — a dark meadow of drifting, blinking bokeh orbs.
// Grid-cell placement (like neonLight): one firefly per cell, sampled over a
// 3x3 neighbourhood so each soft glow can spill across cell borders.

vec3 fireflies_orb(vec2 gid, vec2 gf, vec2 offs, float time) {
  vec2 cid = gid + offs;
  // per-cell randoms
  float r1 = hash(cid + 1.30);
  float r2 = hash(cid + 9.70);
  float r3 = hash(cid + 27.40);
  float r4 = hash(cid + 55.10);
  // thin out the field so only some cells hold a firefly
  float present = step(0.24, r4);
  // resting position inside the cell, plus a slow lissajous drift
  vec2 fpos = vec2(mix(0.2, 0.8, r1), mix(0.2, 0.8, r2));
  float dphase = r3 * 6.2831;
  fpos += 0.17 * vec2(
    sin(time * mix(0.22, 0.55, r1) + dphase),
    cos(time * mix(0.18, 0.48, r2) + dphase * 1.3)
  );
  vec2 diff = offs + fpos - gf;
  float d = length(diff);
  // soft bokeh core plus a wider gentle halo
  float size = mix(0.045, 0.10, r3);
  float core = exp(-(d * d) / (size * size));
  float halo = exp(-d / (size * 2.6)) * 0.32;
  // independent blink: off for a good part of its cycle
  float blink = sin(time * mix(0.5, 1.35, r2) + r3 * 6.2831);
  blink = smoothstep(0.02, 0.8, blink);
  // slight shimmer on top of the blink
  float shimmer = 0.85 + 0.15 * sin(time * mix(3.0, 6.0, r1) + r4 * 20.0);
  // chartreuse -> amber per firefly
  vec3 tint = mix(vec3(0.847, 0.941, 0.416), vec3(1.0, 0.812, 0.416), r1);
  return tint * (core + halo) * blink * shimmer * present;
}

vec3 firefliesLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // deep blue-green wash (#0a1410-ish), warmer/brighter toward the grass
  float grass = smoothstep(0.55, 0.0, uv.y);
  vec3 col = vec3(0.020, 0.045, 0.036);
  col += vec3(0.028, 0.052, 0.022) * grass;

  // drifting mist to give the meadow depth, concentrated low
  float mist = fbm(p * 3.2 + vec2(time * 0.03, time * 0.05));
  col += vec3(0.012, 0.028, 0.018) * mist * (0.35 + grass);
  // faint blades of light rising from the ground
  float blades = fbm(vec2(p.x * 12.0, uv.y * 2.0 - time * 0.04));
  col += vec3(0.010, 0.030, 0.014) * blades * grass * grass;

  // firefly field
  vec2 gp = vec2(uv.x * aspect, uv.y) * 5.5;
  vec2 gid = floor(gp);
  vec2 gf = fract(gp);
  vec3 glow = vec3(0.0);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      glow += fireflies_orb(gid, gf, vec2(float(i), float(j)), time);
    }
  }
  // fireflies favour the lower two-thirds of the meadow
  glow *= mix(0.55, 1.0, smoothstep(0.95, 0.15, uv.y));

  col += glow * 1.35;
  return col;
}

// ---- scene 9: lighthouse ----
float lighthouse_cone(vec2 delta, float sweep, float w) {
  float a = atan(delta.y, delta.x);
  float da = mod(a - sweep + 3.14159265, 6.2831853) - 3.14159265;
  return exp(-da * da / (w * w));
}

vec3 lighthouseLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  vec3 warm = vec3(1.0, 0.957, 0.847);
  vec3 cool = vec3(0.071, 0.196, 0.290);

  float horizon = 0.44;
  vec2 src = vec2(0.06 * aspect, 0.6);
  vec2 delta = p - src;
  float dist = length(delta);
  float a = atan(delta.y, delta.x);

  // continuous rotation; the pass toward the right/viewer is the bright one
  float sweep = time * 0.5;
  float facing = smoothstep(-0.15, 1.0, cos(sweep));

  // drifting sea fog
  float fog = fbm(p * 2.2 + vec2(-time * 0.02, time * 0.015));

  // twin cones: a tight core inside a broad soft flare
  float core = lighthouse_cone(delta, sweep, 0.11);
  float wide = lighthouse_cone(delta, sweep, 0.34) * 0.45;
  float beam = core + wide;

  // volumetric streaks running along the ray, so light looks like it cuts fog
  float streak = fbm(vec2(a * 7.0, dist * 4.5 - time * 0.3));
  beam *= mix(0.45, 1.25, streak);
  beam *= mix(0.6, 1.0, fog);
  beam *= exp(-dist * 1.05);
  beam *= 0.35 + facing * 1.15;
  // the beam lives in the sky, above the sea
  beam *= smoothstep(horizon - 0.04, horizon + 0.05, uv.y);

  // mirrored beam smeared and wavering on the water below the horizon
  vec2 pm = vec2(p.x, 2.0 * horizon - uv.y);
  vec2 dR = pm - src;
  float distR = length(dR);
  float reflBeam = lighthouse_cone(dR, sweep, 0.15);
  reflBeam *= exp(-distR * 1.4);
  reflBeam *= 0.3 + facing * 1.0;
  float waver = fbm(vec2(uv.x * 8.0 * aspect + time * 0.2, uv.y * 22.0 + time * 0.35));
  reflBeam *= mix(0.35, 1.1, waver);
  reflBeam *= smoothstep(horizon + 0.03, horizon - 0.02, uv.y);

  // the lamp itself: a tiny hot point brightening on each pass
  float lamp = exp(-dist * dist * 700.0);
  float lampGlow = exp(-dist * dist * 42.0) * 0.55;
  float lampBright = 0.9 + facing * 0.5;

  // faint cool haze lifting from the sea, and a thin horizon seam
  float ambient = fog * 0.11 * smoothstep(0.18, 0.85, uv.y);
  float hline = exp(-pow((uv.y - horizon) / 0.013, 2.0));

  vec3 col = vec3(0.0);
  col += warm * beam * 0.85;
  col += warm * reflBeam * 0.5;
  col += warm * (lamp * 1.4 + lampGlow) * lampBright;
  col += cool * ambient;
  col += mix(cool * 1.6, warm, facing * 0.45) * hline * 0.22;
  return col;
}

// ---- scene 10: embers ----
float embers_spark(vec2 p, vec2 pos, float size) {
  vec2 d = (p - pos) / size;
  return exp(-dot(d, d));
}

vec3 embersLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  vec3 red = vec3(1.0, 0.231, 0.071);    // #ff3b12
  vec3 orange = vec3(1.0, 0.541, 0.169); // #ff8a2b
  vec3 yellow = vec3(1.0, 0.843, 0.416); // #ffd76a

  vec3 col = vec3(0.0);

  // --- warm glow pooled along the bottom edge ---
  float pool = exp(-uv.y * 3.2);
  float shimmer = fbm(vec2(uv.x * 4.0 + time * 0.05, time * 0.25));
  pool *= 0.6 + 0.75 * shimmer;
  vec3 poolCol = mix(red, orange, clamp(pool, 0.0, 1.0));
  col += poolCol * pool * 0.85;

  // hot core hugging the very base, breathing slowly
  float core = exp(-uv.y * 7.5);
  float breathe = 0.7 + 0.3 * sin(time * 1.7 + uv.x * 7.0);
  col += yellow * core * 0.32 * breathe;

  // --- rising sparks: cheap grid of independent particles ---
  for (int i = 0; i < 12; i++) {
    float fi = float(i);
    float s1 = hash(vec2(fi, 1.3));
    float s2 = hash(vec2(fi, 7.9));

    float speed = mix(0.07, 0.17, s1);
    float t = time * speed + s2;
    float cycle = floor(t);        // each life-cycle re-seeds the spawn column
    float phase = fract(t);        // 0 at the fire, 1 at the top of its flight

    float xSeed = hash(vec2(fi * 1.7 + 2.0, cycle));
    float baseX = xSeed * aspect;

    // sideways drift widens and speeds up as the spark cools and rises
    float sway = sin(time * mix(0.8, 1.7, s2) + fi * 2.1 + phase * 5.5);
    sway *= 0.055 * phase;
    vec2 pos = vec2(baseX + sway, phase * 0.95 + 0.02);

    float size = mix(0.007, 0.015, s1) * (1.0 - 0.45 * phase);
    float spark = embers_spark(p, pos, size);

    // born at the fire, fades out before reaching the top
    float life = smoothstep(0.0, 0.07, phase) * (1.0 - smoothstep(0.55, 1.0, phase));

    // fast flicker, plus a fraction that flare brighter
    float fl = 0.55 + 0.45 * sin(time * mix(7.0, 13.0, s2) + fi * 5.3);
    float bright = 1.0 + step(0.8, s1) * 1.8;

    // cools from hot yellow near the base toward ember red up high
    vec3 sc = mix(yellow, red, phase);
    sc = mix(sc, orange, 0.35);

    col += sc * spark * life * fl * bright * 1.25;
  }

  return col;
}

// ---- scene 11: tide ----
// --- tide: bioluminescent surf --------------------------------------------
// Abyssal dark water, electric cyan plankton igniting along wave crests.

float tide_wave(vec2 p, float time, float seed) {
  // Meandering horizontal crest line built from layered sines + noise wander.
  float w = sin(p.x * 3.1 + time * 0.55 + seed * 6.28) * 0.5;
  w += sin(p.x * 6.7 - time * 0.31 + seed * 3.14) * 0.26;
  w += sin(p.x * 11.3 + time * 0.9 + seed * 1.7) * 0.12;
  w += (fbm(vec2(p.x * 2.2 + seed * 12.0, time * 0.18)) - 0.5) * 0.7;
  return w;
}

float tide_sparkle(vec2 p, float time) {
  // Fine bright grain riding on the crests.
  vec2 g = vec2(p.x * 120.0, p.y * 120.0);
  float n = hash(floor(g) + floor(vec2(time * 3.0, time * 1.3)));
  float tw = 0.5 + 0.5 * sin(time * 8.0 + n * 40.0);
  return pow(n, 6.0) * tw;
}

vec3 tideLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  vec3 abyss  = vec3(0.012, 0.078, 0.098);   // #03141a-ish
  vec3 teal   = vec3(0.070, 0.714, 0.788);   // #12b6c9
  vec3 cyan   = vec3(0.184, 1.000, 0.878);   // #2effe0

  vec3 col = vec3(0.0);

  // Waterline: everything below sits in the bottom ~58% of the frame.
  float waterTop = 0.58;
  float water = smoothstep(waterTop + 0.05, waterTop - 0.02, uv.y);

  // Faint horizon glow where sky meets sea.
  float hz = (uv.y - waterTop) / 0.05;
  float horizon = exp(-(hz * hz));
  col += teal * horizon * 0.09;

  // Deep water body: very dark teal, gently brightening toward the shore edge.
  float depth = smoothstep(waterTop, -0.15, uv.y);
  col += abyss * water * (0.35 + depth * 0.55);
  // Slow underlit caustic shimmer beneath the surface.
  float caust = fbm(vec2(p.x * 4.0, uv.y * 7.0 - time * 0.25));
  col += teal * water * depth * caust * 0.06;

  // Stacked scrolling wave bands, near (bottom) to far (near horizon).
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float seed = fi * 1.37 + 0.21;

    // Band base height marches up toward the horizon; nearer waves are lower.
    float base = mix(0.04, waterTop - 0.06, fi / 4.0);
    // Each band scrolls; nearer bands move faster (parallax toward viewer).
    float speed = mix(0.16, 0.05, fi / 4.0);
    float march = time * speed;
    float amp = mix(0.075, 0.03, fi / 4.0);

    float crest = base + tide_wave(vec2(p.x, 0.0), time + seed * 4.0, seed) * amp + march * 0.0;
    // gentle vertical drift so crests advance shoreward
    crest += sin(time * speed * 2.0 + seed) * 0.015;

    float d = uv.y - crest;

    // Leading edge glows bright; light trails downward into darkness (the wave face).
    float thickness = mix(0.010, 0.02, fi / 4.0);
    float ed = d / thickness;
    float edge = exp(-(ed * ed));                           // sharp bright crest line
    float trail = smoothstep(-0.11, 0.0, d) * smoothstep(thickness * 2.2, 0.0, d); // fall-off below

    // Foam turbulence breaking the crest into patches of glow.
    float turb = fbm(vec2(p.x * 9.0 + seed * 5.0 - march * 3.0, crest * 20.0 + time * 0.4));
    float glow = edge * (0.55 + turb * 0.9) + trail * 0.22 * (0.4 + turb * 0.7);

    // Nearer waves are brighter and more cyan; far ones dim and teal.
    float bright = mix(1.35, 0.5, fi / 4.0);
    vec3 tint = mix(teal, cyan, edge * (0.7 + turb * 0.3));

    col += tint * glow * bright;

    // Sparkle grain concentrated on the crest.
    float spk = tide_sparkle(p, time + seed) * edge;
    col += cyan * spk * 1.6 * bright;
  }

  // Pointer disturbance: stir extra plankton light where touched (water only).
  vec2 ptr = vec2(u_pointer.x * aspect, u_pointer.y);
  float pd = length(p - ptr);
  float stir = exp(-pd * 9.0) * water * u_presence;
  float ripple = 0.5 + 0.5 * sin(pd * 40.0 - time * 5.0);
  col += cyan * stir * ripple * 0.9;

  return col;
}

// ---- scene 12: lantern ----
// Sky-lantern festival — one lantern per grid cell, rising slowly with a gentle
// candle flicker and sway. Layered for depth (far = smaller, dimmer, slower).
// The 3x3 neighborhood sampling lets orbs glow across cell boundaries as they rise.
vec3 lantern_layer(vec2 p, float time, float cellSize, float rise, float radius, float bright, float seed, float stretch, float sway) {
  vec3 amber = vec3(1.0, 0.70, 0.30);   // #ffb24d paper body
  vec3 gold  = vec3(1.0, 0.85, 0.54);   // #ffd98a hot core
  vec2 g = p / cellSize;
  float gy = g.y + time * rise;         // scroll the field upward over time
  vec2 base = floor(vec2(g.x, gy));
  vec2 frag = vec2(g.x, gy);
  vec3 col = vec3(0.0);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 cell = base + vec2(float(i), float(j));
      float h1 = hash(cell + seed);
      float h2 = hash(cell + seed + 3.3);
      float h3 = hash(cell + seed + 7.7);
      float exists = step(0.56, h3);     // ~44% of cells carry a lantern
      float swx = sin(time * mix(0.25, 0.6, h2) + h1 * 6.2831) * sway;
      vec2 lc = cell + vec2(mix(0.22, 0.78, h1) + swx, mix(0.30, 0.70, h2));
      vec2 d = frag - lc;
      d.y /= stretch;                    // stretch>1 smears orbs into reflections
      float dist2 = dot(d, d);
      float r = radius * mix(0.82, 1.18, h1);
      float glow = exp(-dist2 / (r * r));
      float core = exp(-dist2 / (r * r * 0.16));
      float flick = 0.92 + sin(time * mix(1.4, 2.8, h1) + h2 * 21.0) * 0.06;
      float b = bright * mix(0.55, 1.0, h2) * exists * flick;
      col += amber * glow * b + gold * core * b * 0.65;
    }
  }
  return col;
}

vec3 lanternLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // deep indigo night sky (#0b1030), a touch brighter toward the top
  vec3 col = vec3(0.035, 0.05, 0.15) * (0.55 + uv.y * 0.6);

  // slow drifting warm haze catching the lantern light in the upper sky
  float haze = fbm(p * 1.6 + vec2(time * 0.012, -time * 0.02));
  col += vec3(0.9, 0.55, 0.25) * 0.05 * haze * smoothstep(0.05, 0.8, uv.y);

  // two depth layers: distant (small/dim/slow) then near (large/warm)
  col += lantern_layer(p, time, 0.155, 0.026, 0.26, 0.42, 13.4, 1.0, 0.05) * 0.9;
  col += lantern_layer(p, time, 0.310, 0.048, 0.28, 0.82, 0.0,  1.0, 0.09);

  // warm horizon glow lifting off the water line
  col += vec3(0.7, 0.38, 0.16) * smoothstep(0.42, 0.0, uv.y) * 0.22;

  // faint warm reflection smear on dark water along the bottom
  float horizon = 0.22;
  float below = smoothstep(horizon, 0.0, uv.y);
  float ripple = (fbm(vec2(uv.x * 7.0, uv.y * 10.0 - time * 0.25)) - 0.5);
  vec2 ruv = vec2(uv.x + ripple * 0.03 * below, horizon * 2.0 - uv.y);
  vec2 rp = vec2(ruv.x * aspect, ruv.y);
  vec3 refl = lantern_layer(rp, time, 0.310, 0.048, 0.28, 0.82, 0.0, 2.6, 0.09);
  col += refl * vec3(1.0, 0.6, 0.32) * below * 0.34;

  // subtle rippling sheen on the water surface
  col += vec3(0.06, 0.07, 0.16) * below * (0.4 + ripple * 0.5);

  return col;
}

// ---- scene 13: meteor ----
float meteor_star(vec2 p, float time, float scale, float thresh) {
  vec2 g = p * scale;
  vec2 id = floor(g);
  vec2 f = fract(g);
  float h = hash(id + 0.5);
  vec2 pos = vec2(hash(id + 1.3), hash(id + 7.1));
  float d = length(f - pos);
  float bright = smoothstep(thresh, 1.0, h);
  float rate = mix(0.7, 2.6, hash(id + 4.2));
  float tw = 0.55 + 0.45 * sin(time * rate + h * 31.0);
  float sharp = mix(360.0, 1300.0, hash(id + 9.9));
  return exp(-d * d * sharp) * bright * max(tw, 0.0);
}

vec3 meteor_streak(vec2 p, float aspect, float time, float seed) {
  float period = mix(2.3, 4.4, hash(vec2(seed, 1.7)));
  float toff = hash(vec2(seed, 9.3)) * period;
  float phase = (time + toff) / period;
  float cyc = floor(phase);
  float t = fract(phase);
  float ch = hash(vec2(cyc * 1.31 + seed, seed * 2.7 + 3.0));
  float ch2 = hash(vec2(cyc * 0.77 + seed * 3.1, cyc * 2.3 + 5.0));

  vec2 start = vec2(mix(0.12, 1.08, ch) * aspect, mix(0.72, 1.18, ch2));
  float ang = mix(-2.52, -2.18, hash(vec2(seed, 4.4)));
  vec2 dir = vec2(cos(ang), sin(ang));
  float travel = 1.05;
  vec2 head = start + dir * (t * travel);

  float alive = smoothstep(0.0, 0.04, t) * smoothstep(0.86, 0.52, t);
  float fire = step(0.82, hash(vec2(seed, 12.1)));

  vec2 rel = p - head;
  float along = dot(rel, -dir);
  float across = dir.x * rel.y - dir.y * rel.x;

  float tailLen = mix(0.16, 0.30, hash(vec2(seed, 6.6))) * (1.0 + fire * 0.6);
  float width = 0.006 * (1.0 + fire * 1.1);
  float taper = width + max(along, 0.0) * 0.014;
  float tail = exp(-max(along, 0.0) / tailLen)
             * exp(-pow(across / taper, 2.0))
             * smoothstep(-0.02, 0.0, along);
  float headGlow = exp(-dot(rel, rel) / (0.0005 * (1.0 + fire * 3.2)));

  float glow = (tail * 1.35 + headGlow * 2.4) * alive;

  vec3 white = vec3(0.91, 0.94, 1.0);
  vec3 blue = vec3(0.44, 0.63, 1.0);
  vec3 col = mix(white, blue, smoothstep(0.0, tailLen, along));
  col = mix(col, vec3(1.0, 0.83, 0.62), fire * 0.45 * smoothstep(0.02, 0.0, length(rel)));
  return col * glow;
}

vec3 meteorLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec3 col = vec3(0.0);

  float neb = fbm(p * 1.6 + vec2(time * 0.01, time * 0.006));
  float neb2 = fbm(p * 3.1 - vec2(time * 0.004, time * 0.008));
  col += vec3(0.02, 0.032, 0.07) * neb * 1.05;
  col += vec3(0.04, 0.06, 0.12) * smoothstep(0.58, 0.9, neb2) * 0.7;

  float s1 = meteor_star(p, time, 22.0, 0.52);
  float s2 = meteor_star(p, time, 36.0, 0.64);
  col += vec3(0.80, 0.86, 1.0) * (s1 * 1.6 + s2 * 1.05);

  for (int i = 0; i < 9; i++) {
    float seed = float(i) * 13.37 + 2.0;
    col += meteor_streak(p, aspect, time, seed);
  }

  return col;
}

// ---- scene 14: cathedral ----
vec3 cathedral_jewel(float h) {
  vec3 ruby     = vec3(0.878, 0.149, 0.290);
  vec3 cobalt   = vec3(0.165, 0.361, 1.000);
  vec3 gold     = vec3(1.000, 0.761, 0.239);
  vec3 emerald  = vec3(0.137, 0.773, 0.416);
  vec3 amethyst = vec3(0.608, 0.294, 1.000);
  float s = h * 5.0;
  vec3 c = ruby;
  c = mix(c, cobalt,   step(1.0, s));
  c = mix(c, gold,     step(2.0, s));
  c = mix(c, emerald,  step(3.0, s));
  c = mix(c, amethyst, step(4.0, s));
  return c;
}

vec3 cathedralLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 center = vec2(0.5 * aspect, 0.6);
  vec2 delta = p - center;
  float r = length(delta);
  float a = atan(delta.y, delta.x);

  float R = 0.33;

  // soft interior mask of the window
  float inside = smoothstep(R, R - 0.015, r);

  // flickering candlelight behind the glass, warmest at the hub
  float flick = 0.82 + 0.12 * sin(time * 1.9 + 0.5) + 0.08 * sin(time * 3.7);
  float glowField = fbm(delta * 4.0 + vec2(time * 0.03, -time * 0.06));
  float backlight = exp(-r * r * 5.0) * (0.6 + 0.5 * glowField) * flick;

  // concentric ring subdivision
  float rings = 4.0;
  float rn = r / R * rings;
  float ringId = floor(rn);
  float ringLocal = fract(rn);

  // petal wedges multiply outward for a rose-window fan
  float petals = 6.0 + ringId * 6.0;
  float an = (a / 6.2831853 + 0.5) * petals;
  float wedgeId = floor(an);
  float wedgeLocal = fract(an);

  // dark leading (came) between panes
  float leadR = smoothstep(0.0, 0.10, ringLocal) * smoothstep(1.0, 0.90, ringLocal);
  float leadA = smoothstep(0.0, 0.07, wedgeLocal) * smoothstep(1.0, 0.93, wedgeLocal);
  float pane = leadR * leadA;

  // jewel tone per pane
  vec2 cellKey = vec2(ringId, wedgeId);
  float cellSeed = hash(cellKey + 3.1);
  vec3 jewel = cathedral_jewel(cellSeed);

  // per-pane shimmer, as if the candle behind wavers
  float phase = hash(cellKey + 12.4) * 30.0;
  float shimmer = 0.7 + 0.3 * sin(time * mix(0.6, 1.8, hash(cellKey + 5.0)) + phase);

  float paneGlow = pane * (0.55 + 0.45 * glowField);
  vec3 glassLight = jewel * paneGlow * shimmer * (0.8 + backlight);

  // gold central medallion (boss) with an inner ring
  vec3 gold = vec3(1.0, 0.761, 0.239);
  float hub = smoothstep(0.055, 0.02, r);
  float hubRing = smoothstep(0.02, 0.004, abs(r - 0.06));
  vec3 medallion = gold * (hub * 1.15 + hubRing * 0.5) * flick;

  // stone rim catching a little light
  float rim = smoothstep(0.02, 0.0, abs(r - R)) * 0.4;
  vec3 rimLight = vec3(0.32, 0.28, 0.40) * rim;

  vec3 col = (glassLight + medallion) * inside + rimLight;

  // faint outer halo bleeding through the mist
  float halo = exp(-r * r * 3.2) * 0.16;
  col += gold * halo * flick;

  return col;
}

// ---- scene 15: fireworks ----
vec3 fireworks_palette(float h) {
  vec3 gold    = vec3(1.0, 0.72, 0.30);
  vec3 magenta = vec3(1.0, 0.24, 0.62);
  vec3 mint    = vec3(0.30, 1.0, 0.66);
  vec3 ice     = vec3(0.52, 0.76, 1.0);
  float s = h * 4.0;
  vec3 c = gold;
  c = mix(c, magenta, step(1.0, s));
  c = mix(c, mint,    step(2.0, s));
  c = mix(c, ice,     step(3.0, s));
  return c;
}

vec3 fireworks_burst(vec2 p, float aspect, float time, float seed) {
  float period = mix(4.6, 7.2, hash(vec2(seed, 2.3)));
  float phase = (time + hash(vec2(seed, 8.8)) * period) / period;
  float cycle = floor(phase);
  float t = fract(phase);
  float h1 = hash(vec2(cycle + seed * 7.0, seed + 1.7));
  float h2 = hash(vec2(cycle * 3.1, seed + 9.2));
  vec2 center = vec2(mix(0.18, 0.82, h1) * aspect, mix(0.58, 0.84, h2));
  vec3 tint = fireworks_palette(hash(vec2(cycle, seed * 4.4)));
  vec3 col = vec3(0.0);

  // the shell climbs first: a hot point trailing a thin ember line
  float riseEnd = 0.24;
  float rising = step(t, riseEnd);
  float rt = clamp(t / riseEnd, 0.0, 1.0);
  vec2 shell = vec2(center.x + sin(rt * 9.0 + seed) * 0.008, mix(0.02, center.y, 1.0 - pow(1.0 - rt, 2.0)));
  float shellGlow = exp(-dot(p - shell, p - shell) * 2600.0);
  float shellTail = exp(-abs(p.x - shell.x) * 130.0)
    * smoothstep(shell.y, shell.y - 0.09, p.y)
    * smoothstep(shell.y - 0.20, shell.y - 0.02, p.y);
  col += vec3(1.0, 0.85, 0.60) * (shellGlow * 1.5 + shellTail * 0.22) * rising;

  // detonation: spokes of sparks expanding, then drooping under gravity
  float bt = clamp((t - riseEnd) / (1.0 - riseEnd), 0.0, 1.0);
  float grow = 1.0 - pow(1.0 - bt, 2.6);
  float radius = mix(0.15, 0.23, h2);
  vec2 q = p - center;
  q.y += bt * bt * 0.15 * (length(q) / radius);
  float r = length(q);
  float a = atan(q.y, q.x);
  float sa = (a / 6.2831853 + 0.5) * 26.0;
  float sid = floor(sa);
  float sf = abs(fract(sa) - 0.5);
  float sh = hash(vec2(sid, cycle + seed * 13.0));
  float len = radius * max(grow, 0.04) * mix(0.7, 1.05, sh);
  float head = exp(-pow((r - len) / 0.008, 2.0));
  float trail = smoothstep(len, len * 0.30, r) * smoothstep(len * 0.08, len * 0.72, r);
  float ang = exp(-pow(sf / 0.16, 2.0));
  float glitter = 0.62 + 0.38 * sin(time * mix(9.0, 16.0, sh) + sid * 3.7);
  float burstFade = (1.0 - smoothstep(0.5, 1.0, bt)) * (1.0 - rising);
  col += tint * (head * 1.5 + trail * 0.26) * ang * glitter * burstFade;

  // white core flash at the instant it opens
  col += mix(tint, vec3(1.0), 0.6) * exp(-r * r * 55.0) * exp(-bt * 9.0) * (1.0 - rising) * 1.5;
  return col;
}

vec3 fireworksLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec3 col = vec3(0.012, 0.016, 0.035) * (0.4 + uv.y * 0.8);
  // drifting gunpowder smoke lit faintly from below
  float smoke = fbm(p * 2.4 + vec2(time * 0.016, time * 0.01));
  col += vec3(0.05, 0.045, 0.06) * smoke * smoothstep(0.3, 0.9, uv.y) * 0.5;
  for (int i = 0; i < 3; i++) {
    col += fireworks_burst(p, aspect, time, float(i) * 5.13 + 1.0);
  }
  // the crowd below: a soft warm rim along the bottom of the dark
  col += vec3(0.10, 0.06, 0.04) * exp(-uv.y * 9.0) * 0.5;
  return col;
}

// ---- scene 16: train ----
vec3 trainLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  vec3 warm = vec3(1.0, 0.78, 0.45);   // lit carriage windows
  vec3 cold = vec3(0.20, 0.30, 0.48);  // steel night air
  vec3 red  = vec3(1.0, 0.10, 0.08);   // crossing signal

  float trainY = 0.44;
  float period = 11.0;
  float cycle = floor(time / period);
  float tt = mod(time, period);
  float goingRight = step(0.5, hash(vec2(cycle, 3.7)));
  float dirSign = goingRight * 2.0 - 1.0;
  float trainLen = 1.35;
  float crossTime = 4.8;
  float span = aspect + trainLen * 2.0 + 0.2;
  float headX = mix(-trainLen - 0.1, -trainLen - 0.1 + span, clamp(tt / crossTime, 0.0, 1.0));
  headX = mix(aspect - headX, headX, goingRight);
  float s = (headX - p.x) * dirSign;

  // still night over the embankment, a low fog bank waiting for light
  vec3 col = cold * 0.05 * (0.4 + uv.y * 0.8);
  float fog = fbm(p * vec2(1.8, 3.2) + vec2(time * 0.02, 0.0));
  col += cold * fog * 0.045;

  float inTrain = step(0.0, s) * step(s, trainLen);
  float band = exp(-pow((uv.y - trainY) / 0.023, 2.0));
  // carriage windows sliding past, a dark coupling every few of them
  float wn = s * 30.0;
  float windows = smoothstep(0.22, 0.34, fract(wn)) * smoothstep(0.94, 0.82, fract(wn));
  float car = step(0.14, fract(wn / 7.0));
  float cabin = 0.8 + 0.2 * sin(floor(wn) * 13.7 + cycle * 31.0);
  col += warm * band * windows * car * cabin * inTrain * 1.15;
  // under-glow and the smeared echo on the wet platform below
  float under = exp(-pow((uv.y - trainY) / 0.06, 2.0));
  col += warm * under * inTrain * 0.08;
  float mirrorBand = exp(-pow((uv.y - (trainY - 0.16)) / 0.05, 2.0));
  float shimmer = 0.6 + 0.4 * fbm(vec2(p.x * 9.0, uv.y * 30.0 - time * 0.6));
  col += warm * mirrorBand * windows * car * inTrain * shimmer * 0.20;

  // the headlight punches a cone through the fog ahead of the first car
  vec2 rel = p - vec2(headX, trainY);
  float headGlow = exp(-dot(rel, rel) * 900.0);
  float along = rel.x * dirSign;
  float cone = exp(-pow(rel.y / (0.015 + max(along, 0.0) * 0.16), 2.0))
    * step(0.0, along) * exp(-along * 3.4);
  col += vec3(0.95, 0.98, 1.0) * (headGlow * 1.6 + cone * 0.5);

  // level crossing: paired red lamps trading their alternate blink
  float signalOn = smoothstep(0.0, 0.4, tt) * (1.0 - smoothstep(crossTime + 1.4, crossTime + 2.2, tt));
  float blink = step(0.0, sin(time * 7.2));
  vec2 dl = p - vec2(0.16 * aspect, 0.24);
  vec2 dr = dl - vec2(0.045, 0.0);
  float glowL = exp(-dot(dl, dl) * 2400.0) + exp(-dot(dl, dl) * 260.0) * 0.35;
  float glowR = exp(-dot(dr, dr) * 2400.0) + exp(-dot(dr, dr) * 260.0) * 0.35;
  col += red * (glowL * blink + glowR * (1.0 - blink)) * signalOn * 1.3;

  return col;
}

// ---- scene 17: wisps ----
vec3 wisps_flame(vec2 p, vec2 pos, float size, float time, float seed) {
  vec2 d = p - pos;
  // taper the flame: narrower above the core, rounder below
  float taper = 1.0 - smoothstep(0.0, size * 2.6, d.y) * 0.45;
  d.x /= max(taper, 0.4);
  d.y *= 0.72;
  float dist2 = dot(d, d);
  float body = exp(-dist2 / (size * size));
  float core = exp(-dist2 / (size * size * 0.22));
  float lick = 0.82 + 0.18 * sin(time * mix(5.0, 9.0, seed) + seed * 17.0);
  return (vec3(0.36, 0.95, 0.78) * body + vec3(0.82, 1.0, 0.92) * core * 0.7) * lick;
}

vec3 wispsLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float waterline = 0.30;
  // black bog: still water, breathless air, a hint of rot-green in the mist
  vec3 col = vec3(0.010, 0.022, 0.020) * (0.5 + uv.y * 0.5);
  float marsh = fbm(p * vec2(2.2, 4.5) + vec2(time * 0.014, -time * 0.006));
  col += vec3(0.014, 0.036, 0.030) * marsh * smoothstep(0.65, 0.1, uv.y);

  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float s1 = hash(vec2(fi, 21.7));
    float s2 = hash(vec2(fi, 47.3));
    vec2 base = vec2(mix(0.14, 0.86, s1) * aspect, mix(0.40, 0.60, s2));
    // deliberate wandering, like something leading you off the path
    vec2 wander = vec2(
      sin(time * mix(0.11, 0.19, s1) + s2 * 6.28) * 0.14 * aspect,
      cos(time * mix(0.08, 0.15, s2) + s1 * 6.28) * 0.06
    );
    wander += (vec2(noise(vec2(time * 0.07, fi * 3.1)), noise(vec2(fi * 5.7, time * 0.06))) - 0.5) * 0.09;
    vec2 pos = base + wander;
    float size = mix(0.030, 0.052, hash(vec2(fi, 9.1)));
    // each flame breathes, sometimes guttering to almost nothing
    float breathe = 0.45 + 0.55 * smoothstep(-0.6, 0.7, sin(time * mix(0.23, 0.4, s1) + fi * 2.4));
    col += wisps_flame(p, pos, size, time, s1) * breathe;
    // a drowned twin waving back from under the water
    vec2 mirrored = vec2(pos.x, 2.0 * waterline - pos.y);
    float rippleShift = (noise(vec2(p.x * 8.0, time * 0.5 + fi * 7.0)) - 0.5) * 0.05;
    vec3 refl = wisps_flame(vec2(p.x + rippleShift, p.y), mirrored, size * 1.2, time, s1);
    col += refl * breathe * 0.26 * smoothstep(waterline, waterline - 0.18, uv.y);
  }
  return col;
}

// ---- scene 18: glowworms ----
vec3 glowworms_strand(vec2 p, float aspect, float time, float cols, float seed, float bright, float size) {
  vec3 cyan = vec3(0.30, 0.85, 1.0);   // glowworm lure
  vec3 silk = vec3(0.12, 0.40, 0.80);  // dim snare thread
  vec3 col = vec3(0.0);
  float x = p.x / aspect * cols;
  float base = floor(x);
  for (int i = -1; i <= 1; i++) {
    float id = base + float(i);
    float h1 = hash(vec2(id, seed));
    float h2 = hash(vec2(id, seed + 4.4));
    float h3 = hash(vec2(id, seed + 8.9));
    float present = step(0.30, h3);
    float swayX = sin(time * mix(0.14, 0.3, h1) + h2 * 6.28) * 0.012;
    float cx = (id + mix(0.2, 0.8, h1)) / cols * aspect + swayX;
    float wy = 1.0 - mix(0.04, 0.40, h2);
    // the silk line above the lure, beaded with sticky droplets
    float thread = exp(-pow((p.x - cx) / 0.0018, 2.0));
    thread *= smoothstep(wy - 0.01, wy + 0.05, p.y);
    float droplets = smoothstep(0.34, 0.0, abs(fract((p.y - wy) * 26.0 + 0.5) - 0.5)) * thread;
    vec2 d = p - vec2(cx, wy);
    float dist2 = dot(d, d);
    float lure = exp(-dist2 / (size * size));
    float halo = exp(-dist2 / (size * size * 14.0)) * 0.22;
    float pulse = 0.9 + 0.1 * sin(time * mix(0.3, 0.7, h1) + h2 * 31.0);
    col += (silk * (thread * 0.05 + droplets * 0.07) + cyan * (lure + halo) * pulse) * present * bright;
  }
  return col;
}

vec3 glowwormsLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  // cave blackness; the ceiling rock barely returns any light
  vec3 col = vec3(0.006, 0.012, 0.022) * (0.3 + uv.y * 0.9);
  float rock = fbm(p * vec2(3.5, 2.0) + 11.3);
  col += vec3(0.010, 0.022, 0.038) * rock * smoothstep(0.55, 1.0, uv.y);

  // a far constellation of lures, then a nearer sparser rank
  col += glowworms_strand(p, aspect, time, 26.0, 3.1, 0.55, 0.0045);
  col += glowworms_strand(p, aspect, time, 11.0, 17.9, 1.0, 0.0085);

  // the lake: a black mirror doubling the ceiling
  float waterline = 0.42;
  float below = smoothstep(waterline, waterline - 0.02, uv.y);
  float rippleShift = (noise(vec2(p.x * 12.0, time * 0.35)) - 0.5) * 0.025;
  vec2 rp = vec2(p.x + rippleShift, 2.0 * waterline - uv.y);
  vec3 refl = glowworms_strand(rp, aspect, time, 11.0, 17.9, 1.0, 0.0085)
    + glowworms_strand(rp, aspect, time, 26.0, 3.1, 0.55, 0.0045) * 0.6;
  col += refl * below * 0.32;
  col += vec3(0.015, 0.035, 0.055) * below * 0.35;
  return col;
}

// ---- scene 19: harbor ----
vec3 harbor_lamp(vec2 p, vec2 pos, vec3 tint, float size, float on, float horizon) {
  vec2 d = p - pos;
  float dist2 = dot(d, d);
  float core = exp(-dist2 / (size * size));
  float halo = exp(-dist2 / (size * size * 30.0)) * 0.14;
  // wavering column of reflected light dropped straight down the water
  float column = exp(-pow((p.x - pos.x) / (size * 2.4), 2.0));
  column *= smoothstep(pos.y, pos.y - 0.02, p.y) * exp(-(pos.y - p.y) * 6.0);
  column *= smoothstep(horizon + 0.06, horizon - 0.05, p.y) * 0.5;
  return tint * (core * 1.3 + halo + column) * on;
}

vec3 harborLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float horizon = 0.52;
  vec3 col = vec3(0.012, 0.020, 0.034) * (0.4 + uv.y * 0.7);
  // near-black swell with a faint moon-grey sheen
  float water = smoothstep(horizon + 0.01, horizon - 0.04, uv.y);
  float swell = fbm(vec2(p.x * 3.0, uv.y * 14.0 - time * 0.12));
  col += vec3(0.020, 0.034, 0.050) * water * (0.3 + swell * 0.5);
  float hline = exp(-pow((uv.y - horizon) / 0.010, 2.0));
  col += vec3(0.10, 0.14, 0.20) * hline * 0.35;

  // channel buoys: red to port, green to starboard, each on its own clock
  float bob1 = sin(time * 0.5 + 1.2) * 0.006;
  float bob2 = sin(time * 0.42 + 3.9) * 0.007;
  float bob3 = sin(time * 0.58 + 5.1) * 0.005;
  float f1 = step(fract(time / 2.6), 0.13);
  float f2 = step(fract(time / 4.1), 0.10);
  float f3 = step(fract(time / 3.2), 0.12);
  col += harbor_lamp(p, vec2(0.24 * aspect, 0.475 + bob1), vec3(1.0, 0.12, 0.10), 0.006, f1, horizon);
  col += harbor_lamp(p, vec2(0.58 * aspect, 0.455 + bob2), vec3(0.10, 1.0, 0.35), 0.007, f2, horizon);
  col += harbor_lamp(p, vec2(0.83 * aspect, 0.485 + bob3), vec3(1.0, 0.12, 0.10), 0.005, f3, horizon);

  // anchored boats: steady white masthead over a warm cabin porthole
  float sway = sin(time * 0.32 + 0.7) * 0.004;
  col += harbor_lamp(p, vec2(0.40 * aspect + sway, 0.565), vec3(0.92, 0.95, 1.0), 0.0045, 1.0, horizon);
  col += harbor_lamp(p, vec2(0.40 * aspect + sway * 0.6, 0.505), vec3(1.0, 0.65, 0.30), 0.006, 1.0, horizon);
  float sway2 = sin(time * 0.27 + 4.2) * 0.005;
  col += harbor_lamp(p, vec2(0.70 * aspect + sway2, 0.545), vec3(0.92, 0.95, 1.0), 0.0035, 1.0, horizon);

  // the pier: a short string of sodium dots and a breathing jetty beacon
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float mood = 0.85 + 0.15 * sin(time * 0.8 + fi * 2.1);
    col += harbor_lamp(p, vec2((0.03 + fi * 0.032) * aspect, 0.535), vec3(1.0, 0.52, 0.18), 0.0045, mood, horizon);
  }
  float breathe = 0.55 + 0.45 * sin(time * 0.9);
  col += harbor_lamp(p, vec2(0.185 * aspect, 0.545), vec3(1.0, 0.85, 0.55), 0.008, breathe, horizon);

  // thin sea fog drifting just above the horizon
  float fog = fbm(p * vec2(1.6, 4.0) + vec2(time * 0.018, 0.0));
  col += vec3(0.03, 0.045, 0.06) * fog * exp(-pow((uv.y - horizon - 0.08) / 0.1, 2.0)) * 0.5;
  return col;
}

// ---- scene 20: volcano ----
vec3 volcanoLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  vec3 blood = vec3(0.62, 0.05, 0.012);  // deep eruption red
  vec3 lava  = vec3(1.0, 0.30, 0.05);    // molten orange
  vec3 hot   = vec3(1.0, 0.78, 0.35);    // white-hot core

  vec2 crater = vec2(0.60 * aspect, 0.44);
  // the mountain breathes on a long cycle: build, spike, settle
  float surge = pow(0.5 + 0.5 * sin(time * 0.88), 3.0);
  float pulse = 0.5 + 0.4 * sin(time * 1.3) * surge + surge * 0.9;

  // black cone silhouette with a rough ridge line
  float ridge = fbm(vec2(p.x * 5.0, 3.7)) * 0.03;
  float coneY = crater.y - abs(p.x - crater.x) * 0.55 - ridge;
  float onCone = smoothstep(coneY + 0.004, coneY - 0.004, uv.y);

  // ash column and sky underglow, all of it blocked by the cone
  vec2 up = p - crater;
  float ash = fbm(vec2(up.x * 2.6, up.y * 2.0 - time * 0.06) + 7.7);
  float column = exp(-pow(up.x / (0.10 + max(up.y, 0.0) * 0.6), 2.0)) * smoothstep(-0.02, 0.1, up.y);
  float skyGlow = exp(-dot(up, up) * 4.0);
  vec3 col = (blood * (skyGlow * 0.8 + column * ash * 1.1) + lava * column * smoothstep(0.55, 0.95, ash) * 0.5) * pulse * (1.0 - onCone);
  col += vec3(0.015, 0.010, 0.016) * (1.0 - onCone) * (0.3 + uv.y * 0.6);

  // the crater mouth seethes white-hot
  float mouth = exp(-dot(up, up) * 340.0);
  col += (hot * mouth * 1.4 + lava * exp(-dot(up, up) * 60.0) * 0.8) * (0.5 + pulse * 0.7);

  // lava bombs lobbed out on shallow arcs
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    float s1 = hash(vec2(fi, 5.5));
    float s2 = hash(vec2(fi, 13.1));
    float period = mix(2.6, 4.2, s1);
    float t = fract(time / period + s2);
    float launch = floor(time / period + s2);
    float vx = (hash(vec2(fi, launch)) - 0.5) * 0.34;
    float vy = mix(0.24, 0.42, hash(vec2(launch, fi + 7.0)));
    vec2 bd = p - (crater + vec2(vx * t, vy * t - 0.30 * t * t));
    float life = smoothstep(0.0, 0.05, t) * (1.0 - smoothstep(0.5, 0.95, t));
    col += mix(hot, lava, t) * exp(-dot(bd, bd) / 0.000045) * life * (0.4 + surge);
  }

  // a rivulet of lava threading down the near slope
  float path = crater.x + (fbm(vec2(uv.y * 7.0, 4.4)) - 0.5) * 0.10;
  float channel = exp(-pow((p.x - path) / 0.006, 2.0));
  channel *= smoothstep(crater.y - 0.01, crater.y - 0.06, uv.y) * smoothstep(0.0, 0.15, uv.y) * onCone;
  float run = 0.75 + 0.25 * sin(uv.y * 40.0 + time * 2.2);
  col += lava * channel * run * (0.5 + surge * 0.8);

  return col;
}

// ---- scene 21: ferris ----
vec3 ferris_bulb(float h) {
  vec3 cherry = vec3(1.0, 0.16, 0.28);
  vec3 amber  = vec3(1.0, 0.62, 0.14);
  vec3 mint   = vec3(0.24, 1.0, 0.58);
  vec3 skyBlue = vec3(0.26, 0.62, 1.0);
  float s = h * 4.0;
  vec3 c = cherry;
  c = mix(c, amber,   step(1.0, s));
  c = mix(c, mint,    step(2.0, s));
  c = mix(c, skyBlue, step(3.0, s));
  return c;
}

vec3 ferrisLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  vec2 hub = vec2(0.56 * aspect, 0.54);
  float radius = 0.27;
  vec2 d = p - hub;
  float r = length(d);
  float a = atan(d.y, d.x);
  float spin = time * 0.10;

  vec3 col = vec3(0.012, 0.012, 0.030) * (0.35 + uv.y * 0.75);

  // marquee bulbs chasing each other around the rim
  float rim = exp(-pow((r - radius) / 0.0045, 2.0));
  float chase = 0.35 + 0.65 * smoothstep(0.2, 0.9, 0.5 + 0.5 * sin(a * 30.0 - time * 2.6));
  col += vec3(1.0, 0.86, 0.60) * rim * chase * 1.1;
  col += vec3(0.30, 0.22, 0.42) * exp(-pow((r - radius) / 0.05, 2.0)) * 0.15;

  // eight beaded spokes turning with the wheel
  float spokeA = (a - spin) / 6.2831853 * 8.0;
  float spoke = exp(-pow((fract(spokeA) - 0.5) / 0.05, 2.0));
  float beadsAlong = 0.4 + 0.6 * pow(0.5 + 0.5 * sin(r * 150.0), 2.0);
  spoke *= smoothstep(0.03, 0.08, r) * smoothstep(radius + 0.005, radius - 0.02, r);
  col += vec3(0.85, 0.80, 1.0) * spoke * beadsAlong * 0.26;

  // twelve coloured cabins rocking under their rim pins
  for (int i = 0; i < 12; i++) {
    float fi = float(i);
    float ca = spin + fi / 12.0 * 6.2831853;
    vec2 cab = hub + vec2(cos(ca), sin(ca)) * radius + vec2(sin(time * 0.9 + fi * 1.7) * 0.012, -0.016);
    vec2 cd = p - cab;
    float cd2 = dot(cd, cd);
    vec3 cc = ferris_bulb(fract(fi * 0.3125));
    col += cc * (exp(-cd2 / 0.000075) * 1.25 + exp(-cd2 / 0.0011) * 0.18);
  }

  // hub lamp and the A-frame legs down to the ground
  col += vec3(1.0, 0.90, 0.70) * (exp(-r * r * 2600.0) * 1.1 + exp(-r * r * 300.0) * 0.25);
  vec2 leg = normalize(vec2(0.42, -1.0));
  float l1 = abs(d.x * leg.y - d.y * leg.x);
  float l2 = abs(d.x * leg.y + d.y * leg.x);
  float legLine = exp(-pow(min(l1, l2) / 0.0035, 2.0));
  legLine *= step(uv.y, hub.y - 0.02) * smoothstep(-0.02, 0.10, uv.y);
  col += vec3(0.42, 0.38, 0.58) * legLine * 0.22;

  // the fairground below: warm booth wash and pinprick stalls
  float ground = exp(-pow((uv.y - 0.10) / 0.09, 2.0));
  float booths = fbm(vec2(p.x * 6.0, uv.y * 8.0) + 3.3);
  col += vec3(0.55, 0.28, 0.10) * ground * (0.3 + booths * 0.5);
  vec2 g = vec2(p.x, uv.y) * 34.0;
  vec2 gid = floor(g);
  float twinkle = 0.6 + 0.4 * sin(time * 3.0 + hash(gid) * 20.0);
  float stall = step(0.93, hash(gid + 6.1)) * exp(-pow(length(fract(g) - 0.5) / 0.16, 2.0));
  col += vec3(1.0, 0.75, 0.40) * stall * ground * twinkle * 1.2;

  return col;
}

// ---- scene 22: tv ----
float tv_window(vec2 f, vec2 ext) {
  vec2 e = abs(f - 0.5) - ext;
  return smoothstep(0.015, -0.015, max(e.x, e.y));
}

vec3 tvLight(vec2 uv, float time) {
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  vec3 tvBlue = vec3(0.40, 0.62, 1.0);
  vec3 tvPale = vec3(0.75, 0.82, 1.0);
  vec3 lampWarm = vec3(1.0, 0.62, 0.24);

  // the block across the street, almost everyone asleep
  vec3 col = vec3(0.014, 0.016, 0.026) * (0.5 + uv.y * 0.5);
  vec2 grid = vec2(p.x * 6.5, uv.y * 5.0);
  vec2 id = floor(grid);
  vec2 f = fract(grid);
  float kind = hash(id + 4.7);

  float win = tv_window(f, vec2(0.26, 0.20));
  // dark glass still catches a little of the street
  col += vec3(0.012, 0.014, 0.022) * win * 0.6;

  // a few lamps still on behind half-drawn curtains
  float lampOn = step(0.85, kind) * (1.0 - step(0.93, kind));
  float curtain = smoothstep(0.15, 0.8, f.x + (hash(id + 9.0) - 0.5) * 0.5);
  col += lampWarm * win * lampOn * mix(0.34, 0.05, curtain);

  // the televisions: cold light jump-cutting from shot to shot
  float tvOn = step(0.93, kind);
  float rate = mix(0.7, 1.5, hash(id + 15.0));
  float shot = floor(time * rate + hash(id + 21.0) * 40.0);
  float h1 = hash(vec2(shot, id.x * 7.0 + id.y));
  float h2 = hash(vec2(shot * 1.7 + 3.0, id.y * 3.0 + id.x));
  float level = mix(0.10, 1.0, h1 * h1);
  vec3 screenTint = mix(tvBlue, mix(tvPale, lampWarm, step(0.8, h2)), h2 * 0.55);
  float roomGrad = mix(1.0, 0.55, f.y);
  float flickFast = 0.88 + 0.12 * sin(time * 24.0 + h1 * 40.0);
  col += screenTint * win * tvOn * level * roomGrad * flickFast * 1.1;
  // and their glow spilling out over the brickwork
  vec2 sd = p - vec2((id.x + 0.5) / 6.5, (id.y + 0.5) / 5.0);
  col += screenTint * exp(-dot(sd, sd) * 180.0) * tvOn * level * 0.30;

  // sodium street light rising faintly from below the frame
  col += vec3(0.16, 0.09, 0.04) * exp(-uv.y * 6.0) * 0.4;
  return col;
}

vec3 mistLight(vec2 uv, vec2 pointer, float time, float presence) {
  if (u_scene < 0.5) return prismLight(uv, pointer, time, presence);
  if (u_scene < 1.5) return cityLight(uv, time);
  if (u_scene < 2.5) return moonLight(uv, time);
  if (u_scene < 3.5) return duskLight(uv, time);
  if (u_scene < 4.5) return sodiumLight(uv, time);
  if (u_scene < 5.5) return neonLight(uv, time);
  if (u_scene < 6.5) return stormLight(uv, pointer, time, presence);
  if (u_scene < 7.5) return auroraLight(uv, time);
  if (u_scene < 8.5) return firefliesLight(uv, time);
  if (u_scene < 9.5) return lighthouseLight(uv, time);
  if (u_scene < 10.5) return embersLight(uv, time);
  if (u_scene < 11.5) return tideLight(uv, time);
  if (u_scene < 12.5) return lanternLight(uv, time);
  if (u_scene < 13.5) return meteorLight(uv, time);
  if (u_scene < 14.5) return cathedralLight(uv, time);
  if (u_scene < 15.5) return fireworksLight(uv, time);
  if (u_scene < 16.5) return trainLight(uv, time);
  if (u_scene < 17.5) return wispsLight(uv, time);
  if (u_scene < 18.5) return glowwormsLight(uv, time);
  if (u_scene < 19.5) return harborLight(uv, time);
  if (u_scene < 20.5) return volcanoLight(uv, time);
  if (u_scene < 21.5) return ferrisLight(uv, time);
  return tvLight(uv, time);
}

vec3 mistScene(vec2 uv, vec2 lightUv, vec2 pointer, float time, float presence, float wet) {
  float night = step(0.5, u_night);
  vec3 base = mistBase(uv, time);
  vec3 light = mistLight(lightUv, pointer, time, presence);
  vec3 sampled = light;
  if (night > 0.5) {
    float storm = step(5.5, u_scene) * (1.0 - step(6.5, u_scene));
    float flash = storm * stormPulse(time, 18.0);
    vec3 reflection = mistLight(uv, pointer, time, presence);
    light = mix(light, reflection, wet * mix(0.68, 0.94, flash));
  }
  if (u_scene > 5.5 && u_scene < 6.5) {
    vec3 strike = stormStrike(uv, time);
    light = 1.0 - (1.0 - light) * (1.0 - clamp(strike * 0.82, 0.0, 1.0));
  }
  if (u_scene > 3.5 && u_scene < 4.5) {
    vec2 ridge = vec2(0.0045, 0.0015);
    vec3 edge = abs(sodiumLight(lightUv + ridge, time) - sampled);
    light += edge * wet * 0.72;
  }
  if (night < 0.5 && u_scene < 0.5) {
    vec3 lit = clamp(light, 0.0, 1.0);
    vec3 spectrumColor = 1.0 - (1.0 - base) * (1.0 - lit);
    float ink = smoothstep(0.025, 0.72, dot(lit, vec3(0.299, 0.587, 0.114)));
    vec3 monoColor = base * mix(vec3(1.0), vec3(0.46), ink * 0.72);
    return mix(spectrumColor, monoColor, u_mono);
  }
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
  float rawY = gl_FragCoord.y - u_offset;
  vec2 frag = vec2(gl_FragCoord.x, abs(rawY));
  // Mirror the last shader rows into the bleed so procedural cells do not
  // cross a hard UV boundary at the bottom of the hero.
  vec2 uv = frag / u_resolution;
  float inside = step(0.0, rawY) * step(rawY, u_resolution.y);
  float cleared = texture2D(u_mask, clamp(uv, 0.0, 1.0)).r * inside;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 pointer = u_pointer / u_resolution;
  vec2 delta = uv - pointer;
  vec2 roundDelta = vec2(delta.x * aspect, delta.y);
  float distanceToPointer = length(roundDelta);
  float reveal = smoothstep(0.075, 0.0, distanceToPointer) * u_drawing;

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
  float night = step(0.5, u_night);
  float storm = step(5.5, u_scene) * (1.0 - step(6.5, u_scene));
  vec2 sampleUv = uv + tangent * lens * twist - wetNormal * mix(7.2, 3.2, night);
  vec3 color = mistScene(uv, sampleUv, pointer, u_time, u_presence, wet);
  vec3 revealLight = mix(
    mix(vec3(0.28, 0.24, 0.18), spectrum(pointer.x * 0.22 + u_time * 0.015) * 0.32, 0.42),
    mix(vec3(0.12, 0.14, 0.22), spectrum(pointer.x * 0.22 + u_time * 0.015) * 0.55, 0.58),
    night
  );
  float salt = step(3.5, u_scene) * (1.0 - step(4.5, u_scene));
  vec3 amber = mix(vec3(0.1, 0.12, 0.18), vec3(1.0, 0.32, 0.035), 0.62);
  revealLight = mix(revealLight, amber, salt);
  vec3 neon = mix(vec3(0.02, 0.48, 0.64), vec3(0.88, 0.03, 0.48), smoothstep(0.18, 0.82, pointer.x));
  revealLight = mix(revealLight, neon, step(4.5, u_scene) * (1.0 - step(5.5, u_scene)));
  revealLight = mix(revealLight, vec3(0.12, 0.2, 0.38), storm);
  revealLight = mix(revealLight, vec3(0.18, 0.85, 0.62), sceneIs(7.0));  // aurora
  revealLight = mix(revealLight, vec3(0.90, 0.96, 0.52), sceneIs(8.0));  // fireflies
  revealLight = mix(revealLight, vec3(1.0, 0.86, 0.6), sceneIs(9.0));  // lighthouse
  revealLight = mix(revealLight, vec3(1.0, 0.45, 0.16), sceneIs(10.0));  // embers
  revealLight = mix(revealLight, vec3(0.18, 1.0, 0.88), sceneIs(11.0));  // tide
  revealLight = mix(revealLight, vec3(1.0, 0.72, 0.38), sceneIs(12.0));  // lantern
  revealLight = mix(revealLight, vec3(0.55, 0.68, 1.0), sceneIs(13.0));  // meteor
  revealLight = mix(revealLight, vec3(1.0, 0.72, 0.34), sceneIs(14.0));  // cathedral
  revealLight = mix(revealLight, vec3(1.0, 0.58, 0.42), sceneIs(15.0));  // fireworks
  revealLight = mix(revealLight, vec3(1.0, 0.74, 0.40), sceneIs(16.0));  // train
  revealLight = mix(revealLight, vec3(0.35, 0.95, 0.75), sceneIs(17.0));  // wisps
  revealLight = mix(revealLight, vec3(0.30, 0.80, 1.0), sceneIs(18.0));  // glowworms
  revealLight = mix(revealLight, vec3(0.60, 0.75, 0.92), sceneIs(19.0));  // harbor
  revealLight = mix(revealLight, vec3(1.0, 0.34, 0.10), sceneIs(20.0));  // volcano
  revealLight = mix(revealLight, vec3(1.0, 0.55, 0.65), sceneIs(21.0));  // ferris
  revealLight = mix(revealLight, vec3(0.50, 0.68, 1.0), sceneIs(22.0));  // tv
  color = 1.0 - (1.0 - color) * (1.0 - revealLight * reveal * mix(0.72, 0.9, night));
  float value = luminance(color);
  vec3 glassNormal = normalize(vec3(wetNormal * 115.0, 1.0));
  vec3 key = mix(normalize(vec3(-0.3, 0.6, 0.7)), normalize(vec3(0.2, 0.45, 0.87)), night);
  float shine = pow(max(dot(glassNormal, key), 0.0), mix(26.0, 34.0, night));
  vec3 reflection = mix(vec3(1.0, 0.98, 0.94), vec3(0.32, 0.38, 0.52), night);
  vec3 fringe = mix(reflection, spectrum(atan(wetNormal.y, wetNormal.x) * 0.159 + uv.x * 0.33), mix(0.34, 0.24, night));
  fringe = mix(fringe, mix(reflection, vec3(1.0, 0.34, 0.045), 0.22), salt);
  vec3 edge = mix(
    mix(vec3(0.02, 0.9, 1.0), vec3(1.0, 0.02, 0.52), smoothstep(-0.035, 0.035, wetNormal.x)),
    vec3(0.94, 0.12, 1.0),
    smoothstep(0.025, 0.075, wetNormal.y)
  );
  fringe = mix(fringe, edge, step(4.5, u_scene) * (1.0 - step(5.5, u_scene)));
  fringe = mix(fringe, vec3(0.52, 0.68, 0.96), storm);
  fringe = mix(fringe, vec3(0.42, 0.36, 0.85), sceneIs(7.0));  // aurora
  fringe = mix(fringe, vec3(0.52, 0.86, 0.56), sceneIs(8.0));  // fireflies
  fringe = mix(fringe, vec3(0.3, 0.55, 0.75), sceneIs(9.0));  // lighthouse
  fringe = mix(fringe, vec3(1.0, 0.56, 0.22), sceneIs(10.0));  // embers
  fringe = mix(fringe, vec3(0.07, 0.71, 0.79), sceneIs(11.0));  // tide
  fringe = mix(fringe, vec3(0.55, 0.66, 1.0), sceneIs(12.0));  // lantern
  fringe = mix(fringe, vec3(0.45, 0.60, 0.95), sceneIs(13.0));  // meteor
  fringe = mix(fringe, vec3(0.45, 0.40, 0.85), sceneIs(14.0));  // cathedral
  fringe = mix(fringe, vec3(0.95, 0.52, 0.72), sceneIs(15.0));  // fireworks
  fringe = mix(fringe, vec3(0.48, 0.56, 0.80), sceneIs(16.0));  // train
  fringe = mix(fringe, vec3(0.40, 0.82, 0.68), sceneIs(17.0));  // wisps
  fringe = mix(fringe, vec3(0.36, 0.66, 0.95), sceneIs(18.0));  // glowworms
  fringe = mix(fringe, vec3(0.42, 0.72, 0.62), sceneIs(19.0));  // harbor
  fringe = mix(fringe, vec3(1.0, 0.44, 0.18), sceneIs(20.0));  // volcano
  fringe = mix(fringe, vec3(0.72, 0.52, 0.95), sceneIs(21.0));  // ferris
  fringe = mix(fringe, vec3(0.56, 0.70, 1.0), sceneIs(22.0));  // tv
  color += shine * wet * clear * (mix(0.06, 0.035, night) + smoothstep(mix(0.84, 0.42, night), 0.99, value) * mix(0.42, 0.3, night)) * fringe;
  color += reflection * wet * clear * night * 0.012;
  color *= 1.0 + wet * smoothstep(mix(0.84, 0.55, night), 0.99, value) * mix(0.08, 0.14, night);
  float flash = storm * stormPulse(u_time, 18.0);
  float rim = pow(clamp(1.0 - glassNormal.z, 0.0, 1.0), 4.0);
  color += vec3(0.78, 0.9, 1.0) * wet * clear * flash * (shine * 0.9 + rim * 0.11);

  float vignette = smoothstep(1.28, 0.24, length(uv - 0.5));
  color *= mix(mix(0.93, 1.0, vignette), mix(0.78, 1.0, vignette), night);
  color += (hash(frag + fract(u_time) * 93.0) - 0.5) * mix(0.035, 0.02, night);
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0 - cleared);
}
