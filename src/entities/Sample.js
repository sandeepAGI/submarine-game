import * as BABYLON from '@babylonjs/core';

/**
 * Sample entity - collectible specimens
 */
export class Sample {
  constructor(scene, sampleData, position) {
    this.scene = scene;
    this.data = sampleData;
    this.position = position;
    this.mesh = null;
    this.collected = false;

    this.create();
  }

  create() {
    // Create sample mesh based on type
    const size = this.data.size || 1;

    // Different shapes for different sample types
    let shape;
    switch (this.data.id) {
      case 'kelp':
        shape = BABYLON.MeshBuilder.CreateCylinder(
          `sample_${this.data.id}`,
          { height: size * 2, diameter: size * 0.3 },
          this.scene
        );
        break;
      case 'shell':
        shape = BABYLON.MeshBuilder.CreateSphere(
          `sample_${this.data.id}`,
          { diameter: size, segments: 8 },
          this.scene
        );
        break;
      case 'coral':
        shape = BABYLON.MeshBuilder.CreateBox(
          `sample_${this.data.id}`,
          { size: size },
          this.scene
        );
        break;
      case 'smallfish':
        shape = BABYLON.MeshBuilder.CreateCapsule(
          `sample_${this.data.id}`,
          { radius: size * 0.2, height: size * 0.8 },
          this.scene
        );
        break;
      case 'starfish':
        shape = BABYLON.MeshBuilder.CreateTorus(
          `sample_${this.data.id}`,
          { diameter: size, thickness: size * 0.2, tessellation: 5 },
          this.scene
        );
        break;
      default:
        shape = BABYLON.MeshBuilder.CreateSphere(
          `sample_${this.data.id}`,
          { diameter: size },
          this.scene
        );
    }

    this.mesh = shape;
    this.mesh.position = this.position.clone();

    // Create material with sample color
    const mat = new BABYLON.StandardMaterial(`sampleMat_${this.data.id}`, this.scene);

    // Parse color string (hex format)
    const color = this.parseColor(this.data.color);
    mat.diffuseColor = color;
    mat.emissiveColor = color.scale(0.2); // Slight glow

    this.mesh.material = mat;

    // Add subtle floating animation
    this.addFloatingAnimation();

    return this;
  }

  parseColor(hexColor) {
    // Convert hex color to BABYLON.Color3
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    return new BABYLON.Color3(r, g, b);
  }

  addFloatingAnimation() {
    // Simple up-down floating animation
    const baseY = this.position.y;
    const amplitude = 0.3;
    const frequency = 1 + Math.random() * 0.5;

    this.scene.registerBeforeRender(() => {
      if (!this.collected && this.mesh) {
        const time = performance.now() * 0.001;
        this.mesh.position.y = baseY + Math.sin(time * frequency) * amplitude;
        this.mesh.rotation.y += 0.01;
      }
    });
  }

  distanceTo(position) {
    return BABYLON.Vector3.Distance(this.position, position);
  }

  collect() {
    this.collected = true;
    if (this.mesh) {
      this.mesh.dispose();
      this.mesh = null;
    }
  }

  dispose() {
    if (this.mesh) {
      this.mesh.dispose();
      this.mesh = null;
    }
  }
}
