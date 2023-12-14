import React, {useEffect, useRef} from 'react';
import * as THREE from 'three';
// @ts-ignore
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
// @ts-ignore
import Stats from 'three/addons/libs/stats.module.js';
// @ts-ignore
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

const ThreeScene = () => {
    let container = useRef<HTMLDivElement>(null);
    let stats = useRef<Stats>();
    let clock = useRef(new THREE.Clock());
    let mixer = useRef<THREE.AnimationMixer>();
    let actions = useRef<Record<string, THREE.AnimationAction>>({});
    let activeAction = useRef<THREE.AnimationAction>();
    let previousAction = useRef<THREE.AnimationAction>();
    let camera = useRef<THREE.PerspectiveCamera>();
    let scene = useRef<THREE.Scene>();
    let renderer = useRef<THREE.WebGLRenderer>();
    let model = useRef<THREE.Object3D>();
    let face = useRef<THREE.Object3D>();

    const api = {state: 'Walking'};

    useEffect(() => {
        fnInit();
        fnAnimate();
    }, []); // Passing an empty dependency array

    const fnInit = () => {
        if (!container.current) return;
        // @ts-ignore
        container.current = document.createElement('div');
        document.body.appendChild(container.current);

        camera.current = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100);
        camera.current.position.set(-5, 3, 10);
        camera.current.lookAt(0, 2, 0);
        scene.current = new THREE.Scene();
        scene.current.background = new THREE.Color(0xe0e0e0);
        scene.current.fog = new THREE.Fog(0xe0e0e0, 20, 100);

        clock.current = new THREE.Clock();


        // lights
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
        hemiLight.position.set(0, 20, 0);
        scene.current.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 3);
        dirLight.position.set(0, 20, 10);
        scene.current.add(dirLight);

        // ground
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2000, 2000),
            new THREE.MeshPhongMaterial({color: 0xcbcbcb, depthWrite: false})
        );
        mesh.rotation.x = -Math.PI / 2;
        scene.current.add(mesh);

        const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        scene.current.add(grid);

        const loader = new GLTFLoader();
        loader.load(
            '../../assets/models/RobotExpressive.glb',
            function (gltf: any) {
                model.current = gltf.scene;
                // @ts-ignore
                scene?.current?.add(model.current);

                // Call createGUI here if needed
            },
            undefined,
            function (e: any) {
                console.error(e);
            }
        );
        renderer.current = new THREE.WebGLRenderer({antialias: true});
        renderer.current.setPixelRatio(window.devicePixelRatio);
        renderer.current.setSize(window.innerWidth, window.innerHeight);
        container.current.appendChild(renderer.current.domElement);

        window.addEventListener('resize', onWindowResize);

        // stats
        stats.current = new Stats();
        container.current.appendChild(stats.current.dom);

    }

    const onWindowResize = () => {
        if (!camera.current || !renderer.current) return;

        camera.current.aspect = window.innerWidth / window.innerHeight;
        camera.current.updateProjectionMatrix();

        renderer.current.setSize(window.innerWidth, window.innerHeight);
    };


    const fnAnimate = () => {
        console.log("Animated@@@@@@")
    }


    return <div ref={container}/>;
}


export default ThreeScene;
