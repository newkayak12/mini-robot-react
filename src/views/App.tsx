import React from 'react';
import '../assets/App.scss';
import RobotContainer from "./robot/RobotContainer";
function App() {
    return (
        <div className="App">
            <div className="app-header"></div>
            <div className="app-body">
              <RobotContainer/>
            </div>
            <div className="app-footer"></div>
        </div>
    );
}

export default App;
