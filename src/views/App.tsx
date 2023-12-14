import React, {memo} from 'react';
import '../assets/App.scss';
import {RobotContainer} from "./robot/RobotContainer";
export const App = memo(() => {
    return (
        <div className="App">
            <div className="app-header">
                <h1>Three JS - Robot</h1>
            </div>
            <div className="app-body">
              <RobotContainer/>
            </div>
            {/*<div className="app-footer"></div>*/}
        </div>

    );
})

