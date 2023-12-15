import * as THREE from "three";
let perspectiveCamera
let hemiLight
let dirLight
let grid
let scene


const initializePerspectiveCamera = (() => {
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100);
    camera.position.set(20, 30, 50)
    camera.lookAt(0, 0, 0)
    return camera
})
const initializeHemiLight = (() => {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
    hemiLight.position.set(0, 20, 0)

    return hemiLight;
})
const initializeDirLight = (() => {
    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(0, 20, 10)
    return dirLight
})
const initializeGrid = (() =>  {
    const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;

    return grid
})

const initializeScene = () => {
    if(!scene) scene = new THREE.Scene();
    if(!perspectiveCamera) {
        perspectiveCamera = initializePerspectiveCamera()
        scene.add(perspectiveCamera)
    }
    if(!hemiLight) {
        hemiLight = initializeHemiLight();
        scene.add(hemiLight)
    }
    if(!dirLight) {
        dirLight = initializeDirLight();
        scene.add(dirLight)
    }
    if(!grid) {
        grid = initializeGrid();
        scene.add(grid)
    }

    return scene;
}