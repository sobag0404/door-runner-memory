import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { LANE_COLORS, LANE_LIGHT } from '../../lib/constants';
import type { GameTheme } from '../../lib/themes';

function laneX(lane: number, pathCount: number) {
  return (lane - (pathCount - 1) / 2) * 1.25;
}

function runnerX(lane: number, pathCount: number) {
  const laneRatio = pathCount <= 1 ? 0 : lane / (pathCount - 1);
  return -0.36 + laneRatio * 0.16;
}

function opaqueColor(color: string) {
  return /^#[0-9a-fA-F]{8}$/.test(color) ? color.slice(0, 7) : color;
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
  const glowAccent = new THREE.MeshStandardMaterial({
    color: theme.runnerOutfitZip,
    emissive: theme.runnerOutfitZip,
    emissiveIntensity: 0.22,
    roughness: 0.34,
  });
  const skin = new THREE.MeshStandardMaterial({ color: theme.runnerSkin, roughness: 0.62 });
  const hair = new THREE.MeshStandardMaterial({ color: theme.runnerHair, roughness: 0.65 });
  const pants = new THREE.MeshStandardMaterial({ color: theme.runnerPants, roughness: 0.55 });
  const shoes = new THREE.MeshStandardMaterial({ color: theme.runnerShoes, roughness: 0.38 });
  const darkSole = new THREE.MeshStandardMaterial({ color: '#1d2430', roughness: 0.6 });

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 14), skin);
  head.position.set(0, 1.42, 0.04);
  runner.add(head);

  const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.252, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.5), hair);
  hairCap.rotation.x = -0.26;
  hairCap.position.set(0, 1.53, 0.03);
  runner.add(hairCap);

  const hairFlick = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.2, 8), hair);
  hairFlick.position.set(-0.09, 1.58, 0.1);
  hairFlick.rotation.set(0.65, -0.25, -0.35);
  runner.add(hairFlick);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.08, 0.12, 10), skin);
  neck.position.set(0, 1.18, 0.02);
  runner.add(neck);

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.62, 0.3), hoodie);
  torso.position.set(0, 0.86, 0);
  torso.rotation.x = -0.1;
  runner.add(torso);

  const hood = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 8, 20, Math.PI * 1.35), accent);
  hood.position.set(0, 1.14, 0.02);
  hood.rotation.set(1.58, 0, 0.18);
  runner.add(hood);

  const chestStripe = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.09, 0.32), accent);
  chestStripe.position.set(0, 0.99, 0.02);
  runner.add(chestStripe);

  const zipper = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.5, 0.325), glowAccent);
  zipper.position.set(0, 0.81, 0.035);
  runner.add(zipper);

  const sidePouch = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.12), glowAccent);
  sidePouch.position.set(0.31, 0.66, 0.08);
  runner.add(sidePouch);

  const shoulderGeo = new THREE.SphereGeometry(0.105, 10, 8);
  const leftShoulder = new THREE.Mesh(shoulderGeo, hoodie);
  const rightShoulder = new THREE.Mesh(shoulderGeo, hoodie);
  leftShoulder.position.set(-0.31, 1.05, 0.02);
  rightShoulder.position.set(0.31, 1.05, 0.02);
  runner.add(leftShoulder, rightShoulder);

  const armGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.54, 12);
  const leftArm = new THREE.Mesh(armGeo, skin);
  const rightArm = new THREE.Mesh(armGeo, skin);
  leftArm.position.set(-0.38, 0.78, 0.08);
  rightArm.position.set(0.38, 0.82, -0.02);
  leftArm.rotation.set(0.25, 0, -0.72);
  rightArm.rotation.set(-0.18, 0, 0.72);
  runner.add(leftArm, rightArm);

  const wristGeo = new THREE.SphereGeometry(0.075, 10, 8);
  const leftWrist = new THREE.Mesh(wristGeo, skin);
  const rightWrist = new THREE.Mesh(wristGeo, skin);
  leftWrist.position.set(-0.56, 0.57, 0.18);
  rightWrist.position.set(0.56, 0.61, -0.08);
  runner.add(leftWrist, rightWrist);

  const shorts = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.18, 0.28), pants);
  shorts.position.set(0, 0.52, 0.01);
  runner.add(shorts);

  const legGeo = new THREE.CylinderGeometry(0.075, 0.085, 0.58, 12);
  const leftLeg = new THREE.Mesh(legGeo, pants);
  const rightLeg = new THREE.Mesh(legGeo, pants);
  leftLeg.position.set(-0.14, 0.28, 0.13);
  rightLeg.position.set(0.14, 0.29, -0.08);
  leftLeg.rotation.set(0.46, 0.06, 0.03);
  rightLeg.rotation.set(-0.4, -0.04, -0.03);
  runner.add(leftLeg, rightLeg);

  const leftShoe = makeBox([0.22, 0.11, 0.38], theme.runnerShoes, [-0.15, 0.05, 0.28], 0.35);
  const rightShoe = makeBox([0.22, 0.11, 0.38], theme.runnerShoes, [0.15, 0.06, -0.18], 0.35);
  leftShoe.material = shoes;
  rightShoe.material = shoes;
  const leftSole = makeBox([0.24, 0.035, 0.4], '#1d2430', [-0.15, -0.02, 0.29], 0.55);
  const rightSole = makeBox([0.24, 0.035, 0.4], '#1d2430', [0.15, -0.01, -0.18], 0.55);
  leftSole.material = darkSole;
  rightSole.material = darkSole;
  runner.add(leftShoe, rightShoe, leftSole, rightSole);

  const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.42, 0.14), accent);
  backpack.position.set(0, 0.88, -0.21);
  backpack.rotation.x = -0.05;
  const packStripe = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.055, 0.155), glowAccent);
  packStripe.position.set(0, 0.98, -0.29);
  runner.add(backpack, packStripe);

  const scarf = new THREE.Group();
  scarf.name = 'runner-speed-scarf';
  const scarfMat = new THREE.MeshStandardMaterial({
    color: theme.accent2,
    emissive: theme.accent2,
    emissiveIntensity: 0.18,
    roughness: 0.42,
  });
  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), scarfMat);
  knot.position.set(-0.16, 1.18, 0.1);
  const tailA = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.045, 0.42), scarfMat);
  tailA.position.set(-0.34, 1.11, 0.22);
  tailA.rotation.set(0.25, -0.55, -0.18);
  const tailB = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.04, 0.32), scarfMat);
  tailB.position.set(-0.29, 1.03, 0.18);
  tailB.rotation.set(0.05, -0.42, 0.22);
  scarf.add(knot, tailA, tailB);
  runner.add(scarf);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.54, 32),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.24 }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.015, 0);
  runner.add(shadow);

  runner.rotation.y = -0.16;

  return { runner, leftArm, rightArm, leftLeg, rightLeg, leftShoe, rightShoe, scarf };
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
      color: opaqueColor(theme.roadEdgeGlow),
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

    const sidePosts: THREE.Mesh[] = [];
    const postMat = new THREE.MeshStandardMaterial({
      color: theme.hudScoreAccent,
      emissive: theme.hudScoreAccent,
      emissiveIntensity: 0.32,
      roughness: 0.42,
    });
    for (let i = 0; i < 6; i += 1) {
      const z = 1.6 - i * 2.2;
      const leftPost = makeBox([0.08, 0.8, 0.08], postMat.color, [-trackWidth / 2 + 0.18, 0.46, z], 0.42);
      const rightPost = makeBox([0.08, 0.8, 0.08], postMat.color, [trackWidth / 2 - 0.18, 0.46, z], 0.42);
      leftPost.material = postMat;
      rightPost.material = postMat;
      sidePosts.push(leftPost, rightPost);
      scene.add(leftPost, rightPost);
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
    runnerBits.runner.position.set(runnerX(currentLane, pathCount), 0.02, 0.9);
    runnerBits.runner.scale.setScalar(0.74);
    scene.add(runnerBits.runner);

    const dustMat = new THREE.MeshBasicMaterial({ color: theme.runnerDust, transparent: true, opacity: 0.52 });
    const dustPuffs: THREE.Mesh[] = [];
    for (let i = 0; i < 9; i += 1) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(0.035 + (i % 3) * 0.012, 8, 6), dustMat.clone());
      puff.position.set(-0.4 + (i % 3) * 0.28, 0.08, 1.25 + Math.floor(i / 3) * 0.32);
      dustPuffs.push(puff);
      scene.add(puff);
    }

    const feedbackBurst = new THREE.Group();
    const burstMat = new THREE.MeshBasicMaterial({ color: theme.accent2, transparent: true, opacity: 0 });
    for (let i = 0; i < 8; i += 1) {
      const spark = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.16, 0.035), burstMat.clone());
      spark.position.set(0, 1.1, 0.9);
      spark.rotation.z = (i / 8) * Math.PI * 2;
      feedbackBurst.add(spark);
    }
    scene.add(feedbackBurst);

    let frameId = 0;
    const startedAt = window.performance.now();
    const targetX = { value: runnerX(currentLane, pathCount) };

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const animate = () => {
      const t = (window.performance.now() - startedAt) / 1000;
      targetX.value += (runnerX(currentLane, pathCount) - targetX.value) * 0.12;
      runnerBits.runner.position.x = targetX.value;

      if (!reducedMotion) {
        runnerBits.runner.position.y = Math.sin(t * 7.2) * 0.035;
        runnerBits.leftArm.rotation.z = -0.65 + Math.sin(t * 7.2) * 0.34;
        runnerBits.rightArm.rotation.z = 0.65 - Math.sin(t * 7.2) * 0.34;
        runnerBits.leftLeg.rotation.x = 0.35 - Math.sin(t * 7.2) * 0.28;
        runnerBits.rightLeg.rotation.x = -0.35 + Math.sin(t * 7.2) * 0.28;
        runnerBits.leftShoe.rotation.x = Math.sin(t * 7.2) * 0.12;
        runnerBits.rightShoe.rotation.x = -Math.sin(t * 7.2) * 0.12;
        runnerBits.scarf.rotation.y = Math.sin(t * 9.5) * 0.16;
        runnerBits.scarf.rotation.z = Math.sin(t * 6.5) * 0.08;
        horizon.rotation.z = t * 0.18;
        tiles.forEach((tile, index) => {
          tile.position.z = 3.2 - ((t * 2.2 + index * 1.45) % 14.5);
        });
        sidePosts.forEach((post, index) => {
          post.position.z = 1.6 - ((t * 1.8 + index * 1.1) % 13.2);
        });
        dustPuffs.forEach((puff, index) => {
          const drift = (t * 1.6 + index * 0.33) % 1;
          puff.position.x = targetX.value - 0.34 + (index % 3) * 0.24;
          puff.position.z = 1.1 + drift * 0.95;
          puff.position.y = 0.07 + drift * 0.16;
          puff.scale.setScalar(1 + drift * 1.2);
          const mat = puff.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.42 * (1 - drift);
        });
      }

      const laneLean = THREE.MathUtils.clamp((runnerX(currentLane, pathCount) - targetX.value) * 1.7, -0.18, 0.18);
      runnerBits.runner.rotation.y = -0.16 + laneLean;
      feedbackBurst.position.x = runnerBits.runner.position.x;
      feedbackBurst.children.forEach((spark, index) => {
        const mesh = spark as THREE.Mesh;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        const radius = feedback === 'correct' ? 0.28 + Math.sin(t * 8 + index) * 0.04 : 0.22;
        mesh.position.set(
          Math.cos((index / 8) * Math.PI * 2) * radius,
          1.18 + Math.sin(t * 8 + index) * 0.08,
          0.92 + Math.sin((index / 8) * Math.PI * 2) * radius,
        );
        mat.opacity = feedback === 'correct' ? 0.62 : 0;
      });

      if (feedback === 'correct') runnerBits.runner.scale.set(0.79, 0.75, 0.79);
      else if (feedback === 'wrong') runnerBits.runner.rotation.z = Math.sin(t * 28) * 0.04;
      else {
        runnerBits.runner.scale.setScalar(0.74);
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
      renderer.forceContextLoss();
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
