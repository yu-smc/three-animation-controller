export class AnimationClock {
  constructor() {
    this.clock = new THREE.Clock();
    this.delta = null;
  }

  update() {
    this.delta = this.clock.getDelta();
  }
}
