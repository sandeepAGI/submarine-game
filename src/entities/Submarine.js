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
    // Position at front of submarine
    this.light = new BABYLON.SpotLight(
      'submarineLight',
      new BABYLON.Vector3(0, 0, 3),  // At front (local coords)
      new BABYLON.Vector3(0, 0, 1),  // Direction: forward in world space
      Math.PI / 3,  // Cone angle
      2,  // Exponent
      this.scene
    );
    this.light.diffuse = new BABYLON.Color3(1, 1, 0.8);
    this.light.intensity = 1.2;
    this.light.range = 35;
    this.light.parent = this.mesh;

    // Note: Light inherits mesh rotation, ensuring it always points forward

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
    // Create highly detailed submarine model with realistic features
    // Main hull serves as parent for collision detection

    // === MAIN HULL (elongated cigar shape) ===
    const hull = BABYLON.MeshBuilder.CreateCylinder(
      'submarine',
      {
        height: 8,          // Longer for realistic proportions
        diameter: 2.2,      // Width
        tessellation: 32,   // Smooth curves
      },
      this.scene
    );
    hull.rotation.x = Math.PI / 2; // Horizontal orientation
    hull.position = this.position.clone();
    hull.scaling.z = 1.3; // Elongate slightly for cigar shape

    // === FRONT SECTION ===
    // Bow (tapered front)
    const bow = BABYLON.MeshBuilder.CreateCylinder(
      'bow',
      {
        height: 2,
        diameterTop: 2.2,
        diameterBottom: 0.8,
        tessellation: 32,
      },
      this.scene
    );
    bow.rotation.x = Math.PI / 2;
    bow.position.z = 5;
    bow.parent = hull;

    // Nose cap (rounded tip)
    const noseCap = BABYLON.MeshBuilder.CreateSphere(
      'noseCap',
      { diameter: 0.8, segments: 16 },
      this.scene
    );
    noseCap.position.z = 6;
    noseCap.scaling.z = 1.5;
    noseCap.parent = hull;

    // === CONNING TOWER (detailed sail structure) ===
    // Main tower base
    const towerBase = BABYLON.MeshBuilder.CreateBox(
      'towerBase',
      { width: 1.2, height: 1.8, depth: 2.5 },
      this.scene
    );
    towerBase.position.set(0, 1.5, 0.5);
    towerBase.parent = hull;

    // Tower top (streamlined)
    const towerTop = BABYLON.MeshBuilder.CreateCylinder(
      'towerTop',
      {
        height: 0.6,
        diameterTop: 0.8,
        diameterBottom: 1.2,
        tessellation: 16,
      },
      this.scene
    );
    towerTop.position.set(0, 2.4, 0.5);
    towerTop.parent = hull;

    // Periscope
    const periscope = BABYLON.MeshBuilder.CreateCylinder(
      'periscope',
      { height: 0.8, diameter: 0.15, tessellation: 12 },
      this.scene
    );
    periscope.position.set(0.2, 2.9, 0.3);
    periscope.parent = hull;

    // Periscope head
    const periscopeHead = BABYLON.MeshBuilder.CreateBox(
      'periscopeHead',
      { width: 0.25, height: 0.15, depth: 0.25 },
      this.scene
    );
    periscopeHead.position.set(0.2, 3.3, 0.3);
    periscopeHead.parent = hull;

    // === BALLAST TANKS (side bulges) ===
    const ballastLeft = BABYLON.MeshBuilder.CreateCylinder(
      'ballastLeft',
      { height: 6, diameter: 0.6, tessellation: 16 },
      this.scene
    );
    ballastLeft.rotation.x = Math.PI / 2;
    ballastLeft.position.set(-0.9, -0.4, 0);
    ballastLeft.parent = hull;

    const ballastRight = BABYLON.MeshBuilder.CreateCylinder(
      'ballastRight',
      { height: 6, diameter: 0.6, tessellation: 16 },
      this.scene
    );
    ballastRight.rotation.x = Math.PI / 2;
    ballastRight.position.set(0.9, -0.4, 0);
    ballastRight.parent = hull;

    // === CONTROL SURFACES ===
    // Front dive planes (left)
    const divePlaneFL = BABYLON.MeshBuilder.CreateBox(
      'divePlaneFL',
      { width: 1.4, height: 0.1, depth: 0.8 },
      this.scene
    );
    divePlaneFL.position.set(-0.9, 0, 3);
    divePlaneFL.rotation.set(0, 0, Math.PI / 6);
    divePlaneFL.parent = hull;

    // Front dive planes (right)
    const divePlaneFR = BABYLON.MeshBuilder.CreateBox(
      'divePlaneFR',
      { width: 1.4, height: 0.1, depth: 0.8 },
      this.scene
    );
    divePlaneFR.position.set(0.9, 0, 3);
    divePlaneFR.rotation.set(0, 0, -Math.PI / 6);
    divePlaneFR.parent = hull;

    // === REAR SECTION ===
    // Stern (tapered rear)
    const stern = BABYLON.MeshBuilder.CreateCylinder(
      'stern',
      {
        height: 1.5,
        diameterTop: 2.2,
        diameterBottom: 1.2,
        tessellation: 32,
      },
      this.scene
    );
    stern.rotation.x = Math.PI / 2;
    stern.position.z = -4.5;
    stern.parent = hull;

    // Propeller shaft housing
    const propShaft = BABYLON.MeshBuilder.CreateCylinder(
      'propShaft',
      { height: 1, diameter: 0.5, tessellation: 16 },
      this.scene
    );
    propShaft.rotation.x = Math.PI / 2;
    propShaft.position.z = -5.5;
    propShaft.parent = hull;

    // Propeller blades (4 blades)
    for (let i = 0; i < 4; i++) {
      const blade = BABYLON.MeshBuilder.CreateBox(
        `propBlade${i}`,
        { width: 0.15, height: 1.5, depth: 0.5 },
        this.scene
      );
      const angle = (i * Math.PI) / 2;
      blade.position.set(
        Math.cos(angle) * 0.5,
        Math.sin(angle) * 0.5,
        -6
      );
      blade.rotation.z = angle;
      blade.parent = hull;
    }

    // Rudder (vertical stabilizer)
    const rudder = BABYLON.MeshBuilder.CreateBox(
      'rudder',
      { width: 0.15, height: 1.5, depth: 1.2 },
      this.scene
    );
    rudder.position.set(0, 0.5, -4.5);
    rudder.parent = hull;

    // Rear dive planes (horizontal stabilizers)
    const rearPlaneLeft = BABYLON.MeshBuilder.CreateBox(
      'rearPlaneLeft',
      { width: 1.2, height: 0.12, depth: 1.0 },
      this.scene
    );
    rearPlaneLeft.position.set(-0.7, 0, -4.5);
    rearPlaneLeft.rotation.z = Math.PI / 6;
    rearPlaneLeft.parent = hull;

    const rearPlaneRight = BABYLON.MeshBuilder.CreateBox(
      'rearPlaneRight',
      { width: 1.2, height: 0.12, depth: 1.0 },
      this.scene
    );
    rearPlaneRight.position.set(0.7, 0, -4.5);
    rearPlaneRight.rotation.z = -Math.PI / 6;
    rearPlaneRight.parent = hull;

    // === PORTHOLES (windows) ===
    const portholes = [];
    for (let i = 0; i < 5; i++) {
      const porthole = BABYLON.MeshBuilder.CreateCylinder(
        `porthole${i}`,
        { height: 0.12, diameter: 0.35, tessellation: 16 },
        this.scene
      );
      porthole.rotation.x = Math.PI / 2;
      porthole.position.set(0, 0.5, 4 - i * 1.5);
      porthole.parent = hull;
      portholes.push(porthole);
    }

    // === MATERIALS ===
    // Main submarine material - metallic dark gray/navy
    const subMat = new BABYLON.StandardMaterial('submarineMat', this.scene);
    subMat.diffuseColor = new BABYLON.Color3(0.15, 0.18, 0.22);  // Dark navy-gray
    subMat.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6);   // Metallic sheen
    subMat.specularPower = 64;  // Sharp metallic highlights
    subMat.emissiveColor = new BABYLON.Color3(0.02, 0.025, 0.03); // Subtle ambient

    // Accent material (conning tower, details) - slightly lighter
    const accentMat = new BABYLON.StandardMaterial('accentMat', this.scene);
    accentMat.diffuseColor = new BABYLON.Color3(0.2, 0.22, 0.25);
    accentMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    accentMat.specularPower = 48;

    // Porthole material - dark glass with glow
    const portholeMat = new BABYLON.StandardMaterial('portholeMat', this.scene);
    portholeMat.diffuseColor = new BABYLON.Color3(0.05, 0.1, 0.15);
    portholeMat.specularColor = new BABYLON.Color3(1, 1, 1);
    portholeMat.specularPower = 128; // Very glossy glass
    portholeMat.emissiveColor = new BABYLON.Color3(0.15, 0.2, 0.25); // Inner glow
    portholeMat.alpha = 0.9;

    // Apply materials
    hull.material = subMat;
    bow.material = subMat;
    noseCap.material = subMat;
    stern.material = subMat;
    ballastLeft.material = subMat;
    ballastRight.material = subMat;
    propShaft.material = accentMat;

    towerBase.material = accentMat;
    towerTop.material = accentMat;
    periscope.material = accentMat;
    periscopeHead.material = accentMat;

    // Control surfaces - darker material
    const finMat = new BABYLON.StandardMaterial('finMat', this.scene);
    finMat.diffuseColor = new BABYLON.Color3(0.12, 0.14, 0.16);
    finMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    finMat.specularPower = 32;

    divePlaneFL.material = finMat;
    divePlaneFR.material = finMat;
    rudder.material = finMat;
    rearPlaneLeft.material = finMat;
    rearPlaneRight.material = finMat;

    // Propeller blades - metallic
    const propMat = new BABYLON.StandardMaterial('propMat', this.scene);
    propMat.diffuseColor = new BABYLON.Color3(0.25, 0.25, 0.25);
    propMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    propMat.specularPower = 96;

    for (let i = 0; i < 4; i++) {
      hull.getChildMeshes().find(m => m.name === `propBlade${i}`).material = propMat;
    }

    // Portholes
    portholes.forEach(p => p.material = portholeMat);

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
