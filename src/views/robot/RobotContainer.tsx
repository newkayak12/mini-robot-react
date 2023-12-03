import React, { useEffect, useRef } from 'react';
import './RobotContainer.scss';
// import ThreeScene from "./ThreeScene";
import ThreeSceneRobot from "./ThreeSceneRobot"
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';


function App() {
    return (
        <div className="robot-container">
            {/*<ThreeScene/>*/}
            <ThreeSceneRobot/>
        </div>
    );
}



export default App;
