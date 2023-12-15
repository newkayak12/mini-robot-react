import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let loader = null
export const init = () => {
    if( !loader ) loader = new GLTFLoader();

    return loader
}
