import * as THREE from './node_modules/three/build/three.module.js';

const card = document.querySelector('#partnerCard');
const canvas = document.querySelector('#partnerCanvas');

if (card && canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(0, 0.2, 8.8);
  camera.lookAt(0, 0.15, 0);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, premultipliedAlpha: true });
  } catch (error) {
    card.dataset.webglError = 'true';
    throw error;
  }

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  scene.add(new THREE.HemisphereLight(0xffffff, 0x8aa0bb, 2.35));
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.6);
  keyLight.position.set(-3, 5, 6);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0xb9ddff, 1.7);
  rimLight.position.set(4, 2, -3);
  scene.add(rimLight);

  const whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xf7f7f4, roughness: 0.42, metalness: 0.02 });
  const blackMaterial = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.3, metalness: 0.04 });
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x070707, roughness: 0.2 });
  const shadowMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18, depthWrite: false });

  const root = new THREE.Group();
  root.position.y = 0.05;
  scene.add(root);

  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), whiteMaterial);
  body.scale.set(1.02, 1.38, 0.76);
  body.position.y = 0.25;
  root.add(body);

  const makeEar = (x, tilt) => {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.78, 4, 1), whiteMaterial);
    ear.position.set(x, 1.55, -0.02);
    ear.rotation.y = Math.PI / 4;
    ear.rotation.z = tilt;
    ear.scale.z = 0.78;
    root.add(ear);
    return ear;
  };
  makeEar(-0.53, 0.05);
  makeEar(0.53, -0.05);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.5, 36, 24), blackMaterial);
  nose.scale.set(1.08, 0.86, 0.86);
  nose.position.set(0, 0.95, 0.82);
  root.add(nose);

  const makeEye = (x) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 14), eyeMaterial);
    eye.position.set(x, 1.15, 0.74);
    root.add(eye);
  };
  makeEye(-0.35);
  makeEye(0.35);

  const makeLimb = (radius, length, material) => new THREE.Mesh(
    new THREE.CapsuleGeometry(radius, length, 8, 16, 1),
    material
  );

  const makeArm = (x, side) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, 0.68, 0.02);
    pivot.rotation.z = side * -0.08;
    const arm = makeLimb(0.105, 0.58, blackMaterial);
    arm.position.y = -0.38;
    pivot.add(arm);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 14), blackMaterial);
    hand.scale.set(0.86, 1.15, 0.8);
    hand.position.y = -0.78;
    pivot.add(hand);
    root.add(pivot);
    return pivot;
  };
  const leftArm = makeArm(-0.96, -1);
  const rightArm = makeArm(0.96, 1);

  const makeLeg = (x) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, -1.08, 0);
    const leg = makeLimb(0.13, 0.42, blackMaterial);
    leg.position.y = -0.28;
    pivot.add(leg);
    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.21, 24, 16), blackMaterial);
    foot.scale.set(1.15, 0.62, 1.5);
    foot.position.set(0, -0.62, 0.12);
    pivot.add(foot);
    root.add(pivot);
    return pivot;
  };
  const leftLeg = makeLeg(-0.39);
  const rightLeg = makeLeg(0.39);

  const tail = new THREE.Mesh(new THREE.SphereGeometry(0.31, 28, 20), whiteMaterial);
  tail.position.set(0.82, -0.4, -0.52);
  tail.scale.set(0.9, 1.05, 0.75);
  root.add(tail);

  const groundShadow = new THREE.Mesh(new THREE.CircleGeometry(1.15, 40), shadowMaterial);
  groundShadow.rotation.x = -Math.PI / 2;
  groundShadow.position.set(0, -1.58, 0.05);
  groundShadow.scale.y = 0.36;
  scene.add(groundShadow);

  const state = {
    action: 'idle',
    actionStart: performance.now(),
    actionDuration: 0,
    rotationY: 0,
    turnFrom: 0,
    turnTo: 0
  };

  const resetPose = () => {
    root.position.x = 0;
    root.position.y = 0.05;
    root.rotation.z = 0;
    root.scale.set(1, 1, 1);
    leftArm.rotation.set(0, 0, 0.08);
    rightArm.rotation.set(0, 0, -0.08);
    leftLeg.rotation.set(0, 0, 0);
    rightLeg.rotation.set(0, 0, 0);
  };

  const smooth = (value) => value * value * (3 - 2 * value);

  const triggerAction = (action) => {
    const now = performance.now();
    state.action = action;
    state.actionStart = now;
    if (action === 'wave') state.actionDuration = 1450;
    if (action === 'dance') state.actionDuration = 2600;
    if (action === 'turn') {
      state.actionDuration = 1050;
      state.turnFrom = state.rotationY;
      state.turnTo = state.rotationY + Math.PI;
    }
  };

  card.addEventListener('partneraction', (event) => triggerAction(event.detail?.action || 'wave'));

  const resize = () => {
    const width = Math.max(1, card.clientWidth);
    const height = Math.max(1, card.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(card);
  resize();

  const clock = new THREE.Clock();
  const render = (now) => {
    const time = clock.getElapsedTime();
    resetPose();
    root.rotation.y = state.rotationY;

    const elapsed = now - state.actionStart;
    const progress = state.actionDuration ? Math.min(1, elapsed / state.actionDuration) : 1;
    const idleBreath = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : Math.sin(time * 2.2) * 0.018;
    body.scale.y = 1.38 + idleBreath;
    root.position.y += Math.sin(time * 1.8) * 0.025;

    if (state.action === 'wave') {
      const wave = Math.sin(progress * Math.PI * 7);
      rightArm.rotation.z = 2.2 + wave * 0.3;
      rightArm.rotation.x = wave * 0.16;
      root.rotation.z = Math.sin(progress * Math.PI) * -0.05;
    } else if (state.action === 'dance') {
      const beat = Math.sin(progress * Math.PI * 8);
      const side = Math.sin(progress * Math.PI * 4);
      root.position.x = side * 0.18;
      root.position.y += Math.abs(beat) * 0.16;
      root.rotation.z = side * 0.14;
      root.rotation.y = state.rotationY + side * 0.2;
      leftArm.rotation.z = -1.0 - beat * 0.34;
      rightArm.rotation.z = 1.0 + beat * 0.34;
      leftLeg.rotation.z = side * -0.2;
      rightLeg.rotation.z = side * 0.2;
    } else if (state.action === 'turn') {
      const eased = smooth(progress);
      root.rotation.y = THREE.MathUtils.lerp(state.turnFrom, state.turnTo, eased);
      state.rotationY = root.rotation.y;
      root.position.y += Math.sin(progress * Math.PI) * 0.08;
    }

    if (progress >= 1 && state.action !== 'idle') {
      if (state.action === 'turn') state.rotationY = state.turnTo;
      state.action = 'idle';
      state.actionDuration = 0;
    }

    renderer.render(scene, camera);
  };

  renderer.setAnimationLoop(render);
  window.__kanShan3D = { state, triggerAction, renderer, root };
}
