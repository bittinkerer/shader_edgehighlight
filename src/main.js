import { vertexShader } from "./shaders/vertexShader";
import { fragmentShader } from "./shaders/fragmentShader";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

window.addEventListener('load', init);

let scene
let camera
let renderer
let sceneObjects = []
let gltfLoader
let material
let rotate = false

const params = {
    meshColor: '#6495ED',
    ambientLight: '#cccccc',
    uSize: new THREE.Vector3(2,3,3),
    uBottomShadowMag : 0.45 
}

const uniforms = {
    uColor: {type: 'vec3', value: new THREE.Color(params.color)},
    uBottomShadowMag: {value: params.uBottomShadowMag},
    uSize: {type: 'vec3', value: params.uSize},
}

function init() {
    // ..
    gltfLoader = new GLTFLoader();

    // ..
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);

    // ..
    camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    camera.position.z = 5;    

    // ..
    setupRenderer();

    // ...
    const controls = new OrbitControls( camera, renderer.domElement );

    // ..
    setupLighting();
    material = getMaterial();
    addMesh(
        new THREE.BoxGeometry(params.uSize.x, params.uSize.y, params.uSize.z),       
        material,   
        new THREE.Vector3(0,0,0), 
        true);
    update();
}

function setupRenderer() {
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( Math.min (window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.CineonToneMapping;
    renderer.toneMappingExposure = 1.75;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true;
    document.body.appendChild( renderer.domElement );
}

function setupLighting() {
    // dir light
    let directionalLight0 = new THREE.DirectionalLight(0xdddddd, 0.75);
    directionalLight0.castShadow = true;
    directionalLight0.shadow.mapSize.width = 4096;
    directionalLight0.shadow.mapSize.height = 4096;
    directionalLight0.shadow.camera.near = 2;
    directionalLight0.shadow.camera.far = 15;
    scene.add(directionalLight0);
    THREE.UniformsLib.lights.directionalLights.value.push(directionalLight0);

    // ambient light
    let ambientLight = new THREE.AmbientLight(params.ambientLight, 1);
    scene.add(ambientLight);
}

function update() {
    renderer.render( scene, camera );
    // rotate?
    if(rotate) {
        for(let object of sceneObjects) {
            object.rotation.x += 0.01;
            object.rotation.y += 0.03;
        }
    }
    requestAnimationFrame( update );
}

function addMesh(geometry, material, position, castShadows = null) {
    let mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = castShadows;
    mesh.position.x = position.x;
    mesh.position.y = position.y;
    mesh.position.z = position.z;
    scene.add(mesh);
    sceneObjects.push(mesh);
    return mesh;
}

function getMaterial() {
    let material = new THREE.ShaderMaterial({
        lights: true,
        uniforms: { ...THREE.UniformsLib.lights, ...uniforms },
        fragmentShader: fragmentShader(),
        vertexShader: vertexShader(),
    });
    return material;
}


