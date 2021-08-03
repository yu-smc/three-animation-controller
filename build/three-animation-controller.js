class AnimationClock {
  constructor() {
    this.clock = new THREE.Clock();
    this.delta = null;
  }

  update() {
    this.delta = this.clock.getDelta();
  }
}

class AnimationController {
  constructor(model, clock, options) {
    this.object3D = model;
    this.animationMixer = this.initAnimationMixer();
    this.animationClock = clock;
    this.opts = options;
    this.clipsByOrder = this.initClips();
    this.currentAnimationId = null;
    this.currentAnimationStartTime = null;

    this.on = this.listenEvent;
    this.eventCallbacks = [];
  }

  listenEvent(eveName, callback) {
    this.eventCallbacks.push({
      eveName,
      callback,
    });
  }

  doEventCallbacks(eveName) {
    this.eventCallbacks
      .filter((cb) => cb.eveName === eveName)
      .forEach((data) => {
        data.callback();
      });
  }

  initAnimationMixer() {
    //仮実装
    if (this.object3D.scene) {
      return new THREE.AnimationMixer(this.object3D.scene);
    } else {
      return new THREE.AnimationMixer(this.object3D);
    }
  }

  initClips() {
    const clipSources = this.object3D.animations;
    return this.opts.animations.map((animData) => {
      return {
        clip: clipSources.find((clip) => clip.name === animData.name),
        loop: animData.loop || false,
        loopTimes: animData.loopTimes || 1,
        cutoff: animData.cutoff || 0,
      };
    });
  }

  playAnimation(id) {
    debugger;
    const clipData = this.clipsByOrder[id];
    const animation = this.animationMixer.clipAction(clipData.clip);

    if (!clipData.loop) {
      animation.setLoop(THREE.LoopOnce);
      animation.clampWhenFinished = true;
    }

    animation.play();
    this.currentAnimationId = id;
    this.currentAnimationStartTime = performance.now();
  }

  start() {
    this.playAnimation(0);
  }

  stop() {
    this.animationMixer.stopAllAction();
  }

  update() {
    const clipData = this.clipsByOrder[this.currentAnimationId];
    const pastTime = performance.now() - this.currentAnimationStartTime;

    if (
      clipData.clip.duration * 1000 * clipData.loopTimes - clipData.cutoff <=
      pastTime
    ) {
      //現在のアニメーションが終わった時の処理
      this.animationMixer.stopAllAction();

      const nextId = this.currentAnimationId + 1;
      if (this.clipsByOrder[nextId]) {
        this.playAnimation(nextId);
      } else {
        this.doEventCallbacks("finished-all");
      }
    }
    this.animationMixer.update(this.animationClock.delta);
  }
}

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
