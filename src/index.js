import { AnimationClock } from "./animation-clock.js";
import { AnimationController } from "./animation-controller.js";

const init = () => {
  if (!THREE) {
    console.error(
      "THREE is not defined. You need to load three.js or aframe.js in order to use this library."
    );
    return;
  }

  window.AnimationClock = AnimationClock;
  window.AnimationController = AnimationController;
};

init();
