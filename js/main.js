import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

document.addEventListener('DOMContentLoaded', function () {
  const spinner = document.getElementById('spinner');
  const content = document.getElementById('content');

  // Имитация загрузки (в реальном проекте удалите setTimeout)
  setTimeout(function () {
    // Скрываем спиннер
    spinner.style.opacity = '0';

    // Показываем контент
    content.classList.add('show');

    // Удаляем спиннер из DOM после анимации
    setTimeout(function () {
      spinner.style.display = 'none';
    }, 500); // Должно совпадать с длительностью transition
  }, 2000); // В реальном проекте замените на обработчик полной загрузки страницы
});


window.addEventListener('load', function () {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let object;

  let controls;

  let objToRender = 'eye';

  const loader = new GLTFLoader();

  loader.load(
    `./models/${objToRender}/scene.gltf`,
    function (gltf) {
      object = gltf.scene;
      scene.add(object);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error(error);
    }
  );

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.getElementById("container3D").appendChild(renderer.domElement);

  camera.position.z = objToRender === "dino" ? 25 : 500;

  const topLight = new THREE.DirectionalLight(0xffffff, 1);
  topLight.position.set(500, 500, 500)
  topLight.castShadow = true;
  scene.add(topLight);

  const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "dino" ? 5 : 1);
  scene.add(ambientLight);

  if (objToRender === "dino") {
    controls = new OrbitControls(camera, renderer.domElement);
  }

  function animate() {
    requestAnimationFrame(animate);

    if (object && objToRender === "eye") {
      object.rotation.y = -3 + mouseX / window.innerWidth * 3;
      object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
    }
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  document.onmousemove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }
  window.addEventListener('wheel', (event) => {
    event.preventDefault();
    if (event.deltaY < 0 && camera.position.z <= 1000) {
      camera.position.z += 10
    } else if (event.deltaY > 0 && camera.position.z >= 180) {
      camera.position.z -= 10;

    }
  });
  let isMouseDown = false;
  let previousMousePosition = { x: 0, y: 0 };
  window.addEventListener('mousedown', (event) => {
    if (event.button === 0) { // Левая кнопка мыши
      isMouseDown = true;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    }
  });


  window.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      scene.rotation.y += deltaMove.x * 0.01;
      scene.rotation.x += deltaMove.y * 0.01;

      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    }
  });
  window.addEventListener('mouseup', () => {
    isMouseDown = false;
  });

  animate();
});