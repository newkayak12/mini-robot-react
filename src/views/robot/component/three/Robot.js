import {init} from "./Loader";

const filePath = "/models/RobotExpressive.glb";
const loader = init()

const onProgress = (gtlf) => {}
const onError = (error) => console.error(error)
const generate = new  Promise((resolve, reject) => {
        loader.load(filePath,
                    (gltf) => {
                        resolve(gltf.scene)
                    },
                    onProgress,
                    onError
        )
    }
)
export const createRobot = async () => await generate
