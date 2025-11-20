import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF'; // Required for GLB loading
import { GAME_CONFIG, INITIAL_STATE } from '../data/config.js';

// Spawn position constant (at surface, near origin)
const SPAWN_POSITION = new BABYLON.Vector3(0, -1, 0);

/**
 * Submarine entity - the player's vessel
 */
export class Submarine {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.mesh = null;
    this.position = SPAWN_POSITION.clone(); // Start at surface
    this.rotation = new BABYLON.Vector3(0, 0, 0);

    // Submarine state
    this.oxygen = INITIAL_STATE.oxygen;
    this.maxOxygen = INITIAL_STATE.maxOxygen;
    this.depth = 0;
    this.moveSpeed = INITIAL_STATE.moveSpeed;
    this.rotationSpeed = GAME_CONFIG.BASE_ROTATION_SPEED;
    this.isUnderwater = false;  // Start at surface - oxygen shouldn't deplete initially

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
    // Create detailed submarine shape - larger and more visually distinct
    // Use hull as main mesh (supports collision), parent other parts to it

    // Main hull (horizontal cylinder) - THIS IS THE MAIN MESH
    const hull = BABYLON.MeshBuilder.CreateCylinder(
      'submarine',
      {
        height: 6,      // Length increased for better visibility
        diameter: 2,    // Width increased
        tessellation: 24, // More segments for smoother appearance
      },
      this.scene
    );
    hull.rotation.x = Math.PI / 2; // Rotate to horizontal
    hull.position = this.position.clone();

    // Front nose cone (more elongated for realistic look)
    const nose = BABYLON.MeshBuilder.CreateSphere(
      'submarineNose',
      {
        diameter: 2,
        segments: 16,
      },
      this.scene
    );
    nose.position.z = 3; // Position at front
    nose.scaling.set(1, 1, 1.4); // Elongate forward
    nose.parent = hull;

    // Rear propeller housing
    const propHousing = BABYLON.MeshBuilder.CreateCylinder(
      'propHousing',
      {
        height: 0.8,
        diameter: 1.2,
        tessellation: 16,
      },
      this.scene
    );
    propHousing.rotation.x = Math.PI / 2;
    propHousing.position.z = -3.4;
    propHousing.parent = hull;

    // Propeller (simple cross shape)
    const propBlade1 = BABYLON.MeshBuilder.CreateBox('propBlade1', {
      width: 1.8, height: 0.1, depth: 0.4
    }, this.scene);
    propBlade1.position.z = -3.8;
    propBlade1.parent = hull;

    const propBlade2 = BABYLON.MeshBuilder.CreateBox('propBlade2', {
      width: 0.4, height: 1.8, depth: 0.1
    }, this.scene);
    propBlade2.position.z = -3.8;
    propBlade2.parent = hull;

    // Conning tower (larger and more detailed)
    const tower = BABYLON.MeshBuilder.CreateCylinder(
      'submarineTower',
      {
        height: 1.5,
        diameter: 0.9,
        tessellation: 16,
      },
      this.scene
    );
    tower.position.y = 1.2;
    tower.position.z = -0.5;
    tower.parent = hull;

    // Tower top (periscope housing)
    const towerTop = BABYLON.MeshBuilder.CreateCylinder(
      'towerTop',
      {
        height: 0.4,
        diameterTop: 0.6,
        diameterBottom: 0.9,
        tessellation: 12,
      },
      this.scene
    );
    towerTop.position.y = 1.95;
    towerTop.position.z = -0.5;
    towerTop.parent = hull;

    // Side fins (diving planes)
    const finLeft = BABYLON.MeshBuilder.CreateBox(
      'finLeft',
      {
        width: 1.2,
        height: 0.15,
        depth: 1.2,
      },
      this.scene
    );
    finLeft.position.set(-0.8, 0, -2);
    finLeft.rotation.z = Math.PI / 5;
    finLeft.parent = hull;

    const finRight = BABYLON.MeshBuilder.CreateBox(
      'finRight',
      {
        width: 1.2,
        height: 0.15,
        depth: 1.2,
      },
      this.scene
    );
    finRight.position.set(0.8, 0, -2);
    finRight.rotation.z = -Math.PI / 5;
    finRight.parent = hull;

    // Top fin (rudder)
    const topFin = BABYLON.MeshBuilder.CreateBox(
      'topFin',
      {
        width: 0.15,
        height: 1.2,
        depth: 1.2,
      },
      this.scene
    );
    topFin.position.set(0, 0.6, -2);
    topFin.rotation.x = Math.PI / 5;
    topFin.parent = hull;

    // Windows (viewport circles)
    const window1 = BABYLON.MeshBuilder.CreateCylinder('window1', {
      height: 0.1, diameter: 0.4, tessellation: 16
    }, this.scene);
    window1.rotation.x = Math.PI / 2;
    window1.position.set(0, 0, 2);
    window1.parent = hull;

    const window2 = BABYLON.MeshBuilder.CreateCylinder('window2', {
      height: 0.1, diameter: 0.3, tessellation: 16
    }, this.scene);
    window2.rotation.x = Math.PI / 2;
    window2.position.set(0, 0, 1);
    window2.parent = hull;

    // Materials
    const subMat = new BABYLON.StandardMaterial('submarineMat', this.scene);
    subMat.diffuseColor = new BABYLON.Color3(1, 0.9, 0.2); // Bright yellow-gold
    subMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8); // Shiny metal
    subMat.specularPower = 32; // Glossy finish
    subMat.emissiveColor = new BABYLON.Color3(0.15, 0.13, 0.02); // Subtle glow

    // Window material (dark glass)
    const windowMat = new BABYLON.StandardMaterial('windowMat', this.scene);
    windowMat.diffuseColor = new BABYLON.Color3(0.1, 0.15, 0.2); // Dark blue-gray
    windowMat.specularColor = new BABYLON.Color3(1, 1, 1);
    windowMat.specularPower = 128; // Very glossy
    windowMat.emissiveColor = new BABYLON.Color3(0.05, 0.1, 0.15); // Slight inner glow

    // Apply materials
    hull.material = subMat;
    nose.material = subMat;
    propHousing.material = subMat;
    propBlade1.material = subMat;
    propBlade2.material = subMat;
    tower.material = subMat;
    towerTop.material = subMat;
    finLeft.material = subMat;
    finRight.material = subMat;
    topFin.material = subMat;
    window1.material = windowMat;
    window2.material = windowMat;

    // Return hull mesh (has collision support)
    return hull;
  }

  updateCameraTarget() {
    // Update camera target to current submarine position
    // Must be called continuously for camera to follow movement
    if (this.camera && this.mesh) {
      this.camera.setTarget(this.mesh.position);
    }
  }

  move(direction, deltaTime) {
    // Calculate movement vector using world-space directions
    // NOTE: Using world directions for arcade-style tank controls
    // Babylon.js meshes don't have .forward/.right properties by default
    const forward = new BABYLON.Vector3(0, 0, 1);  // World Z-axis (forward)
    const right = new BABYLON.Vector3(1, 0, 0);    // World X-axis (right)

    const movement = new BABYLON.Vector3(0, 0, 0);

    // Horizontal movement (world-relative for predictable controls)
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

    // Depth control (SPACE/SHIFT) - always world Y-axis for intuitive depth changes
    if (direction.up) {
      movement.y += this.moveSpeed * deltaTime;  // Rise (decrease depth)
    }
    if (direction.down) {
      movement.y -= this.moveSpeed * deltaTime;  // Sink (increase depth)
    }

    // Apply movement with collision detection
    this.mesh.moveWithCollisions(movement);

    // Update position reference
    this.position = this.mesh.position.clone();

    // Update camera to follow submarine
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
    // Reset position to surface (use same spawn position as constructor)
    this.mesh.position = SPAWN_POSITION.clone();
    this.position = this.mesh.position.clone();

    // Reset oxygen
    this.oxygen = this.maxOxygen;

    // Clear inventory (lost on death)
    this.clearInventory();

    // Reset underwater state (at surface initially)
    this.isUnderwater = false;
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
