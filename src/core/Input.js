import * as BABYLON from '@babylonjs/core';

/**
 * Input management system - handles keyboard input
 * NOTE: Mouse input handled by ArcRotateCamera.attachControl()
 */
export class Input {
  constructor(scene) {
    this.scene = scene;
    this.keys = {};

    this.init();
  }

  init() {
    // Keyboard input
    this.scene.actionManager = new BABYLON.ActionManager(this.scene);

    window.addEventListener('keydown', (evt) => {
      // Use both evt.key and evt.code for better compatibility
      this.keys[evt.key.toLowerCase()] = true;
      this.keys[evt.code.toLowerCase()] = true;
    });

    window.addEventListener('keyup', (evt) => {
      this.keys[evt.key.toLowerCase()] = false;
      this.keys[evt.code.toLowerCase()] = false;
    });
  }

  isKeyPressed(key) {
    return this.keys[key.toLowerCase()] || false;
  }
}
