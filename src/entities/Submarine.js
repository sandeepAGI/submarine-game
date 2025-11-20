import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF'; // Required for GLB loading
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
    // Create fallback mesh immediately (synchronous)
    this.mesh = this.createFallbackMesh();

    // Common setup
    this.mesh.checkCollisions = true;
    this.mesh.ellipsoid = new BABYLON.Vector3(1, 1, 2);

    // Add headlight to submarine
    this.light = new BABYLON.SpotLight(
      'submarineLight',
      this.mesh.position.clone(),
      new BABYLON.Vector3(0, 0, 1),
      Math.PI / 3,
      2,
      this.scene
    );
    this.light.diffuse = new BABYLON.Color3(1, 1, 0.8);
    this.light.intensity = 1.2;
    this.light.range = 35;
    this.light.parent = this.mesh;

    // Set camera target to submarine (third-person)
    this.updateCameraTarget();

    // Try to load 3D model in background (will replace fallback if found)
    this.loadModel();

    return this;
  }

  async loadModel() {
    try {
      // Attempt to load GLB model
      const result = await BABYLON.SceneLoader.ImportMeshAsync(
        '',
        'src/assets/models/',
        'submarine.glb',
        this.scene
      );

      if (result.meshes && result.meshes.length > 0) {
        // Model loaded successfully - replace fallback
        const oldMesh = this.mesh;
        this.mesh = result.meshes[0];
        this.mesh.position = oldMesh.position.clone();
        this.mesh.rotation = oldMesh.rotation.clone();
        this.mesh.scaling = new BABYLON.Vector3(2, 2, 2);

        // Transfer properties
        this.mesh.checkCollisions = true;
        this.mesh.ellipsoid = new BABYLON.Vector3(1, 1, 2);

        // Re-parent light
        this.light.parent = this.mesh;

        // Update camera target
        this.updateCameraTarget();

        // Dispose old fallback mesh
        oldMesh.dispose();

        console.log('Submarine 3D model loaded successfully');
      }
    } catch (error) {
      // Keep using fallback mesh
      console.log('Submarine 3D model not found, using fallback primitive shape');
    }
  }

  createFallbackMesh() {
    // Create improved submarine shape using cylinders and spheres
    const parent = new BABYLON.TransformNode('submarine', this.scene);
    parent.position = this.position.clone();

    // Main hull (horizontal cylinder)
    const hull = BABYLON.MeshBuilder.CreateCylinder(
      'submarineHull',
      {
        height: 4,      // Length of submarine
        diameter: 1.5,  // Width
        tessellation: 16,
      },
      this.scene
    );
    hull.rotation.x = Math.PI / 2; // Rotate to horizontal
    hull.parent = parent;

    // Front nose cone
    const nose = BABYLON.MeshBuilder.CreateSphere(
      'submarineNose',
      {
        diameter: 1.5,
        segments: 12,
      },
      this.scene
    );
    nose.position.z = 2; // Position at front
    nose.scaling.z = 0.8; // Elongate forward
    nose.parent = parent;

    // Conning tower (periscope housing)
    const tower = BABYLON.MeshBuilder.CreateCylinder(
      'submarineTower',
      {
        height: 1,
        diameter: 0.6,
        tessellation: 12,
      },
      this.scene
    );
    tower.position.y = 0.8;
    tower.position.z = -0.5;
    tower.parent = parent;

    // Rear stabilizer fins
    const finLeft = BABYLON.MeshBuilder.CreateBox(
      'finLeft',
      {
        width: 0.8,
        height: 0.1,
        depth: 0.8,
      },
      this.scene
    );
    finLeft.position.set(-0.6, 0, -1.8);
    finLeft.rotation.z = Math.PI / 6;
    finLeft.parent = parent;

    const finRight = BABYLON.MeshBuilder.CreateBox(
      'finRight',
      {
        width: 0.8,
        height: 0.1,
        depth: 0.8,
      },
      this.scene
    );
    finRight.position.set(0.6, 0, -1.8);
    finRight.rotation.z = -Math.PI / 6;
    finRight.parent = parent;

    // Material for all parts
    const subMat = new BABYLON.StandardMaterial('submarineMat', this.scene);
    subMat.diffuseColor = new BABYLON.Color3(0.9, 0.8, 0.1); // Bright yellow
    subMat.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6);
    subMat.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0); // Slight glow

    hull.material = subMat;
    nose.material = subMat;
    tower.material = subMat;
    finLeft.material = subMat;
    finRight.material = subMat;

    return parent;
  }

  updateCameraTarget() {
    // Update camera target to follow submarine position
    // ArcRotateCamera will automatically orbit around this target
    if (this.camera && this.camera.setTarget) {
      this.camera.setTarget(this.mesh.position);
    }
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

    // Update camera target to follow submarine
    this.updateCameraTarget();
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
