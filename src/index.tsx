import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/index.scss';
import {App} from './views/App';
import 'bootstrap/dist/css/bootstrap.css'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <>
        <App />
    </>
);


// reportWebVitals();
