import * as BABYLON from '@babylonjs/core';
import { WaterMaterial } from '@babylonjs/materials/water';
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
    this.setupUnderwaterAtmosphere();
    this.createAmbientParticles();
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
    // Create water surface with realistic waves using WaterMaterial
    const waterMesh = BABYLON.MeshBuilder.CreateGround(
      'waterSurface',
      {
        width: this.bounds,
        height: this.bounds,
        subdivisions: 64, // Higher subdivisions for smoother waves
      },
      this.scene
    );

    waterMesh.position.y = 0; // At sea level

    // Create realistic water material
    const water = new WaterMaterial('waterMaterial', this.scene, new BABYLON.Vector2(512, 512));

    // Water appearance settings
    water.diffuseColor = new BABYLON.Color3(0.05, 0.2, 0.3); // Deep ocean blue-green
    water.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    water.bumpHeight = 0.3; // Wave height
    water.windForce = -15; // Wind strength (negative = flowing)
    water.waveHeight = 0.8; // Wave amplitude
    water.waveLength = 0.2; // Wave frequency
    water.waveSpeed = 20.0; // Animation speed
    water.colorBlendFactor = 0.3; // Blend between water color and reflections
    water.windDirection = new BABYLON.Vector2(1, 1); // Wave direction

    // Transparency and depth
    water.alpha = 0.85; // Slightly transparent to see below
    water.backFaceCulling = false; // Render both sides

    // Store water material for later use (adding reflections)
    this.waterMaterial = water;
    this.waterMesh = waterMesh;

    waterMesh.material = water;
    waterMesh.checkCollisions = false; // Submarine can pass through

    return waterMesh;
  }

  // Call this after all entities are created to add them to water reflections
  addWaterReflections(meshes) {
    if (this.waterMaterial && meshes) {
      meshes.forEach(mesh => {
        if (mesh && mesh.isEnabled()) {
          this.waterMaterial.addToRenderList(mesh);
        }
      });
    }
  }

  getDepthAtPosition(position) {
    // Calculate depth based on Y position (0 = surface, negative = underwater)
    return Math.max(0, -position.y);
  }

  isAtSurface(position) {
    return this.getDepthAtPosition(position) <= GAME_CONFIG.SURFACE_THRESHOLD;
  }

  setupUnderwaterAtmosphere() {
    // Setup depth-based fog for underwater atmosphere
    this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    this.scene.fogDensity = 0.015; // Base fog density
    this.scene.fogColor = new BABYLON.Color3(0.05, 0.15, 0.25); // Dark blue-green underwater color

    // Adjust scene ambient and clear color for underwater feel
    this.scene.clearColor = new BABYLON.Color4(0.05, 0.15, 0.25, 1.0);
    this.scene.ambientColor = new BABYLON.Color3(0.1, 0.2, 0.3);

    // Store base fog density for dynamic adjustment
    this.baseFogDensity = 0.015;
  }

  // Update fog density based on depth (call this in update loop)
  updateFogForDepth(depth) {
    if (!this.scene.fogEnabled) return;

    // Increase fog density with depth
    // Shallow (0-20): light fog
    // Medium (20-50): moderate fog
    // Deep (50+): heavy fog
    const depthFactor = Math.min(depth / 100, 1.0); // Normalize to 0-1
    this.scene.fogDensity = this.baseFogDensity + (depthFactor * 0.04);

    // Darken fog color with depth
    const colorFactor = 1.0 - (depthFactor * 0.5); // 1.0 to 0.5
    this.scene.fogColor = new BABYLON.Color3(
      0.05 * colorFactor,
      0.15 * colorFactor,
      0.25 * colorFactor
    );
  }

  createAmbientParticles() {
    // Create floating debris/plankton particle system for atmosphere
    const particleSystem = new BABYLON.ParticleSystem('oceanDebris', 1500, this.scene);

    // Use a simple white particle (we'll tint it)
    particleSystem.particleTexture = new BABYLON.Texture(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAE0lEQVQYV2P8////fwYGBgZGBgYAVfwJ/V5xXCMAAAAASUVORK5CYII=',
      this.scene
    );

    // Emit from large area throughout the ocean
    particleSystem.emitter = new BABYLON.Vector3(0, -30, 0); // Center of ocean
    particleSystem.minEmitBox = new BABYLON.Vector3(-this.bounds / 2, -10, -this.bounds / 2);
    particleSystem.maxEmitBox = new BABYLON.Vector3(this.bounds / 2, -50, this.bounds / 2);

    // Particle appearance
    particleSystem.color1 = new BABYLON.Color4(0.8, 0.9, 1.0, 0.3); // Light blue-white
    particleSystem.color2 = new BABYLON.Color4(0.6, 0.8, 0.9, 0.2);
    particleSystem.colorDead = new BABYLON.Color4(0.5, 0.7, 0.8, 0.0);

    // Particle size
    particleSystem.minSize = 0.05;
    particleSystem.maxSize = 0.2;

    // Particle lifetime
    particleSystem.minLifeTime = 8;
    particleSystem.maxLifeTime = 15;

    // Emission rate
    particleSystem.emitRate = 100;

    // Slow drifting movement
    particleSystem.direction1 = new BABYLON.Vector3(-0.5, 0.2, -0.5);
    particleSystem.direction2 = new BABYLON.Vector3(0.5, 0.5, 0.5);
    particleSystem.minEmitPower = 0.1;
    particleSystem.maxEmitPower = 0.3;
    particleSystem.updateSpeed = 0.01;

    // Gravity (very slight upward drift)
    particleSystem.gravity = new BABYLON.Vector3(0, 0.05, 0);

    // Start the particle system
    particleSystem.start();

    this.ambientParticles = particleSystem;
  }
}
