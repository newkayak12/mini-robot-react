import * as THREE from "three";
let renderer

export const initializeRenderer = () => {
    if (!renderer) renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setSize(window.innerWidth, window.innerHeight)
    return renderer
}