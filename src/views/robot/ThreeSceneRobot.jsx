import React, { useEffect, useRef, useState } from "react";

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";

const ThreeSceneRobot = () => {
    let container = useRef(null);
    let gui = useRef(null);
    let camera = useRef(null);
    let scene = useRef(null);
    let renderer = useRef(null);
    let model = useRef(null);
    let face = useRef(null);
    let mixer = useRef(null);
    let actions = useRef({});
    let activeAction = useRef(null);
    let previousAction = useRef(null);
    let stats = useRef(null);
    let clock = useRef(new THREE.Clock());
    const api = {state: "Walking"};
    const [ modelPosition, setModelPosition ] = useState({x: 0, y: 0, z: 0});

    useEffect(() => {
        init();
        animate();
        document.addEventListener("click", onMouseClick);

        return () => {
            if (container.current) {
                container.current.removeChild(renderer.current.domElement);
            }
        };
    }, []);

    useEffect(() => {
        if (model.current) {
            model.current.position.set(modelPosition.x, modelPosition.y, modelPosition.z);
        }
    }, [modelPosition]);


    const init = () => {
        container.current = document.createElement("div");
        document.body.appendChild(container.current);



        camera.current = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100);
        camera.current.position.set(20, 30, 50); // 일단 냅두기?
        // camera.current.lookAt(0, 2, 20);
        camera.current.lookAt(0, 0, 0);

        scene.current = new THREE.Scene();
        scene.current.background = new THREE.Color(0xe0e0e0);
        // scene.current.fog = new THREE.Fog(0xe0e0e0, 20, 100);

        clock.current = new THREE.Clock();

        // lights
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
        hemiLight.position.set(0, 20, 0);
        scene.current.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 3);
        dirLight.position.set(0, 20, 10);
        scene.current.add(dirLight);

        // const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({
        //     color: 0xcbcbcb, depthWrite: false,
        // }));
        // mesh.rotation.x = -Math.PI / 2;
        // scene.current.add(mesh);

        const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        scene.current.add(grid);

        const loader = new GLTFLoader();
        const filePath = "/models/RobotExpressive.glb";
        loader.load(filePath, function (gltf) {
            model.current = gltf.scene;
            scene.current.add(model.current);

            createGUI(model.current, gltf.animations);
            if (model.current) {
                model.current.position.set(modelPosition.x, modelPosition.y, modelPosition.z);
            }

        }, undefined, function (e) {
            console.error(e);

        });

        renderer.current = new THREE.WebGLRenderer({antialias: true});
        // renderer.current.setPixelRatio(window.devicePixelRatio);
        renderer.current.setSize(window.innerWidth, window.innerHeight);
        container.current.appendChild(renderer.current.domElement);



        window.addEventListener("resize", onWindowResize);

        // stats
        stats.current = new Stats();
        container.current.appendChild(stats.current.dom);
    };
    const createGUI = (model, animations) => {
        const states = [ "Idle", "Walking", "Running", "Dance", "Death", "Sitting", "Standing" ];
        const emotes = [ "Jump", "Yes", "No", "Wave", "Punch", "ThumbsUp" ];

        gui.current = new GUI();


        mixer.current = new THREE.AnimationMixer(model);

        actions.current = {};

        for (let i = 0; i < animations.length; i++) {
            const clip = animations[i];
            const action = mixer.current.clipAction(clip);
            actions.current[clip.name] = action;

            if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
            }
        }

        // states

        const statesFolder = gui.current.addFolder("States");

        const clipCtrl = statesFolder.add(api, "state").options(states);

        clipCtrl.onChange(() => {
            fadeToAction(api.state, 0.5);
        });

        statesFolder.open();

        // emotes

        const emoteFolder = gui.current.addFolder("Emotes");

        function createEmoteCallback(name) {
            api[name] = () => {
                fadeToAction(name, 0.2);
                mixer.current.addEventListener("finished", restoreState);
            };

            emoteFolder.add(api, name);
        }

        function restoreState() {
            mixer.current.removeEventListener("finished", restoreState);
            fadeToAction(api.state, 0.2);
        }

        for (let i = 0; i < emotes.length; i++) {
            createEmoteCallback(emotes[i]);
        }

        emoteFolder.open();

        // expressions
        face.current = model.getObjectByName("Head_4");

        const expressions = Object.keys(face.current.morphTargetDictionary);
        const expressionFolder = gui.current.addFolder("Expressions");

        for (let i = 0; i < expressions.length; i++) {
            expressionFolder.add(face.current.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i]);
        }

        activeAction.current = actions.current["Walking"];
        activeAction.current.play();

        expressionFolder.open();
    };


    const fadeToAction = (name, duration) => {
        previousAction.current = activeAction.current;
        activeAction.current = actions.current[name];

        if (previousAction.current !== activeAction.current) {
            previousAction.current.fadeOut(duration);
        }

        activeAction.current.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(duration).play();
    };


    const onWindowResize = () => {
        camera.current.aspect = window.innerWidth / window.innerHeight;
        camera.current.updateProjectionMatrix();

        if (renderer.current) renderer.current.setSize(window.innerWidth, window.innerHeight);

    };

    const animate = () => {
        const dt = clock.current.getDelta();

        if (mixer.current) mixer.current.update(dt);

        requestAnimationFrame(animate);

        if (renderer.current) renderer.current.render(scene.current, camera.current);

        if (stats.current) stats.current.update();
    };


    const onMouseClick = (event) => {
        setModelPosition((prevPosition) => ({
            x: prevPosition.x, // Adjust the position change as needed
            y: prevPosition.y,
            z: prevPosition.z + 5,
        }));
        console.log("Clicked:: ", modelPosition)
        // scene.current.add(model.current);
        // renderer.current.render(scene.current, camera.current);
    };

    return <></>;

};


export default ThreeSceneRobot;
