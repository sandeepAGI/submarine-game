import * as BABYLON from '@babylonjs/core';

/**
 * Main game engine - handles scene creation, game loop, and system management
 */
export class Engine {
  constructor(canvas) {
    this.canvas = canvas;
    this.engine = new BABYLON.Engine(canvas, true);
    this.scene = null;
    this.camera = null;
    this.systems = [];
    this.entities = {
      submarine: null,
      samples: [],
      researchShip: null,
    };
    this.running = false;
  }

  /**
   * Initialize the game engine and create the scene
   */
  init() {
    this.createScene();
    this.setupCamera();
    this.setupLighting();

    // Handle window resize
    window.addEventListener('resize', () => {
      this.engine.resize();
    });

    return this;
  }

  /**
   * Create the main game scene
   */
  createScene() {
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0.1, 0.2, 1); // Dark blue ocean
    this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    this.scene.fogDensity = 0.01;
    this.scene.fogColor = new BABYLON.Color3(0, 0.2, 0.4);

    // Enable collisions
    this.scene.collisionsEnabled = true;

    return this.scene;
  }

  /**
   * Setup camera - third-person arc rotate camera
   */
  setupCamera() {
    // Create an arc rotate camera (third-person)
    // Alpha = horizontal rotation, Beta = vertical angle, Radius = distance from target
    this.camera = new BABYLON.ArcRotateCamera(
      'camera',
      Math.PI / 2,  // Alpha: start facing forward (90 degrees)
      Math.PI / 3,  // Beta: 60 degrees from horizontal (slight top-down view)
      12,           // Radius: 12 units behind submarine
      new BABYLON.Vector3(0, 0, 0), // Target (will be set to submarine position later)
      this.scene
    );

    // Camera limits
    this.camera.lowerRadiusLimit = 5;   // Minimum zoom distance
    this.camera.upperRadiusLimit = 25;  // Maximum zoom distance
    this.camera.lowerBetaLimit = 0.1;   // Prevent camera going below submarine
    this.camera.upperBetaLimit = (Math.PI / 2) - 0.1; // Prevent camera going completely horizontal

    // Camera settings
    this.camera.minZ = 0.1;
    this.camera.maxZ = 500;
    this.camera.wheelPrecision = 10; // Mouse wheel zoom sensitivity
    this.camera.panningSensibility = 0; // Disable panning (right-click drag)
    this.camera.angularSensibilityX = 500; // Mouse rotation sensitivity (horizontal)
    this.camera.angularSensibilityY = 500; // Mouse rotation sensitivity (vertical)

    // Attach controls to canvas (allows mouse rotation)
    this.camera.attachControl(this.canvas, true);

    return this.camera;
  }

  /**
   * Setup scene lighting
   */
  setupLighting() {
    // Ambient light (underwater has low ambient light)
    const ambient = new BABYLON.HemisphericLight(
      'ambient',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    ambient.intensity = 0.4;
    ambient.diffuse = new BABYLON.Color3(0.3, 0.4, 0.6);

    // Directional light (from surface)
    const sun = new BABYLON.DirectionalLight(
      'sun',
      new BABYLON.Vector3(0, -1, 0.5),
      this.scene
    );
    sun.intensity = 0.6;
    sun.diffuse = new BABYLON.Color3(0.6, 0.7, 0.9);

    return { ambient, sun };
  }

  /**
   * Register a system to be updated each frame
   */
  addSystem(system) {
    this.systems.push(system);
    return this;
  }

  /**
   * Add an entity to the game
   */
  addEntity(type, entity) {
    if (type === 'sample') {
      this.entities.samples.push(entity);
    } else {
      this.entities[type] = entity;
    }
    return this;
  }

  /**
   * Remove an entity from the game
   */
  removeEntity(type, entity) {
    if (type === 'sample') {
      const index = this.entities.samples.indexOf(entity);
      if (index > -1) {
        this.entities.samples.splice(index, 1);
      }
    }
    return this;
  }

  /**
   * Start the game loop
   */
  start() {
    this.running = true;

    // Main render loop
    this.engine.runRenderLoop(() => {
      if (!this.running) return;

      const deltaTime = this.engine.getDeltaTime() / 1000; // Convert to seconds

      // Update all systems
      for (const system of this.systems) {
        if (system.update) {
          system.update(deltaTime, this.entities, this.scene);
        }
      }

      // Render scene
      this.scene.render();
    });

    return this;
  }

  /**
   * Stop the game loop
   */
  stop() {
    this.running = false;
    return this;
  }

  /**
   * Clean up and dispose resources
   */
  dispose() {
    this.stop();
    this.scene.dispose();
    this.engine.dispose();
  }
}
