import React, {memo, useMemo} from 'react';
import {ThreeSceneRobot} from "./component/ThreeSceneRobot"


export const RobotContainer =  memo(() => {
    return (
        <div className="robot-container">
            <ThreeSceneRobot/>
        </div>
    );
})



