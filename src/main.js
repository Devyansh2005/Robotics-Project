import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// --- Scene Setup ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);
scene.fog = new THREE.Fog(0x050505, 20, 100);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 8, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 3, 0);
controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't allow camera to go far below ground

// --- Lighting & Environment ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

const pointLight = new THREE.PointLight(0x00e5ff, 2, 20);
pointLight.position.set(-5, 5, -5);
scene.add(pointLight);

// Floor grid and ground
const gridHelper = new THREE.GridHelper(20, 40, 0x00e5ff, 0x444444);
gridHelper.material.opacity = 0.2;
gridHelper.material.transparent = true;
scene.add(gridHelper);

const planeGeometry = new THREE.PlaneGeometry(50, 50);
const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x0a0a0a,
    roughness: 0.1,
    metalness: 0.8
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -0.01; // Slightly below grid
plane.receiveShadow = true;
scene.add(plane);

// --- Robot Construction (Forward Kinematics) ---
// Materials
const mainMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4, metalness: 0.3 });
const accentMaterial = new THREE.MeshStandardMaterial({ color: 0x00e5ff, roughness: 0.2, metalness: 0.8 });
const jointMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.5, metalness: 0.5 });

// Helper function to create a link
function createLink(radiusTop, radiusBottom, height, colorMat) {
    const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 32);
    geo.translate(0, height / 2, 0); // Move origin to base of cylinder
    const mesh = new THREE.Mesh(geo, colorMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}

// Helper to create a joint visual
function createJointVisual() {
    const geo = new THREE.SphereGeometry(0.6, 32, 32);
    const mesh = new THREE.Mesh(geo, jointMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}

// Thor Configuration: Yaw - Roll - Roll - Yaw - Roll - Yaw
// Let's build the hierarchy
const robotBase = new THREE.Group();
scene.add(robotBase);

// Base Pedestal (Static)
const pedestal = createLink(1.5, 2, 0.5, mainMaterial);
robotBase.add(pedestal);

// Joint 1: Base (Yaw - Y axis)
const joint1 = new THREE.Group();
joint1.position.y = 0.5;
robotBase.add(joint1);

const link1 = createLink(1.2, 1.2, 2, mainMaterial);
joint1.add(link1);

// Joint 2: Shoulder (Roll - X axis)
const joint2 = new THREE.Group();
joint2.position.y = 2; // top of link1
joint1.add(joint2);

const j2Visual = createJointVisual();
joint2.add(j2Visual);

const link2 = createLink(0.8, 0.8, 3.5, accentMaterial);
// By default, link grows along +Y. Let's tilt it slightly so it looks like an arm
joint2.add(link2);

// Joint 3: Elbow (Roll - X axis)
const joint3 = new THREE.Group();
joint3.position.y = 3.5; // top of link2
joint2.add(joint3);

const j3Visual = createJointVisual();
joint3.add(j3Visual);

const link3 = createLink(0.6, 0.6, 3, mainMaterial);
joint3.add(link3);

// Joint 4: Wrist 1 (Yaw - Y axis)
const joint4 = new THREE.Group();
joint4.position.y = 3; // top of link3
joint3.add(joint4);

const link4 = createLink(0.5, 0.5, 1.5, accentMaterial);
joint4.add(link4);

// Joint 5: Wrist 2 (Roll - X axis)
const joint5 = new THREE.Group();
joint5.position.y = 1.5; // top of link4
joint4.add(joint5);

const j5Visual = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), jointMaterial);
joint5.add(j5Visual);

const link5 = createLink(0.4, 0.4, 1, mainMaterial);
joint5.add(link5);

// Joint 6: Gripper Base (Yaw - Y axis)
const joint6 = new THREE.Group();
joint6.position.y = 1; // top of link5
joint5.add(joint6);

// Gripper base visual
const gripperBaseGeo = new THREE.BoxGeometry(1.2, 0.2, 0.8);
gripperBaseGeo.translate(0, 0.1, 0);
const gripperBase = new THREE.Mesh(gripperBaseGeo, accentMaterial);
gripperBase.castShadow = true;
joint6.add(gripperBase);

// Gripper fingers
const fingerGeo = new THREE.BoxGeometry(0.1, 0.8, 0.4);
fingerGeo.translate(0, 0.4, 0);
const finger1 = new THREE.Mesh(fingerGeo, jointMaterial);
finger1.position.set(-0.5, 0.2, 0);
const finger2 = new THREE.Mesh(fingerGeo, jointMaterial);
finger2.position.set(0.5, 0.2, 0);
joint6.add(finger1);
joint6.add(finger2);

// Keep references to joints for UI control
const joints = [joint1, joint2, joint3, joint4, joint5, joint6];
const axes = ['y', 'x', 'x', 'y', 'x', 'y']; // The axis of rotation for each joint

// --- UI Logic ---
const sliders = [];
const valDisplays = [];

for (let i = 1; i <= 6; i++) {
    const slider = document.getElementById(`joint${i}`);
    const display = document.getElementById(`val${i}`);
    
    sliders.push(slider);
    valDisplays.push(display);

    slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        display.innerText = `${val}°`;
        // Convert to radians and apply to the correct axis
        joints[i - 1].rotation[axes[i - 1]] = THREE.MathUtils.degToRad(val);
    });
}

document.getElementById('reset-btn').addEventListener('click', () => {
    sliders.forEach((slider, index) => {
        slider.value = 0;
        valDisplays[index].innerText = `0°`;
        joints[index].rotation[axes[index]] = 0;
    });
});

// Initial posture tweak for better visualization out of the box
sliders[1].value = 30; // Shoulder
sliders[1].dispatchEvent(new Event('input'));
sliders[2].value = -60; // Elbow
sliders[2].dispatchEvent(new Event('input'));
sliders[4].value = -30; // Wrist
sliders[4].dispatchEvent(new Event('input'));


// --- Window Resize Handling ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
