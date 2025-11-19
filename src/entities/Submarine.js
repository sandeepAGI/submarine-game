import * as BABYLON from '@babylonjs/core';
import { GAME_CONFIG, INITIAL_STATE } from '../data/config.js';

/**
 * Submarine entity - the player's vessel
 */
export class Submarine {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.mesh = null;
    this.position = new BABYLON.Vector3(0, -1, 0); // Start at surface
    this.rotation = new BABYLON.Vector3(0, 0, 0);

    // Submarine state
    this.oxygen = INITIAL_STATE.oxygen;
    this.maxOxygen = INITIAL_STATE.maxOxygen;
    this.depth = 0;
    this.moveSpeed = INITIAL_STATE.moveSpeed;
    this.rotationSpeed = GAME_CONFIG.BASE_ROTATION_SPEED;
    this.isUnderwater = true;

    // Inventory
    this.inventory = [];
    this.inventoryCapacity = INITIAL_STATE.inventoryCapacity;

    this.create();
  }

  create() {
    // Create submarine mesh (box shape - naturally horizontal)
    this.mesh = BABYLON.MeshBuilder.CreateBox(
      'submarine',
      {
        width: 2,    // X axis (left-right)
        height: 1.5, // Y axis (up-down)
        depth: 4,    // Z axis (forward-backward)
      },
      this.scene
    );

    // No rotation needed - box is already oriented correctly
    // Forward = +Z, Up = +Y, Right = +X

    this.mesh.position = this.position.clone();
    this.mesh.checkCollisions = true;
    this.mesh.ellipsoid = new BABYLON.Vector3(1, 1, 2);

    // Create submarine material
    const subMat = new BABYLON.StandardMaterial('submarineMat', this.scene);
    subMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.2); // Yellow submarine
    subMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    this.mesh.material = subMat;

    // Add a light to the submarine (headlights)
    this.light = new BABYLON.SpotLight(
      'submarineLight',
      this.mesh.position.clone(),
      new BABYLON.Vector3(0, 0, 1),
      Math.PI / 3,
      2,
      this.scene
    );
    this.light.diffuse = new BABYLON.Color3(1, 1, 0.8);
    this.light.intensity = 0.8;
    this.light.range = 30;
    this.light.parent = this.mesh;

    // Attach camera to submarine
    this.attachCamera();

    return this;
  }

  attachCamera() {
    // Position camera inside submarine
    this.camera.parent = this.mesh;
    this.camera.position = new BABYLON.Vector3(0, 0.5, 0);
    this.camera.rotation = new BABYLON.Vector3(0, 0, 0);
  }

  move(direction, deltaTime) {
    // Calculate movement vector
    const forward = this.mesh.forward;
    const right = this.mesh.right;
    const up = this.mesh.up;

    const movement = new BABYLON.Vector3(0, 0, 0);

    if (direction.forward) {
      movement.addInPlace(forward.scale(this.moveSpeed * deltaTime));
    }
    if (direction.backward) {
      movement.addInPlace(forward.scale(-this.moveSpeed * deltaTime));
    }
    if (direction.right) {
      movement.addInPlace(right.scale(this.moveSpeed * deltaTime));
    }
    if (direction.left) {
      movement.addInPlace(right.scale(-this.moveSpeed * deltaTime));
    }
    if (direction.up) {
      movement.addInPlace(up.scale(this.moveSpeed * deltaTime));
    }
    if (direction.down) {
      movement.addInPlace(up.scale(-this.moveSpeed * deltaTime));
    }

    // Apply movement with collision detection
    this.mesh.moveWithCollisions(movement);

    // Update position reference
    this.position = this.mesh.position.clone();
  }

  rotate(rotation, deltaTime) {
    // Apply rotation
    if (rotation.yaw !== 0) {
      this.mesh.rotation.y += rotation.yaw * this.rotationSpeed * deltaTime;
    }
    if (rotation.pitch !== 0) {
      // Limit pitch to prevent flipping (±60 degrees)
      const newPitch = this.mesh.rotation.x + rotation.pitch * this.rotationSpeed * deltaTime;
      this.mesh.rotation.x = BABYLON.Scalar.Clamp(newPitch, -Math.PI / 3, Math.PI / 3);
    }
  }

  updateDepth(ocean) {
    this.depth = ocean.getDepthAtPosition(this.position);
    this.isUnderwater = !ocean.isAtSurface(this.position);
  }

  depleteOxygen(deltaTime) {
    if (this.isUnderwater) {
      this.oxygen -= GAME_CONFIG.OXYGEN_DEPLETION_RATE * deltaTime;
      if (this.oxygen < 0) {
        this.oxygen = 0;
      }
    }
  }

  refillOxygen(deltaTime) {
    if (!this.isUnderwater) {
      this.oxygen += GAME_CONFIG.OXYGEN_REFILL_RATE * deltaTime;
      if (this.oxygen > this.maxOxygen) {
        this.oxygen = this.maxOxygen;
      }
    }
  }

  addToInventory(sample) {
    if (this.inventory.length < this.inventoryCapacity) {
      this.inventory.push(sample);
      return true;
    }
    return false;
  }

  clearInventory() {
    this.inventory = [];
  }

  canCollectMore() {
    return this.inventory.length < this.inventoryCapacity;
  }

  getOxygenPercentage() {
    return Math.round((this.oxygen / this.maxOxygen) * 100);
  }

  isOutOfOxygen() {
    return this.oxygen <= 0;
  }

  respawn() {
    // Reset position to surface
    this.mesh.position = new BABYLON.Vector3(0, -2, 0);
    this.position = this.mesh.position.clone();

    // Reset oxygen
    this.oxygen = this.maxOxygen;

    // Clear inventory (lost on death)
    this.clearInventory();

    this.isUnderwater = true;
  }

  // Upgrade methods
  upgradeOxygen(maxOxygen) {
    this.maxOxygen = maxOxygen;
    this.oxygen = maxOxygen; // Refill to new max
  }

  upgradeSpeed(speedMultiplier) {
    this.moveSpeed = GAME_CONFIG.BASE_MOVE_SPEED * speedMultiplier;
  }
}
