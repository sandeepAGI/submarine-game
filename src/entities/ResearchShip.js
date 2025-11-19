import * as BABYLON from '@babylonjs/core';

/**
 * Research Ship entity - the hub where players interact with quests and upgrades
 */
export class ResearchShip {
  constructor(scene) {
    this.scene = scene;
    this.mesh = null;
    this.position = new BABYLON.Vector3(0, 0, 0); // At surface, origin

    this.create();
  }

  create() {
    // Create ship mesh - a large visible platform
    const shipBase = BABYLON.MeshBuilder.CreateBox(
      'researchShipBase',
      {
        width: 8,
        height: 2,
        depth: 12,
      },
      this.scene
    );

    shipBase.position = new BABYLON.Vector3(0, 1, 0); // Floating on surface

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

    // Add a bright light to the ship for visibility
    const shipLight = new BABYLON.PointLight(
      'shipLight',
      new BABYLON.Vector3(0, 5, 0),
      this.scene
    );
    shipLight.diffuse = new BABYLON.Color3(1, 0.8, 0.4);
    shipLight.intensity = 2;
    shipLight.range = 50;

    // Parent all parts to base
    cabin.parent = shipBase;
    beacon.parent = shipBase;
    shipLight.parent = shipBase;

    // Make ship non-collidable (player can pass through to interact)
    shipBase.checkCollisions = false;
    cabin.checkCollisions = false;
    beacon.checkCollisions = false;

    this.mesh = shipBase;
    this.position = shipBase.position;

    // Add gentle bobbing animation
    this.addBobbingAnimation();

    return this;
  }

  addBobbingAnimation() {
    // Gentle up-down bobbing to simulate floating
    const baseY = this.mesh.position.y;

    this.scene.registerBeforeRender(() => {
      if (this.mesh) {
        const time = performance.now() * 0.0005;
        this.mesh.position.y = baseY + Math.sin(time) * 0.3;
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
