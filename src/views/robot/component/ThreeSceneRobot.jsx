import React, {memo, useEffect, useRef, useState} from "react";
import {perspectiveCamera, initializeScene} from "./three/Scene";
import {createRobot} from "./three/Robot";
import {initializeRenderer} from "./three/Renderer";
import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";

export const ThreeSceneRobot = memo(() => {
    let container = useRef(null);
    let gui = useRef(null);
    let camera = useRef(null);
    let scene = useRef(null);
    let renderer = useRef(null);
    let model = useRef([]);
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
        initialize();
        animate();
        document.addEventListener("click", onMouseClick);

        return () => {
            if (container.current) {
                container.current.removeChild(renderer.current.domElement);
            }
        };
    }, []);
    useEffect(() => {
        // if (model.current) {
        //     model.current.position.set(modelPosition.x, modelPosition.y, modelPosition.z);
        // }
    }, [modelPosition]);



    const initialize =  async () => {
        container.current = document.getElementById("robot-canvas");
        scene.current = initializeScene()
        camera.current = perspectiveCamera
        clock.current = new THREE.Clock();

        await addRobot()


        renderer.current = initializeRenderer()
        window.addEventListener("resize", onWindowResize);
        container.current.appendChild(renderer.current.domElement);





        // stats
        stats.current = new Stats();
        container.current.appendChild(stats.current.dom);
    };
    const addRobot = async () => {
        const modelTmp = await createRobot()
        model.current = [...model.current, modelTmp]
        scene.current.add(modelTmp)

    }
    const onWindowResize = () => {
        camera.current.aspect = window.innerWidth / window.innerHeight;
        camera.current.updateProjectionMatrix();

        if (renderer.current) renderer.current.setSize(window.innerWidth, window.innerHeight);

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

    return(
        <>
             <div id={"robot-canvas"}></div>
        </>
    )
});


