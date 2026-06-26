// Ribbon flutter vertex shader.
//
// three.js injects: position, uv, normal, projectionMatrix, modelViewMatrix.
// For a TubeGeometry, uv.x runs 0..1 along the tube — we use it as the ribbon
// progress for the flutter waves and the wispy end fade.

uniform float uTime;
uniform vec2 uPointer;   // pointer in stage XY space (-1..1-ish)
uniform float uAssemble; // 0 collapsed knot → 1 full butterfly
uniform float uSpread;   // 0 closed wings → 1 spread wide

attribute float aLobe; // which brand lobe (0..3) this vertex belongs to

varying float vLobe;
varying float vProgress;
varying float vGlow;

const float TAU = 6.2831853;

void main() {
  vLobe = aLobe;
  float progress = uv.x;
  vProgress = progress;

  vec3 pos = position;

  // Layered-sine flutter rippling along the length of the ribbon.
  float t = uTime;
  float flutter =
      sin(progress * TAU * 2.0 + t * 2.0) * 0.06
    + sin(progress * TAU * 5.0 - t * 1.3) * 0.03
    + sin(progress * TAU * 9.0 + t * 3.1) * 0.015;
  pos.z += flutter;                                   // flap out of plane
  pos.y += sin(progress * TAU + t * 1.7) * 0.02;      // gentle vertical lift

  // Wings spread apart as the page scrolls.
  pos.xy *= (1.0 + uSpread * 0.6);

  // Pointer-magnetic displacement: pull the ribbon toward the cursor, falling
  // off with distance. Disabled while the form is still assembling.
  vec2 toPointer = uPointer - pos.xy;
  float d = length(toPointer);
  float pull = exp(-d * d * 1.5) * 0.25 * uAssemble;
  pos.xy += normalize(toPointer + 1e-4) * pull;

  // Assemble: collapse to a tight glowing knot at the center when uAssemble = 0.
  pos *= mix(0.05, 1.0, clamp(uAssemble, 0.0, 1.0));

  // Brighten on flutter crests and near the pointer (drives the bloom pass).
  vGlow = 0.6 + 0.4 * sin(progress * TAU * 3.0 + t * 2.0) + pull * 2.0;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
