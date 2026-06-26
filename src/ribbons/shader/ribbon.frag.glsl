// Ribbon flutter fragment shader.
//
// Per-lobe brand color + soft additive glow. Designed for AdditiveBlending and
// an UnrealBloom pass downstream, so the ribbons read as emissive light-forms
// rather than lit surfaces.

uniform vec3 uColor[4]; // brand colors, one per lobe (BRAND_ORDER)

varying float vLobe;
varying float vProgress;
varying float vGlow;

// Pick the lobe color with constant array indices (WebGL1-safe — no dynamic
// indexing of the uniform array).
vec3 lobeColor(float lobe) {
  vec3 c = uColor[0];
  c = mix(c, uColor[1], step(0.5, lobe) * step(lobe, 1.5));
  c = mix(c, uColor[2], step(1.5, lobe) * step(lobe, 2.5));
  c = mix(c, uColor[3], step(2.5, lobe));
  return c;
}

void main() {
  vec3 base = lobeColor(vLobe);

  float intensity = clamp(vGlow, 0.0, 2.0);

  // Wispy fade at both ends of each ribbon.
  float ends =
      smoothstep(0.0, 0.08, vProgress) * smoothstep(1.0, 0.92, vProgress);

  vec3 col = base * intensity;
  gl_FragColor = vec4(col, ends * 0.9);
}
