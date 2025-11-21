import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF'; // Required for GLB loading

/**
 * Research Ship entity - the hub where players interact with quests and upgrades
 */
export class ResearchShip {
  constructor(scene) {
    this.scene = scene;
    this.mesh = null;
    this.position = new BABYLON.Vector3(0, 0, 30); // At surface, forward of submarine spawn
    this.baseY = 0; // Base Y position for bobbing animation

    this.create();
  }

  create() {
    // Create fallback mesh immediately (synchronous)
    this.mesh = this.createFallbackMesh();

    // Add ship light and animation
    this.addShipLight();
    this.addBobbingAnimation();

    // Try to load 3D model in background (will replace fallback if found)
    this.loadModel();
  }

  async loadModel() {
    try {
      console.log('🔄 Loading research_ship.glb (48KB)...');

      // Attempt to load GLB model
      const result = await BABYLON.SceneLoader.ImportMeshAsync(
        '',
        'src/assets/models/',
        'research_ship.glb',
        this.scene
      );

      if (result.meshes && result.meshes.length > 0) {
        console.log(`✅ Research Ship 3D model loaded! (${result.meshes.length} meshes)`);

        // Model loaded successfully - replace fallback
        const oldMesh = this.mesh;
        this.mesh = result.meshes[0];
        this.mesh.position = this.position.clone(); // Use spawn position
        this.mesh.scaling = new BABYLON.Vector3(2, 2, 2);

        // Enable collision on ship (player cannot pass through)
        this.mesh.checkCollisions = true;
        result.meshes.forEach(mesh => mesh.checkCollisions = true);

        // Update baseY for bobbing animation to use new mesh position
        this.baseY = this.mesh.position.y;

        // Dispose old fallback mesh
        oldMesh.dispose();
      }
    } catch (error) {
      // Keep using fallback mesh
      console.warn('⚠️ Research Ship 3D model not found, using fallback procedural model');
      console.error('Error details:', error.message);
    }
  }

  createFallbackMesh() {
    // Create detailed research vessel with realistic features

    // === SHIP HULL (elongated box with realistic proportions) ===
    const hull = BABYLON.MeshBuilder.CreateBox(
      'researchShipHull',
      {
        width: 10,    // Width
        height: 3,    // Hull depth
        depth: 20,    // Length
      },
      this.scene
    );
    hull.position = this.position.clone(); // Use spawn position
    hull.position.y = -1; // Keep hull partially submerged (adjust Y only)

    // Create bow (front tapered section)
    const bow = BABYLON.MeshBuilder.CreateCylinder(
      'bow',
      {
        diameterTop: 0,
        diameterBottom: 10,
        height: 4,
        tessellation: 16,
      },
      this.scene
    );
    bow.rotation.x = Math.PI / 2;
    bow.position = new BABYLON.Vector3(0, -1, 12);
    bow.parent = hull;

    // Create stern (rear tapered section)
    const stern = BABYLON.MeshBuilder.CreateCylinder(
      'stern',
      {
        diameterTop: 0,
        diameterBottom: 10,
        height: 3,
        tessellation: 16,
      },
      this.scene
    );
    stern.rotation.x = Math.PI / 2;
    stern.position = new BABYLON.Vector3(0, -1, -11.5);
    stern.parent = hull;

    // === SUPERSTRUCTURE (bridge and cabin areas) ===

    // Main cabin/bridge structure
    const bridge = BABYLON.MeshBuilder.CreateBox(
      'bridge',
      {
        width: 8,
        height: 5,
        depth: 6,
      },
      this.scene
    );
    bridge.position = new BABYLON.Vector3(0, 3.5, -3);
    bridge.parent = hull;

    // Upper bridge/wheelhouse
    const wheelhouse = BABYLON.MeshBuilder.CreateBox(
      'wheelhouse',
      {
        width: 6,
        height: 3,
        depth: 4,
      },
      this.scene
    );
    wheelhouse.position = new BABYLON.Vector3(0, 7, -3);
    wheelhouse.parent = hull;

    // Bridge roof
    const bridgeRoof = BABYLON.MeshBuilder.CreateBox(
      'bridgeRoof',
      {
        width: 6.5,
        height: 0.3,
        depth: 4.5,
      },
      this.scene
    );
    bridgeRoof.position = new BABYLON.Vector3(0, 8.65, -3);
    bridgeRoof.parent = hull;

    // === DECK EQUIPMENT ===

    // Research crane (front deck)
    const cranePole = BABYLON.MeshBuilder.CreateCylinder(
      'cranePole',
      {
        diameter: 0.4,
        height: 8,
        tessellation: 12,
      },
      this.scene
    );
    cranePole.position = new BABYLON.Vector3(-3, 4, 5);
    cranePole.parent = hull;

    // Crane arm
    const craneArm = BABYLON.MeshBuilder.CreateBox(
      'craneArm',
      {
        width: 0.3,
        height: 0.3,
        depth: 4,
      },
      this.scene
    );
    craneArm.position = new BABYLON.Vector3(-3, 8, 7);
    craneArm.rotation.z = Math.PI / 6; // Angled
    craneArm.parent = hull;

    // Second crane (starboard side)
    const cranePole2 = BABYLON.MeshBuilder.CreateCylinder(
      'cranePole2',
      {
        diameter: 0.4,
        height: 8,
        tessellation: 12,
      },
      this.scene
    );
    cranePole2.position = new BABYLON.Vector3(3, 4, 5);
    cranePole2.parent = hull;

    // Communication antenna/mast
    const antenna = BABYLON.MeshBuilder.CreateCylinder(
      'antenna',
      {
        diameter: 0.2,
        height: 6,
        tessellation: 8,
      },
      this.scene
    );
    antenna.position = new BABYLON.Vector3(0, 12, -3);
    antenna.parent = hull;

    // Radar dish
    const radarDish = BABYLON.MeshBuilder.CreateCylinder(
      'radarDish',
      {
        diameter: 2,
        height: 0.3,
        tessellation: 20,
      },
      this.scene
    );
    radarDish.position = new BABYLON.Vector3(2, 10, -1);
    radarDish.rotation.z = Math.PI / 4; // Angled
    radarDish.parent = hull;

    // === WINDOWS/PORTHOLES ===

    // Bridge windows (front)
    const windowPositions = [
      { x: -2, y: 7.5, z: 0 },
      { x: 0, y: 7.5, z: 0 },
      { x: 2, y: 7.5, z: 0 },
    ];

    windowPositions.forEach((pos, i) => {
      const window = BABYLON.MeshBuilder.CreateBox(
        `window${i}`,
        {
          width: 1.2,
          height: 1.5,
          depth: 0.1,
        },
        this.scene
      );
      window.position = new BABYLON.Vector3(pos.x, pos.y, pos.z);
      window.parent = hull;
    });

    // Side portholes (4 per side)
    for (let i = 0; i < 4; i++) {
      const porthole = BABYLON.MeshBuilder.CreateCylinder(
        `porthole${i}`,
        {
          diameter: 0.6,
          height: 0.1,
          tessellation: 16,
        },
        this.scene
      );
      porthole.rotation.x = Math.PI / 2;
      porthole.position = new BABYLON.Vector3(5.05, 2, 6 - i * 4);
      porthole.parent = hull;

      const porthole2 = BABYLON.MeshBuilder.CreateCylinder(
        `porthole${i + 4}`,
        {
          diameter: 0.6,
          height: 0.1,
          tessellation: 16,
        },
        this.scene
      );
      porthole2.rotation.x = Math.PI / 2;
      porthole2.position = new BABYLON.Vector3(-5.05, 2, 6 - i * 4);
      porthole2.parent = hull;
    }

    // === DECK DETAILS ===

    // Deck surface (top of hull)
    const deck = BABYLON.MeshBuilder.CreateBox(
      'deck',
      {
        width: 9.8,
        height: 0.2,
        depth: 19.8,
      },
      this.scene
    );
    deck.position = new BABYLON.Vector3(0, 0.6, 0);
    deck.parent = hull;

    // Deck railings (simplified as boxes)
    const railingLeft = BABYLON.MeshBuilder.CreateBox(
      'railingLeft',
      {
        width: 0.1,
        height: 0.8,
        depth: 18,
      },
      this.scene
    );
    railingLeft.position = new BABYLON.Vector3(-5, 1.5, 1);
    railingLeft.parent = hull;

    const railingRight = BABYLON.MeshBuilder.CreateBox(
      'railingRight',
      {
        width: 0.1,
        height: 0.8,
        depth: 18,
      },
      this.scene
    );
    railingRight.position = new BABYLON.Vector3(5, 1.5, 1);
    railingRight.parent = hull;

    // Lifeboat (port side)
    const lifeboat = BABYLON.MeshBuilder.CreateCylinder(
      'lifeboat',
      {
        diameterTop: 1.2,
        diameterBottom: 1.0,
        height: 3,
        tessellation: 16,
      },
      this.scene
    );
    lifeboat.rotation.x = Math.PI / 2;
    lifeboat.rotation.z = Math.PI / 2;
    lifeboat.position = new BABYLON.Vector3(-4, 2.5, -8);
    lifeboat.parent = hull;

    // Lifeboat (starboard side)
    const lifeboat2 = BABYLON.MeshBuilder.CreateCylinder(
      'lifeboat2',
      {
        diameterTop: 1.2,
        diameterBottom: 1.0,
        height: 3,
        tessellation: 16,
      },
      this.scene
    );
    lifeboat2.rotation.x = Math.PI / 2;
    lifeboat2.rotation.z = Math.PI / 2;
    lifeboat2.position = new BABYLON.Vector3(4, 2.5, -8);
    lifeboat2.parent = hull;

    // Navigation light beacon (bright yellow marker on top)
    const beacon = BABYLON.MeshBuilder.CreateCylinder(
      'beacon',
      {
        diameter: 0.6,
        height: 2,
        tessellation: 16,
      },
      this.scene
    );
    beacon.position = new BABYLON.Vector3(0, 16, -3);
    beacon.parent = hull;

    // === MATERIALS ===

    // Main ship hull material (white/light gray with rust)
    const hullMat = new BABYLON.StandardMaterial('shipHullMat', this.scene);
    hullMat.diffuseColor = new BABYLON.Color3(0.95, 0.95, 0.9); // Off-white
    hullMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    hullMat.specularPower = 32;
    hullMat.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.08); // Slight ambient

    hull.material = hullMat;
    bow.material = hullMat;
    stern.material = hullMat;

    // Superstructure material (brighter white)
    const superstructureMat = new BABYLON.StandardMaterial('superstructureMat', this.scene);
    superstructureMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
    superstructureMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    superstructureMat.specularPower = 48;

    bridge.material = superstructureMat;
    wheelhouse.material = superstructureMat;
    bridgeRoof.material = superstructureMat;

    // Metal equipment material (dark gray)
    const metalMat = new BABYLON.StandardMaterial('metalMat', this.scene);
    metalMat.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.35);
    metalMat.specularColor = new BABYLON.Color3(0.6, 0.6, 0.6);
    metalMat.specularPower = 64;

    cranePole.material = metalMat;
    craneArm.material = metalMat;
    cranePole2.material = metalMat;
    antenna.material = metalMat;
    radarDish.material = metalMat;
    railingLeft.material = metalMat;
    railingRight.material = metalMat;

    // Deck material (darker gray)
    const deckMat = new BABYLON.StandardMaterial('deckMat', this.scene);
    deckMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.45);
    deckMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    deckMat.specularPower = 16;

    deck.material = deckMat;

    // Glass material for windows/portholes (cyan tint)
    const glassMat = new BABYLON.StandardMaterial('glassMat', this.scene);
    glassMat.diffuseColor = new BABYLON.Color3(0.3, 0.6, 0.8);
    glassMat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    glassMat.specularPower = 128; // Very shiny
    glassMat.emissiveColor = new BABYLON.Color3(0.1, 0.2, 0.3); // Subtle glow
    glassMat.alpha = 0.6; // Slightly transparent

    // Apply glass material to all windows and portholes
    for (let i = 0; i < 3; i++) {
      hull.getChildMeshes()[windowPositions.length + i].material = glassMat;
    }
    for (let i = 0; i < 8; i++) {
      hull.getChildMeshes().find(m => m.name.includes(`porthole${i}`)).material = glassMat;
    }

    // Lifeboat material (orange)
    const lifeboatMat = new BABYLON.StandardMaterial('lifeboatMat', this.scene);
    lifeboatMat.diffuseColor = new BABYLON.Color3(1, 0.5, 0);
    lifeboatMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    lifeboatMat.emissiveColor = new BABYLON.Color3(0.2, 0.1, 0);

    lifeboat.material = lifeboatMat;
    lifeboat2.material = lifeboatMat;

    // Beacon material (bright yellow, glowing)
    const beaconMat = new BABYLON.StandardMaterial('beaconMat', this.scene);
    beaconMat.diffuseColor = new BABYLON.Color3(1, 1, 0);
    beaconMat.emissiveColor = new BABYLON.Color3(1, 1, 0); // Full glow
    beaconMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0);
    beacon.material = beaconMat;

    // Enable ship collision (submarine cannot pass through)
    hull.checkCollisions = true;
    hull.getChildMeshes().forEach(child => child.checkCollisions = true);

    return hull;
  }

  addShipLight() {
    // Add a light to the ship for visibility (reduced brightness for atmosphere)
    const shipLight = new BABYLON.PointLight(
      'shipLight',
      new BABYLON.Vector3(0, 5, 0),
      this.scene
    );
    shipLight.diffuse = new BABYLON.Color3(1, 0.8, 0.4);
    shipLight.intensity = 1.5; // Reduced from 2.5 to avoid washing out scene
    shipLight.range = 40; // Reduced from 60 for more focused lighting
    shipLight.parent = this.mesh;
  }

  addBobbingAnimation() {
    // Gentle up-down bobbing to simulate floating
    // Store baseY as instance variable so it can be updated when model loads
    this.baseY = this.mesh.position.y;

    this.scene.registerBeforeRender(() => {
      if (this.mesh) {
        const time = performance.now() * 0.0005;
        this.mesh.position.y = this.baseY + Math.sin(time) * 0.3;
      }
    });
  }

  dispose() {
    if (this.mesh) {
      // Dispose all children
      this.mesh.getChildMeshes().forEach(child => child.dispose());
      this.mesh.dispose();
      this.mesh = null;
    }
  }
}
