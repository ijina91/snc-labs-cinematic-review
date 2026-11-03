import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';

// Original SNC geometry. No reference-video models, textures or media are shipped.
export function createJourneyScene(canvas, onContextLost) {
  const mobile = () => innerWidth <= 900;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  try {
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xd9eaff, 17, 29);
  const environmentScene = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(environmentScene, .04, .1, 100);
  scene.environment = environment.texture;
  scene.environmentIntensity = .8;
  environmentScene.dispose(); pmrem.dispose();
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
  const geometries = new Set(), materials = new Set();
  const geo = geometry => { geometries.add(geometry); return geometry; };
  const mat = material => { materials.add(material); return material; };
  const blue = mat(new THREE.MeshStandardMaterial({ color: 0x216be4, metalness: .48, roughness: .24 }));
  const sky = mat(new THREE.MeshStandardMaterial({ color: 0x36a4ed, metalness: .32, roughness: .2 }));
  const navy = mat(new THREE.MeshStandardMaterial({ color: 0x21386d, metalness: .5, roughness: .24 }));
  const ice = mat(new THREE.MeshStandardMaterial({ color: 0xd5ebff, metalness: .35, roughness: .18 }));
  const box = geo(new RoundedBoxGeometry(1, 1, 1, 2, .035));
  scene.add(new THREE.HemisphereLight(0xf4fbff, 0x21386d, 2.5));
  const key = new THREE.DirectionalLight(0xffffff, 4.2); key.position.set(-5, 9, 7); scene.add(key);
  const rim = new THREE.DirectionalLight(0x75beff, 4); rim.position.set(7, 2, -10); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffffff, 1.8); fill.position.set(-8, -1, -5); scene.add(fill);
  const groups = Array.from({ length: 6 }, (_, i) => { const group = new THREE.Group(); group.position.z = -i * 14; scene.add(group); return group; });
  function block(group, material, x, y, z, sx, sy, sz) {
    const mesh = new THREE.Mesh(box, material); mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz); group.add(mesh);
    return mesh;
  }
  function check(group, scale = 1) {
    const shape = new THREE.Shape();
    shape.moveTo(-1.9, -.05); shape.lineTo(-1.44, .42); shape.lineTo(-.55, -.4);
    shape.lineTo(1.48, 1.68); shape.lineTo(1.95, 1.2); shape.lineTo(-.55, -1.38); shape.closePath();
    const mesh = new THREE.Mesh(geo(new THREE.ExtrudeGeometry(shape, { depth: .25, bevelEnabled: true, bevelSize: .065, bevelThickness: .065, bevelSegments: 4, steps: 1 })), [blue, navy]);
    mesh.scale.setScalar(scale); mesh.position.set(0, -.1, .2); group.add(mesh);
  }
  // Smooth elliptical cross-sections follow parallel-transport frames. No tiled
  // ring edges or coplanar outlines: the highlight stays continuous at large sizes.
  function ribbon(group, points, material, width = .28, depth = .075, closed = false) {
    const knots = points.map(p => new THREE.Vector3(...p));
    if (closed && knots[0].distanceToSquared(knots.at(-1)) < 1e-10) knots.pop();
    const curve = new THREE.CatmullRomCurve3(knots, closed, 'centripetal');
    const segments = 220, sides = 16, frames = curve.computeFrenetFrames(segments, closed);
    const positions = [], indices = [];
    for (let i = 0; i <= segments; i++) {
      const u = i / segments, center = curve.getPointAt(u);
      const twist = u * (closed ? Math.PI * 2 : Math.PI * .8);
      const normal = frames.normals[i].clone().multiplyScalar(Math.cos(twist)).addScaledVector(frames.binormals[i], Math.sin(twist));
      const binormal = frames.binormals[i].clone().multiplyScalar(Math.cos(twist)).addScaledVector(frames.normals[i], -Math.sin(twist));
      const taper = closed ? 1 : .68 + .32 * Math.sin(u * Math.PI);
      for (let j = 0; j <= sides; j++) {
        const angle = j / sides * Math.PI * 2;
        const vertex = center.clone().addScaledVector(normal, Math.cos(angle) * width * taper).addScaledVector(binormal, Math.sin(angle) * depth);
        positions.push(vertex.x, vertex.y, vertex.z);
        if (i < segments && j < sides) { const a = i * (sides + 1) + j, b = a + sides + 1; indices.push(a, b, a + 1, b, b + 1, a + 1); }
      }
    }
    const geometry = geo(new THREE.BufferGeometry());
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setIndex(indices); geometry.computeVertexNormals();
    const normals = geometry.attributes.normal;
    function joinNormals(a, b) {
      const normal = new THREE.Vector3().fromBufferAttribute(normals, a).add(new THREE.Vector3().fromBufferAttribute(normals, b)).normalize();
      normals.setXYZ(a, normal.x, normal.y, normal.z); normals.setXYZ(b, normal.x, normal.y, normal.z);
    }
    for (let i = 0; i <= segments; i++) joinNormals(i * (sides + 1), i * (sides + 1) + sides);
    if (closed) for (let j = 0; j <= sides; j++) joinNormals(j, segments * (sides + 1) + j);
    const mesh = new THREE.Mesh(geometry, material); group.add(mesh); return { mesh, curve };
  }
  function signature(group, radius) {
    const points = Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return [Math.cos(a) * radius, Math.sin(a) * radius * 1.02, Math.sin(a * 2) * .22]; });
    ribbon(group, points, blue, .15, .1, true);
    const accent = new THREE.Mesh(geo(new THREE.TorusGeometry(radius + .24, .045, 16, 240)), sky);
    accent.rotation.set(.08, -.18, .05); group.add(accent);
  }
  check(groups[0], .92); signature(groups[0], 2.7);
  // ESH: an asymmetric protective envelope, with modules following its curvature.
  const protection = ribbon(groups[1], [[-2.9,-1.8,.2],[-2.7,.8,-.4],[-1.2,2.8,-.5],[1.3,2.5,.6],[2.8,.8,.3],[2.1,-2,-.5]], blue, .44, .13);
  ribbon(groups[1], [[-2.2,-2.3,-.6],[-.2,-2.8,.3],[2.6,-1.2,1],[3,1,-.2],[1.3,2.9,-.8]], sky, .22, .09);
  for (let i = 0; i < 15; i++) {
    const u = (i + .25) / 15, point = protection.curve.getPointAt(u), tangent = protection.curve.getTangentAt(u);
    const mesh = block(groups[1], i % 4 === 0 ? ice : i % 2 ? sky : navy, point.x, point.y, point.z + .45 + Math.sin(i * 1.7) * .2, .25 + (i % 3) * .12, .48 + Math.sin(i * 1.3) * .19, .22);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), tangent); mesh.rotateY(Math.sin(i * 2.1) * .45);
  }
  check(groups[1], .55);
  // SAP: three interwoven business/data streams around a faceted system core.
  const core = new THREE.Mesh(geo(new THREE.IcosahedronGeometry(1.05, 0)), navy); core.rotation.set(.35,.45,.2); groups[2].add(core);
  const streams = [
    [[-3,-1.7,.1],[-2.3,1.4,.3],[-.1,2.5,-.3],[2.8,1.1,.4],[1.9,-1.8,1],[-.6,-2.3,.3]],
    [[-2.7,1.7,-.6],[-.9,-1.3,1],[1,-2.2,.2],[2.7,.4,-.7],[.9,2.7,.5],[-1.1,1.3,1.1]],
    [[-2.6,-.4,1.1],[-1.2,2.2,-.9],[1.2,1.6,-1],[2.8,-1,.3],[.1,-2.5,.9],[-1.9,-1.3,-.5]],
  ];
  streams.forEach((points, i) => {
    const flow = ribbon(groups[2], points, [blue,sky,ice][i], .27, .085);
    for (const u of [.12,.54,.9]) { const p = flow.curve.getPointAt(u); const node = block(groups[2], [sky,ice,blue][i],p.x,p.y,p.z,.42,.42,.42); node.rotation.set(u, i * .7, u * 2); }
  });
  // Web: curved interface fragments at distinct depths, threaded by one flow.
  function interfaceFragment(group, width, height, material, x, y, z, rotation) {
    const panel = new THREE.Group(); panel.position.set(x,y,z); panel.rotation.set(...rotation);
    const shape = new THREE.Shape(), r = .16, w = width / 2, h = height / 2;
    shape.moveTo(-w+r,-h); shape.lineTo(w-r,-h); shape.quadraticCurveTo(w,-h,w,-h+r); shape.lineTo(w,h-r); shape.quadraticCurveTo(w,h,w-r,h); shape.lineTo(-w+r,h); shape.quadraticCurveTo(-w,h,-w,h-r); shape.lineTo(-w,-h+r); shape.quadraticCurveTo(-w,-h,-w+r,-h);
    const bend = x => .3 * (1 - Math.cos(x / width * Math.PI));
    const geometry = geo(new ParametricGeometry((u,v,target) => {
      const y = (v - .5) * height, corner = Math.max(0, Math.abs(y) - h + r);
      const halfWidth = corner > 0 ? w - r + Math.sqrt(Math.max(0, r * r - corner * corner)) : w;
      const x = (u - .5) * halfWidth * 2; target.set(x, y, bend(x));
    }, 32, 20));
    const face = mat(material.clone()); face.side = THREE.DoubleSide;
    panel.add(new THREE.Mesh(geometry, face));
    ribbon(panel, shape.getPoints(32).map(p => [p.x,p.y,bend(p.x)+.015]), navy, .025, .025, true);
    for(let row=0;row<3;row++) {
      const length=width*(.52-row*.1), x=-width*.1, y=height*.22-row*height*.24;
      ribbon(panel,[[x-length/2,y,bend(x-length/2)+.045],[x,y,bend(x)+.045],[x+length/2,y,bend(x+length/2)+.045]],ice,.025,.018);
    }
    group.add(panel);
  }
  interfaceFragment(groups[3],2.8,1.9,blue,-.6,-.5,1.2,[.08,-.28,-.14]);
  interfaceFragment(groups[3],2.1,1.4,sky,1.9,1.6,-.2,[-.25,.35,.3]);
  interfaceFragment(groups[3],1.8,1.2,navy,-2.1,1.5,-.7,[.2,-.45,-.3]);
  interfaceFragment(groups[3],1.6,1.05,sky,2.2,-1.5,-.3,[.35,.2,-.22]);
  interfaceFragment(groups[3],1.2,.8,ice,-1.9,-1.9,-.2,[-.18,.4,.18]);
  ribbon(groups[3],[[-3,-1.9,-.7],[-1.4,-2.4,.2],[1.4,-1.1,.4],[2.8,1.3,-.9],[.6,2.8,-.6],[-2.7,1.8,.2]],blue,.12,.07);
  // Connection: three distinct paths gather around the SNC check.
  check(groups[4], .7);
  streams.forEach((points,i)=>ribbon(groups[4],points,[blue,sky,ice][i],.14,.075));
  check(groups[5], 1.1); signature(groups[5], 3.0);
  const floor = new THREE.GridHelper(100, 50, 0x6b9bdc, 0x8eb2e4); floor.position.set(0, -3.4, -32);
  floor.material.transparent = true; floor.material.opacity = .18; floor.material.depthWrite = false;
  geometries.add(floor.geometry); materials.add(floor.material); scene.add(floor);
  const background = [0xf1f7ff, 0xc7e2ff, 0x142a50, 0xe9f4ff, 0x142a50, 0xe7f1ff].map(color => new THREE.Color(color));
  const cameraX = [3.8, 1.8, 3.5, 2.8, 3.2, 3.8];
  let disposed = false;
  const lost = event => { event.preventDefault(); if (!disposed) onContextLost(); };
  canvas.addEventListener('webglcontextlost', lost);
  function resize() {
    const width = canvas.parentElement.clientWidth, height = canvas.parentElement.clientHeight;
    const wanted = Math.min(Math.max(devicePixelRatio || 1, 1.5), mobile() ? 1.75 : 2);
    renderer.setPixelRatio(Math.max(1, Math.min(wanted, Math.sqrt(3000000 / Math.max(1, width * height)))));
    renderer.setSize(width, height, false); camera.aspect = width / Math.max(1, height);
    camera.fov = mobile() ? 48 : 38; camera.filmOffset = mobile() ? 0 : -8; camera.updateProjectionMatrix();
  }
  resize();
  return {
    resize,
    render(position) {
      if (disposed) return;
      const index = Math.min(4, Math.floor(position)), fraction = Math.min(1, position - index);
      const phone = mobile();
      camera.position.set(THREE.MathUtils.lerp(cameraX[index], cameraX[index + 1], fraction) * (phone ? .45 : 1), 1.2, 12 + (phone ? 5 : 0) - position * 14);
      camera.lookAt(0, phone ? -1.7 : 0, -position * 14);
      scene.fog.color.copy(background[index]).lerp(background[index + 1], fraction);
      groups.forEach((group, i) => {
        group.visible = Math.abs(i - position) < 1.6 && (!phone || i > position - .62);
        group.rotation.y = Math.sin(position * .7 + i) * .13;
      });
      renderer.render(scene, camera);
    },
    dispose() {
      if (disposed) return;
      disposed = true; canvas.removeEventListener('webglcontextlost', lost);
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
      environment.dispose();
      renderer.renderLists.dispose(); renderer.dispose(); renderer.forceContextLoss();
    },
  };
  } catch (error) {
    renderer.dispose(); renderer.forceContextLoss(); throw error;
  }
}
