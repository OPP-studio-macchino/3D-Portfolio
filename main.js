import './style.min.css'
import * as THREE from 'three';

// canvasタグの取得
const canvas = document.querySelector('.webgl');

// 必須の3要素
/////////////////////////////////////////////
// シーン
const scene = new THREE.Scene();

/////////////////////////////////////////////
// サイズ設定
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/////////////////////////////////////////////

// カメラ
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
scene.add(camera);
/////////////////////////////////////////////
// レンダラー
const renderer = new THREE.WebGLRenderer(
  {
    canvas: canvas,
    alpha: true,
  }
);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

/////////////////////////////////////////////
/**
* オブジェクトの作成
*/
// マテリアル
const material1 = new THREE.MeshPhongMaterial({
  color: '#FF72D0',
  emissive: '#990066',
}
);
const material2 = new THREE.MeshMatcapMaterial({
  color: '#FFFA0C',
  // emissive: '#FBB305',
}
);
const material3 = new THREE.MeshPhysicalMaterial({
  color: '#0CFF65',
  emissive: '#078C35',
}
);
const material4 = new THREE.MeshLambertMaterial({
  color: '#66ccff',
  emissive: '#478EB2',
}
);
// メッシュ
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material1);
const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(), material2);
const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material3);
const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(), material4);

// 回転用の配置
mesh1.position.set(2, 0, 0);
mesh2.position.set(-1, 0, 0);
mesh3.position.set(2, 0, -6);
mesh4.position.set(5, 0, 3);

scene.add(mesh1, mesh2, mesh3, mesh4);
const meshes = [mesh1, mesh2, mesh3, mesh4]

/////////////////////////////////////////////
/**
 * ライトを追加
 */
const directionalLight = new THREE.DirectionalLight(
  '#FFFAF2',
  1.8,
);
directionalLight.position.set(0.5, 1, 0)
scene.add(directionalLight)

// ブラウザのリサイズ操作
window.addEventListener('resize', () => {
  // サイズのアップデート
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // カメラのアップデート
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // レンダラーのアップデート
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});
/////////////////////////////////////////////
// ホイールの実装
let speed = 0;
let rotation = 0;
window.addEventListener('wheel', (e) => {
  speed += e.deltaY * 0.0002
  console.log(speed)
});

function rot() {
  rotation += speed;
  speed *= 0.93;

  // ジオメトリ全体を回転
  mesh1.position.x = 2 + 3.8 * Math.cos(rotation);
  mesh1.position.z = -3 + 3.8 * Math.sin(rotation);
  mesh2.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI / 2);
  mesh2.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI / 2);
  mesh3.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI);
  mesh3.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI);
  mesh4.position.x = 2 + 3.8 * Math.cos(rotation + 3 * (Math.PI / 2));
  mesh4.position.z = -3 + 3.8 * Math.sin(rotation + 3 * (Math.PI / 2));
  window.requestAnimationFrame(rot);
}

rot();

// カーソル位置を取得
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
})

/////////////////////////////////////////////
// アニメーション

const clock = new THREE.Clock();

const animate = () => {
  renderer.render(scene, camera);

  let getDeltaTime = clock.getDelta();

// メッシュを回転
  for (const mesh of meshes) {
      mesh.rotation.x += 0.1 * getDeltaTime;
      mesh.rotation.y += 0.12 * getDeltaTime;
  }

// カメラの制御
  camera.position.x += cursor.x * getDeltaTime * 2;
  camera.position.y += cursor.y * getDeltaTime * 3;

  window.requestAnimationFrame(animate);
};

animate();