import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { RibbonController } from './controller';
import type { RibbonUniforms } from './geometry';

/**
 * Fake ribbon mesh exposing only `material.uniforms` — the controller logic is
 * pure over the shader uniforms, so we never need a real GPU/TubeGeometry here.
 */
function fakeMesh(): { mesh: THREE.Mesh; uniforms: RibbonUniforms } {
  const uniforms: RibbonUniforms = {
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uAssemble: { value: 0 },
    uSpread: { value: 0 },
    uColor: { value: [] },
  };
  const mesh = { material: { uniforms } } as unknown as THREE.Mesh;
  return { mesh, uniforms };
}

describe('RibbonController', () => {
  it('setScroll clamps to [0,1] and maps to uSpread', () => {
    const { mesh, uniforms } = fakeMesh();
    const c = new RibbonController(mesh);

    c.setScroll(0.42);
    expect(uniforms.uSpread.value).toBeCloseTo(0.42);

    c.setScroll(-3);
    expect(uniforms.uSpread.value).toBe(0);

    c.setScroll(7);
    expect(uniforms.uSpread.value).toBe(1);
  });

  it('setPointer writes into the uPointer uniform', () => {
    const { mesh, uniforms } = fakeMesh();
    const c = new RibbonController(mesh);
    c.setPointer(0.5, -0.25);
    expect(uniforms.uPointer.value.x).toBeCloseTo(0.5);
    expect(uniforms.uPointer.value.y).toBeCloseTo(-0.25);
  });

  it('update advances uTime by dt', () => {
    const { mesh, uniforms } = fakeMesh();
    const c = new RibbonController(mesh);
    c.update(0.5);
    c.update(0.25);
    expect(uniforms.uTime.value).toBeCloseTo(0.75);
  });

  it('assemble() resolves and leaves uAssemble === 1', async () => {
    const { mesh, uniforms } = fakeMesh();
    const c = new RibbonController(mesh);
    expect(c.state).toBe('assembling');

    const done = c.assemble();
    // Drive the render loop until assembly completes.
    for (let i = 0; i < 1000 && uniforms.uAssemble.value < 1; i++) {
      c.update(0.016);
    }
    await done;

    expect(uniforms.uAssemble.value).toBe(1);
    expect(c.state).toBe('idle');
  });

  it('liftoff() switches the state machine to liftoff', () => {
    const { mesh } = fakeMesh();
    const c = new RibbonController(mesh);
    c.liftoff();
    expect(c.state).toBe('liftoff');
  });
});
