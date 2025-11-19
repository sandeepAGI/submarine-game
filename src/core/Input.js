import * as BABYLON from '@babylonjs/core';

/**
 * Input management system - handles keyboard and mouse input
 */
export class Input {
  constructor(scene) {
    this.scene = scene;
    this.keys = {};
    this.mouseMovement = { x: 0, y: 0 };
    this.pointerLocked = false;

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

    // Mouse movement for camera
    this.setupPointerLock();
  }

  setupPointerLock() {
    const canvas = this.scene.getEngine().getRenderingCanvas();

    // Request pointer lock on canvas click
    canvas.addEventListener('click', () => {
      if (!this.pointerLocked) {
        canvas.requestPointerLock();
      }
    });

    // Handle pointer lock change
    document.addEventListener('pointerlockchange', () => {
      this.pointerLocked = document.pointerLockElement === canvas;
    });

    // Track mouse movement when locked
    canvas.addEventListener('mousemove', (evt) => {
      if (this.pointerLocked) {
        this.mouseMovement.x = evt.movementX || 0;
        this.mouseMovement.y = evt.movementY || 0;
      }
    });
  }

  isKeyPressed(key) {
    return this.keys[key.toLowerCase()] || false;
  }

  getMouseMovement() {
    const movement = { ...this.mouseMovement };
    // Reset after reading
    this.mouseMovement.x = 0;
    this.mouseMovement.y = 0;
    return movement;
  }

  resetMouseMovement() {
    this.mouseMovement.x = 0;
    this.mouseMovement.y = 0;
  }
}
