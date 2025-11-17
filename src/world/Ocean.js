import * as BABYLON from '@babylonjs/core';
import { GAME_CONFIG } from '../data/config.js';

/**
 * Ocean environment - creates the ocean floor, water, and depth zones
 */
export class Ocean {
  constructor(scene) {
    this.scene = scene;
    this.floor = null;
    this.bounds = GAME_CONFIG.OCEAN_SIZE;
  }

  create() {
    this.createOceanFloor();
    this.createBoundaries();
    this.createSurfaceIndicator();
    return this;
  }

  createOceanFloor() {
    // Create ocean floor
    const ground = BABYLON.MeshBuilder.CreateGround(
      'oceanFloor',
      {
        width: this.bounds,
        height: this.bounds,
        subdivisions: 32,
      },
      this.scene
    );

    // Position at shallow zone max depth
    ground.position.y = -GAME_CONFIG.SHALLOW_ZONE_MAX;

    // Create sandy ocean floor material
    const groundMat = new BABYLON.StandardMaterial('groundMat', this.scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.6, 0.5, 0.3); // Sandy color
    groundMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

    ground.material = groundMat;
    ground.checkCollisions = true;

    this.floor = ground;

    // Add some visual interest with displacement
    const positions = ground.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    for (let i = 0; i < positions.length; i += 3) {
      // Add random height variation
      positions[i + 1] += Math.random() * 2 - 1;
    }
    ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);

    return ground;
  }

  createBoundaries() {
    // Create invisible walls at the boundaries
    const wallHeight = GAME_CONFIG.SHALLOW_ZONE_MAX + 10;
    const wallThickness = 1;

    const createWall = (name, width, height, depth, position) => {
      const wall = BABYLON.MeshBuilder.CreateBox(
        name,
        { width, height, depth },
        this.scene
      );
      wall.position = position;
      wall.checkCollisions = true;
      wall.isVisible = false;
      return wall;
    };

    // North wall
    createWall(
      'wallNorth',
      this.bounds,
      wallHeight,
      wallThickness,
      new BABYLON.Vector3(0, -wallHeight / 2, this.bounds / 2)
    );

    // South wall
    createWall(
      'wallSouth',
      this.bounds,
      wallHeight,
      wallThickness,
      new BABYLON.Vector3(0, -wallHeight / 2, -this.bounds / 2)
    );

    // East wall
    createWall(
      'wallEast',
      wallThickness,
      wallHeight,
      this.bounds,
      new BABYLON.Vector3(this.bounds / 2, -wallHeight / 2, 0)
    );

    // West wall
    createWall(
      'wallWest',
      wallThickness,
      wallHeight,
      this.bounds,
      new BABYLON.Vector3(-this.bounds / 2, -wallHeight / 2, 0)
    );
  }

  createSurfaceIndicator() {
    // Create a semi-transparent plane at surface level to visualize the surface
    const surface = BABYLON.MeshBuilder.CreateGround(
      'surface',
      {
        width: this.bounds,
        height: this.bounds,
      },
      this.scene
    );

    surface.position.y = 0;

    const surfaceMat = new BABYLON.StandardMaterial('surfaceMat', this.scene);
    surfaceMat.diffuseColor = new BABYLON.Color3(0, 0.4, 0.6);
    surfaceMat.alpha = 0.3;
    surfaceMat.backFaceCulling = false;

    surface.material = surfaceMat;
    surface.checkCollisions = false;

    return surface;
  }

  getDepthAtPosition(position) {
    // Calculate depth based on Y position (0 = surface, negative = underwater)
    return Math.max(0, -position.y);
  }

  isAtSurface(position) {
    return this.getDepthAtPosition(position) <= GAME_CONFIG.SURFACE_THRESHOLD;
  }
}
