import {init} from "./Loader";

const filePath = "./models/RobotExpressive.glb";
const loader = init()
let model = null;

const onLoad = (gltf) => {
  model = gltf.scene
}

const onProgress = (gtlf) => {

}
const onError = (error) => console.error(error)

export const initialize = () => {
 loader.load(filePath, onLoad, onProgress, onError )
  return model
}