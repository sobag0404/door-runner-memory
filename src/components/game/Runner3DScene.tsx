import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { LANE_COLORS, LANE_LIGHT } from '../../lib/constants';
import type { GameTheme } from '../../lib/themes';

function laneX(lane: number, pathCount: number) {
  return (lane - (pathCount - 1) / 2) * 1.25;
}

function runnerX(lane: number, pathCount: number) {
  const laneRatio = pathCount <= 1 ? 0 : lane / (pathCount - 1);
  return -0.72 + laneRatio * 0.2;
}

function makeBox(
  size: [number, number, number],
  color: THREE.ColorRepresentation,
  position: [number, number, number],
  roughness = 0.55,
) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(size[0], size[1], size[2]),
    new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.08 }),
  );
  mesh.position.set(position[0], position[1], position[2]);
  return mesh;
}

function makeRunner(theme: GameTheme) {
  const runner = new THREE.Group();
  runner.name = 'door-runner-avatar';

  const hoodie = new THREE.MeshStandardMaterial({ color: theme.runnerOutfit, roughness: 0.45 });
  const accent = new THREE.MeshStandardMaterial({ color: theme.runnerOutfitZip, roughness: 0.38 });
  const skin = new THREE.MeshStandardMaterial({ color: theme.runnerSkin, roughness: 0.62 });
  const hair = new THREE.MeshStandardMaterial({ color: theme.runnerHair, roughness: 0.65 });
  const pants = new THREE.MeshStandardMaterial({ color: theme.runnerPants, roughness: 0.55 });
  const shoes = new THREE.MeshStandardMaterial({ color: theme.runnerShoes, roughness: 0.38 });

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 12), skin);
  head.position.set(0, 1.35, 0.05);
  runner.add(head);

  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.255, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.48), hair);
  hairCap.rotation.x = -0.18;
  hairCap.position.set(0, 1.47, 0.02);
  runner.add(hairCap);

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.58, 0.26), hoodie);
  torso.position.set(0, 0.87, 0);
  torso.rotation.x = -0.1;
  runner.add(torso);

  const chestStripe = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.08, 0.285), accent);
  chestStripe.position.set(0, 0.98, 0.01);
  runner.add(chestStripe);

  const armGeo = new THREE.CylinderGeometry(0.055, 0.065, 0.5, 10);
  const leftArm = new THREE.Mesh(armGeo, skin);
  const rightArm = new THREE.Mesh(armGeo, skin);
  leftArm.position.set(-0.32, 0.86, 0.02);
  rightArm.position.set(0.32, 0.86, 0.02);
  leftArm.rotation.z = -0.65;
  rightArm.rotation.z = 0.65;
  runner.add(leftArm, rightArm);

  const legGeo = new THREE.CylinderGeometry(0.07, 0.075, 0.55, 10);
  const leftLeg = new THREE.Mesh(legGeo, pants);
  const rightLeg = new THREE.Mesh(legGeo, pants);
  leftLeg.position.set(-0.12, 0.36, 0.05);
  rightLeg.position.set(0.12, 0.36, -0.02);
  leftLeg.rotation.x = 0.35;
  rightLeg.rotation.x = -0.35;
  runner.add(leftLeg, rightLeg);

  const leftShoe = makeBox([0.2, 0.1, 0.34], theme.runnerShoes, [-0.14, 0.08, 0.16], 0.35);
  const rightShoe = makeBox([0.2, 0.1, 0.34], theme.runnerShoes, [0.14, 0.08, -0.08], 0.35);
  leftShoe.material = shoes;
  rightShoe.material = shoes;
  runner.add(leftShoe, rightShoe);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.45, 32),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.24 }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.015, 0);
  runner.add(shadow);

  return { runner, leftArm, rightArm, leftLeg, rightLeg };
}

function makePortal(lane: number, pathCount: number, theme: GameTheme) {
  const color = LANE_COLORS[lane % LANE_COLORS.length];
  const light = LANE_LIGHT[lane % LANE_LIGHT.length];
  const portal = new THREE.Group();
  portal.position.set(laneX(lane, pathCount), 0, -7.8);

  const frameMat = new THREE.MeshStandardMaterial({
    color: theme.id === 'neon' ? theme.accent : theme.doorArchAccent,
    emissive: color,
    emissiveIntensity: theme.id === 'neon' ? 0.45 : 0.18,
    roughness: 0.42,
    metalness: 0.12,
  });
  const doorMat = new THREE.MeshStandardMaterial({
    color: light,
    emissive: color,
    emissiveIntensity: 0.16,
    roughness: 0.5,
  });

  portal.add(makeBox([0.16, 1.15, 0.22], frameMat.color, [-0.38, 0.65, 0], 0.42));
  portal.add(makeBox([0.16, 1.15, 0.22], frameMat.color, [0.38, 0.65, 0], 0.42));
  portal.add(makeBox([0.92, 0.16, 0.24], frameMat.color, [0, 1.2, 0], 0.42));
  portal.add(makeBox([0.58, 0.86, 0.08], doorMat.color, [0, 0.58, -0.04], 0.5));

  portal.children.forEach((child) => {
    const mesh = child as THREE.Mesh;
    mesh.material = child === portal.children[3] ? doorMat : frameMat;
  });

  const glow = new THREE.PointLight(color, 0.9, 3.2);
  glow.position.set(0, 0.75, 0.35);
  portal.add(glow);

  return portal;
}

export function Runner3DScene({
  pathCount,
  currentLane,
  feedback,
  theme,
}: {
  pathCount: number;
  currentLane: number;
  feedback: 'correct' | 'wrong' | null;
  theme: GameTheme;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(theme.gameBg, 0.055);

    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 80);
    camera.position.set(0, 3.35, 5.55);
    camera.lookAt(0, 0.75, -5.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.domElement.dataset.testid = 'runner-3d-canvas';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.HemisphereLight(theme.sunColor, theme.gameBg, 2.3);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(-2.5, 5, 3.5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(theme.accent2, 1.5);
    rim.position.set(3, 2, -5);
    scene.add(rim);

    const trackWidth = Math.max(pathCount * 1.25 + 1.1, 4.6);
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(trackWidth, 0.08, 17),
      new THREE.MeshStandardMaterial({ color: theme.road, roughness: 0.74, metalness: 0.04 }),
    );
    floor.position.set(0, -0.05, -3.2);
    scene.add(floor);

    const railMat = new THREE.MeshStandardMaterial({
      color: theme.roadEdgeGlow,
      emissive: theme.laneEdgeGlow,
      emissiveIntensity: theme.id === 'neon' ? 0.55 : 0.22,
      roughness: 0.45,
    });
    scene.add(makeBox([0.13, 0.18, 16.8], railMat.color, [-trackWidth / 2, 0.12, -3.25], 0.45));
    scene.add(makeBox([0.13, 0.18, 16.8], railMat.color, [trackWidth / 2, 0.12, -3.25], 0.45));
    (scene.children[scene.children.length - 1] as THREE.Mesh).material = railMat;
    (scene.children[scene.children.length - 2] as THREE.Mesh).material = railMat;

    const tiles: THREE.Mesh[] = [];
    for (let row = 0; row < 10; row += 1) {
      const tile = new THREE.Mesh(
        new THREE.BoxGeometry(trackWidth - 0.25, 0.022, 0.055),
        new THREE.MeshBasicMaterial({ color: theme.hudScoreAccent, transparent: true, opacity: 0.25 }),
      );
      tile.position.set(0, 0.025, 3.2 - row * 1.45);
      tiles.push(tile);
      scene.add(tile);
    }

    for (let lane = 0; lane < pathCount; lane += 1) {
      const color = LANE_COLORS[lane % LANE_COLORS.length];
      const strip = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.035, 16),
        new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: theme.id === 'neon' ? 0.55 : 0.25,
          transparent: true,
          opacity: 0.72,
        }),
      );
      strip.position.set(laneX(lane, pathCount), 0.035, -3.1);
      scene.add(strip);
      scene.add(makePortal(lane, pathCount, theme));
    }

    const horizon = new THREE.Mesh(
      new THREE.TorusGeometry(2.25, 0.035, 10, 80),
      new THREE.MeshBasicMaterial({ color: theme.hudScoreAccent, transparent: true, opacity: 0.36 }),
    );
    horizon.position.set(0, 1.15, -8.4);
    horizon.rotation.x = Math.PI / 2;
    scene.add(horizon);

    const runnerBits = makeRunner(theme);
    runnerBits.runner.position.set(runnerX(currentLane, pathCount), 0.02, 0.8);
    runnerBits.runner.scale.setScalar(0.78);
    scene.add(runnerBits.runner);

    let frameId = 0;
    const clock = new THREE.Clock();
    const targetX = { value: runnerX(currentLane, pathCount) };

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const animate = () => {
      const t = clock.getElapsedTime();
      targetX.value += (runnerX(currentLane, pathCount) - targetX.value) * 0.12;
      runnerBits.runner.position.x = targetX.value;

      if (!reducedMotion) {
        runnerBits.runner.position.y = Math.sin(t * 7.2) * 0.035;
        runnerBits.leftArm.rotation.z = -0.65 + Math.sin(t * 7.2) * 0.34;
        runnerBits.rightArm.rotation.z = 0.65 - Math.sin(t * 7.2) * 0.34;
        runnerBits.leftLeg.rotation.x = 0.35 - Math.sin(t * 7.2) * 0.28;
        runnerBits.rightLeg.rotation.x = -0.35 + Math.sin(t * 7.2) * 0.28;
        horizon.rotation.z = t * 0.18;
        tiles.forEach((tile, index) => {
          tile.position.z = 3.2 - ((t * 2.2 + index * 1.45) % 14.5);
        });
      }

      if (feedback === 'correct') runnerBits.runner.scale.setScalar(0.83);
      else if (feedback === 'wrong') runnerBits.runner.rotation.z = Math.sin(t * 28) * 0.04;
      else {
        runnerBits.runner.scale.setScalar(0.78);
        runnerBits.runner.rotation.z = 0;
      }

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      renderer.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (!mesh.geometry && !mesh.material) return;
        mesh.geometry?.dispose();
        const material = mesh.material;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material?.dispose();
      });
      mount.removeChild(renderer.domElement);
    };
  }, [currentLane, feedback, pathCount, theme]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-[8] pointer-events-none"
      data-testid="runner-3d-scene"
      aria-hidden="true"
    />
  );
}
