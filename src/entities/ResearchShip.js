import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF'; // Required for GLB loading

/**
 * Research Ship entity - the hub where players interact with quests and upgrades
 */
export class ResearchShip {
  constructor(scene) {
    this.scene = scene;
    this.mesh = null;
    this.position = new BABYLON.Vector3(0, 0, 0); // At surface, origin
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
      // Attempt to load GLB model
      const result = await BABYLON.SceneLoader.ImportMeshAsync(
        '',
        'src/assets/models/',
        'research_ship.glb',
        this.scene
      );

      if (result.meshes && result.meshes.length > 0) {
        // Model loaded successfully - replace fallback
        const oldMesh = this.mesh;
        this.mesh = result.meshes[0];
        this.mesh.position = new BABYLON.Vector3(0, 0, 0);
        this.mesh.scaling = new BABYLON.Vector3(2, 2, 2);

        // Disable collision on ship (player should pass through to interact)
        this.mesh.checkCollisions = false;
        result.meshes.forEach(mesh => mesh.checkCollisions = false);

        // Update baseY for bobbing animation to use new mesh position
        this.baseY = this.mesh.position.y;

        // Dispose old fallback mesh
        oldMesh.dispose();

        console.log('Research Ship 3D model loaded successfully');
      }
    } catch (error) {
      // Keep using fallback mesh
      console.log('Research Ship 3D model not found, using fallback shape');
    }
  }

  createFallbackMesh() {
    // Create improved ship mesh - more detailed than before
    const shipBase = BABYLON.MeshBuilder.CreateBox(
      'researchShipBase',
      {
        width: 8,
        height: 2,
        depth: 12,
      },
      this.scene
    );

    shipBase.position = new BABYLON.Vector3(0, 0, 0); // At surface (consistent with loaded model)

    // Create ship superstructure (cabin/tower)
    const cabin = BABYLON.MeshBuilder.CreateBox(
      'researchShipCabin',
      {
        width: 4,
        height: 3,
        depth: 4,
      },
      this.scene
    );
    cabin.position = new BABYLON.Vector3(0, 3.5, -2);

    // Create a marker beacon on top
    const beacon = BABYLON.MeshBuilder.CreateCylinder(
      'beacon',
      {
        diameter: 0.5,
        height: 2,
      },
      this.scene
    );
    beacon.position = new BABYLON.Vector3(0, 6, -2);

    // Create ship material (bright orange/yellow for visibility)
    const shipMat = new BABYLON.StandardMaterial('shipMat', this.scene);
    shipMat.diffuseColor = new BABYLON.Color3(1, 0.6, 0); // Bright orange
    shipMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    shipMat.emissiveColor = new BABYLON.Color3(0.3, 0.2, 0); // Slight glow

    shipBase.material = shipMat;
    cabin.material = shipMat;

    // Beacon material (bright yellow, glowing)
    const beaconMat = new BABYLON.StandardMaterial('beaconMat', this.scene);
    beaconMat.diffuseColor = new BABYLON.Color3(1, 1, 0);
    beaconMat.emissiveColor = new BABYLON.Color3(1, 1, 0); // Full glow
    beacon.material = beaconMat;

    // Parent all parts to base
    cabin.parent = shipBase;
    beacon.parent = shipBase;

    // Make ship non-collidable (player can pass through to interact)
    shipBase.checkCollisions = false;
    cabin.checkCollisions = false;
    beacon.checkCollisions = false;

    return shipBase;
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
