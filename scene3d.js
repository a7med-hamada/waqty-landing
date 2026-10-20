/**
 * WAQTY 3D Studio Engine (Scroll-Driven Showcase with Real App Screen)
 * High-fidelity 3D Flagship Smartphone displaying official WAQTY mobile interface
 */

class Waqty3DScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // Objects
    this.phoneGroup = null;
    this.screenMesh = null;
    this.screenMat = null;
    this.contactShadow = null;

    // Scroll & Parallax Tracking
    this.scrollProgress = 0;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.clock = new THREE.Clock();

    // Cinematic Scroll Keyframes for the Phone
    // [progress (0 to 1), posX, posY, posZ, rotX, rotY, rotZ]
    this.keyframes = [
      { p: 0.00, pos: [-2.15, 0.05, 0.55], rot: [0.04, 0.35, -0.02] },  // Left side showcase for Hero (prominent & crisp)
      { p: 0.20, pos: [2.20, 0.05, -0.80], rot: [0.06, -0.36, 0.03] },  // Right side for Section 1 (subtle & deep)
      { p: 0.42, pos: [-2.20, 0.05, -0.80], rot: [-0.03, 0.32, -0.01] }, // Left side for Section 2 (subtle & deep)
      { p: 0.65, pos: [2.15, 0.05, -0.80], rot: [0.08, -0.38, 0.02] },  // Right side for Section 3
      { p: 0.82, pos: [-2.15, 0.05, -0.80], rot: [0.10, 0.34, -0.02] }, // Left side for Section 4
      { p: 1.00, pos: [0.00, -1.50, -1.20], rot: [0.22, 0.00, 0.00] }   // Bottom center
    ];

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x060a12, 0.045);

    // Fixed Cinematic Studio Camera
    this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0.5, 7.4);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    this.setupStudioLighting();
    this.buildStudioFloor();
    this.buildRealisticSmartphone();

    // Event Listeners for Scroll & Parallax
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    window.addEventListener('mousemove', (e) => this.onMouseMove(e), { passive: true });
    window.addEventListener('resize', () => this.onWindowResize());

    this.onScroll();
    this.animate();
  }

  /* ==============================================================
     1. Studio Lighting Setup
     ============================================================== */
  setupStudioLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambient);

    // Warm Key Light (Softbox)
    this.keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    this.keyLight.position.set(5, 7, 5);
    this.scene.add(this.keyLight);

    // Cool Soft Fill Light
    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.2);
    fillLight.position.set(-6, 3, 3);
    this.scene.add(fillLight);

    // Emerald Rim Light (Emphasizes titanium edges)
    const rimLight = new THREE.DirectionalLight(0x10b981, 2.0);
    rimLight.position.set(0, 6, -5);
    this.scene.add(rimLight);
  }

  /* ==============================================================
     2. Studio Floor (NO SQUARES, Soft Ambient Drop Shadow)
     ============================================================== */
  buildStudioFloor() {
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 512;
    shadowCanvas.height = 512;
    const sCtx = shadowCanvas.getContext('2d');

    const grad = sCtx.createRadialGradient(256, 256, 10, 256, 256, 240);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    grad.addColorStop(0.4, 'rgba(0, 0, 0, 0.35)');
    grad.addColorStop(0.75, 'rgba(16, 185, 129, 0.06)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 512, 512);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(6.5, 6.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.8
    });

    this.contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.contactShadow.rotation.x = -Math.PI / 2;
    this.contactShadow.position.y = -1.6;
    this.scene.add(this.contactShadow);
  }

  /* ==============================================================
     3. Realistic Smartphone with Official WAQTY Mobile App Screen
     ============================================================== */
  buildRealisticSmartphone() {
    this.phoneGroup = new THREE.Group();

    const w = 2.05;
    const h = 4.25;
    const r = 0.26;
    const d = 0.17;
    const bevel = 0.035;

    // Smooth Curved Bevel Chassis
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2 + r, -h / 2);
    shape.lineTo(w / 2 - r, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    shape.lineTo(w / 2, h / 2 - r);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    shape.lineTo(-w / 2 + r, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    shape.lineTo(-w / 2, -h / 2 + r);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

    const extrudeSettings = {
      depth: d,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 1,
      bevelSize: bevel,
      bevelThickness: bevel
    };

    const chassisGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    chassisGeo.center();

    // Natural Space Black Titanium Chassis
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x141d28,
      metalness: 0.92,
      roughness: 0.22,
      envMapIntensity: 1.8
    });
    const chassisMesh = new THREE.Mesh(chassisGeo, titaniumMat);
    this.phoneGroup.add(chassisMesh);

    // Matte Frosted Glass Back Plate
    const backGeo = new THREE.PlaneGeometry(w - 0.04, h - 0.04);
    const backMat = new THREE.MeshStandardMaterial({
      color: 0x090f18,
      metalness: 0.3,
      roughness: 0.4
    });
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.z = -(d / 2 + bevel) - 0.005;
    backMesh.rotation.y = Math.PI;
    this.phoneGroup.add(backMesh);

    // Triple Camera Module on Back
    const islandGeo = new THREE.BoxGeometry(0.78, 0.78, 0.06);
    const islandMat = new THREE.MeshStandardMaterial({ color: 0x141d2a, metalness: 0.8, roughness: 0.3 });
    const island = new THREE.Mesh(islandGeo, islandMat);
    island.position.set(-0.52, 1.42, -d / 2 - 0.065);
    this.phoneGroup.add(island);

    [-0.18, 0.18].forEach((xOff, idx) => {
      [1.28, 1.56].forEach((yOff, idy) => {
        if (idx === 1 && idy === 1) return;
        const lensRimGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 32);
        const lensRimMat = new THREE.MeshStandardMaterial({ color: 0x243242, metalness: 0.9, roughness: 0.2 });
        const lensRim = new THREE.Mesh(lensRimGeo, lensRimMat);
        lensRim.rotation.x = Math.PI / 2;
        lensRim.position.set(-0.52 + xOff, yOff, -d / 2 - 0.095);
        this.phoneGroup.add(lensRim);

        const lensGlassGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.042, 32);
        const lensGlassMat = new THREE.MeshStandardMaterial({ color: 0x030712, roughness: 0.05, metalness: 0.95 });
        const lensGlass = new THREE.Mesh(lensGlassGeo, lensGlassMat);
        lensGlass.rotation.x = Math.PI / 2;
        lensGlass.position.set(-0.52 + xOff, yOff, -d / 2 - 0.096);
        this.phoneGroup.add(lensGlass);
      });
    });

    // Front OLED Screen Mesh with Curved Corners Matching Phone Chassis
    const sw = w - 0.08;
    const sh = h - 0.08;
    const sr = 0.22;

    const screenShape = new THREE.Shape();
    screenShape.moveTo(-sw / 2 + sr, -sh / 2);
    screenShape.lineTo(sw / 2 - sr, -sh / 2);
    screenShape.quadraticCurveTo(sw / 2, -sh / 2, sw / 2, -sh / 2 + sr);
    screenShape.lineTo(sw / 2, sh / 2 - sr);
    screenShape.quadraticCurveTo(sw / 2, sh / 2, sw / 2 - sr, sh / 2);
    screenShape.lineTo(-sw / 2 + sr, sh / 2);
    screenShape.quadraticCurveTo(-sw / 2, sh / 2, -sw / 2, sh / 2 - sr);
    screenShape.lineTo(-sw / 2, -sh / 2 + sr);
    screenShape.quadraticCurveTo(-sw / 2, -sh / 2, -sw / 2 + sr, -sh / 2);

    const screenGeo = new THREE.ShapeGeometry(screenShape, 32);

    // Compute explicit UV coordinates to map texture across 0..1
    const pos = screenGeo.attributes.position;
    const uvs = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      uvs[i * 2] = (x + sw / 2) / sw;
      uvs[i * 2 + 1] = (y + sh / 2) / sh;
    }
    screenGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    this.screenMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.FrontSide,
      toneMapped: false
    });

    this.screenMesh = new THREE.Mesh(screenGeo, this.screenMat);
    // Position z: 0.128 is safely ahead of the titanium chassis front face (0.120) to prevent any clipping
    this.screenMesh.position.z = 0.128;
    this.phoneGroup.add(this.screenMesh);

    this.scene.add(this.phoneGroup);

    // Load the official user-uploaded WAQTY app screen image
    this.loadAppScreenTexture();
  }

  /* ==============================================================
     4. Load User-Provided WAQTY Mobile App Screen Image
     ============================================================== */
  loadAppScreenTexture() {
    const applyTexture = (img) => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = 8;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      texture.needsUpdate = true;

      if (this.screenMat) {
        this.screenMat.map = texture;
        this.screenMat.needsUpdate = true;
      }
    };

    const screenImg = new Image();
    screenImg.onload = () => applyTexture(screenImg);

    // Use base64 if available to ensure 100% offline and file:// compatibility
    const src = (window.WAQTY_APP_SCREEN_BASE64) ? window.WAQTY_APP_SCREEN_BASE64 : 'app-screen.jpg';
    screenImg.src = src;
    if (screenImg.complete && screenImg.naturalWidth !== 0) {
      applyTexture(screenImg);
    }
  }

  /* ==============================================================
     5. Scroll-Driven Interpolation Logic (Apple-Style Scrollytelling)
     ============================================================== */
  onScroll() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;

    this.scrollProgress = Math.min(Math.max(window.scrollY / docHeight, 0), 1);
  }

  onMouseMove(e) {
    this.mouse.targetX = (e.clientX / this.width - 0.5) * 0.08;
    this.mouse.targetY = (e.clientY / this.height - 0.5) * 0.08;
  }

  /* ==============================================================
     6. Render & Interpolate Animation Loop
     ============================================================== */
  animate() {
    requestAnimationFrame(() => this.animate());

    const time = this.clock.getElapsedTime();

    // 1. Mouse Parallax Smoothing
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // 2. Find Keyframe Segment based on scrollProgress
    const p = this.scrollProgress;
    let segIndex = 0;

    for (let i = 0; i < this.keyframes.length - 1; i++) {
      if (p >= this.keyframes[i].p && p <= this.keyframes[i + 1].p) {
        segIndex = i;
        break;
      }
    }

    const k1 = this.keyframes[segIndex];
    const k2 = this.keyframes[segIndex + 1] || k1;
    const segmentSpan = k2.p - k1.p || 0.001;
    const t = Math.min(Math.max((p - k1.p) / segmentSpan, 0), 1);

    // Smooth Ease-In-Out
    const easeT = t * t * (3 - 2 * t);

    // Interpolate Position
    const responsiveFactor = this.width < 768 ? 0.35 : (this.width < 1024 ? 0.7 : 1.0);
    const targetX = THREE.MathUtils.lerp(k1.pos[0], k2.pos[0], easeT) * responsiveFactor;
    const targetY = THREE.MathUtils.lerp(k1.pos[1], k2.pos[1], easeT) + Math.sin(time * 1.5) * 0.03;
    const targetZ = THREE.MathUtils.lerp(k1.pos[2], k2.pos[2], easeT);

    // Interpolate Rotation + Add Mouse Parallax
    const targetRotX = THREE.MathUtils.lerp(k1.rot[0], k2.rot[0], easeT) + this.mouse.y;
    const targetRotY = THREE.MathUtils.lerp(k1.rot[1], k2.rot[1], easeT) + this.mouse.x;
    const targetRotZ = THREE.MathUtils.lerp(k1.rot[2], k2.rot[2], easeT);

    // Smoothly apply to Phone Group
    if (this.phoneGroup) {
      this.phoneGroup.position.x += (targetX - this.phoneGroup.position.x) * 0.06;
      this.phoneGroup.position.y += (targetY - this.phoneGroup.position.y) * 0.06;
      this.phoneGroup.position.z += (targetZ - this.phoneGroup.position.z) * 0.06;

      this.phoneGroup.rotation.x += (targetRotX - this.phoneGroup.rotation.x) * 0.06;
      this.phoneGroup.rotation.y += (targetRotY - this.phoneGroup.rotation.y) * 0.06;
      this.phoneGroup.rotation.z += (targetRotZ - this.phoneGroup.rotation.z) * 0.06;
    }

    // Move contact shadow with phone X & Z
    if (this.contactShadow && this.phoneGroup) {
      this.contactShadow.position.x = this.phoneGroup.position.x * 0.8;
      this.contactShadow.position.z = this.phoneGroup.position.z * 0.8;
    }

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    this.onScroll();
  }
}

window.Waqty3DScene = Waqty3DScene;
