import {init} from "./Loader";
import { GUI } from 'three/addons/libs/lil-gui.module.min';
import {states, emotes} from './RobotStatus'
import * as THREE from 'three';

const api = {state: "Walking"};
const gui = new GUI()
const filePath = "/models/RobotExpressive.glb";
const loader = init()
const actions = []
const onProgress = (gtlf) => {}
const onError = (error) => console.error(error)
let face;

const generate = (scene) => new  Promise((resolve, reject) => {
        loader.load(filePath,
                    (gltf) => {
                        const model = gltf.scene
                        scene.add(model)
                        const action = addStatusAndEmotions(model, gltf.animations)
                        resolve({ robot: model, action: action })
                    },
                    onProgress,
                    onError
        )
    })
const addStatusAndEmotions = (model, animations) => {
  const mixer = new THREE.AnimationMixer(model);


  for (let i = 0; i < animations.length; i++) {
    const clip = animations[i];
    const action = mixer.clipAction(clip);
    actions[clip.name] = action;

    if (Object.values(emotes).indexOf(clip.name) >= 0 ||
        Object.values(states).indexOf(clip.name) >= 4) {
      action.clampWhenFinished = true;
      action.loop = THREE.LoopOnce;
    }
  }

// states
  fadeToAction('Walking', '', 0.1)


  const play = actions[states.Walking].play()
  console.log(play);
  return states.Walking;
};
export const fadeToAction = (nextActionName, prevAction, duration) => {
  const nextAction = actions[nextActionName];

  if (!!prevAction && nextAction !== prevAction) {
    prevAction.fadeOut(duration);
  }

  nextAction.reset()
            .setEffectiveTimeScale(1)
            .setEffectiveWeight(1)
            .fadeIn(duration)
            .play();
}
export const createRobotAndPlaceAt = async (scene) => await generate(scene)
