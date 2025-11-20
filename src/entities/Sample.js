import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import '@babylonjs/loaders/glTF'; // Required for GLB loading

/**
 * Sample entity - collectible specimens
 */
export class Sample {
  constructor(scene, sampleData, position, guiTexture) {
    this.scene = scene;
    this.data = sampleData;
    this.position = position;
    this.mesh = null;
    this.label = null;
    this.guiTexture = guiTexture; // Shared GUI texture for all labels
    this.collected = false;

    this.create();
  }

  create() {
    // Create fallback mesh immediately (synchronous)
    this.mesh = this.createFallbackMesh();
    this.mesh.position = this.position.clone();

    // Create floating label
    this.createLabel();

    // Add subtle floating animation
    this.addFloatingAnimation();

    // Try to load 3D model in background (will replace fallback if found)
    this.loadModel();
  }

  async loadModel() {
    try {
      // Attempt to load GLB model for this sample type
      const result = await BABYLON.SceneLoader.ImportMeshAsync(
        '',
        'src/assets/models/samples/',
        `${this.data.id}.glb`,
        this.scene
      );

      if (result.meshes && result.meshes.length > 0) {
        // Model loaded successfully - replace fallback
        const oldMesh = this.mesh;
        this.mesh = result.meshes[0];
        this.mesh.position = oldMesh.position.clone();
        const scale = (this.data.size || 1) * 2;
        this.mesh.scaling = new BABYLON.Vector3(scale, scale, scale);

        // Re-link label to new mesh
        if (this.label) {
          this.label.linkWithMesh(this.mesh);
        }

        // Dispose old fallback mesh
        oldMesh.dispose();

        console.log(`${this.data.name} 3D model loaded successfully`);
      }
    } catch (error) {
      // Keep using fallback mesh
      console.log(`${this.data.name} 3D model not found, using fallback shape`);
    }
  }

  createLabel() {
    if (!this.guiTexture) return;

    // Create label container
    this.label = new GUI.Rectangle(`label_${this.data.id}`);
    this.label.width = '150px';
    this.label.height = '50px';
    this.label.cornerRadius = 8;
    this.label.color = 'white';
    this.label.thickness = 2;
    this.label.background = 'rgba(0, 0, 0, 0.7)';
    this.label.alpha = 0.9;

    // Sample name text
    const nameText = new GUI.TextBlock();
    nameText.text = this.data.name;
    nameText.color = this.data.color || 'white';
    nameText.fontSize = 16;
    nameText.fontWeight = 'bold';
    this.label.addControl(nameText);

    // Type indicator (smaller text)
    const typeText = new GUI.TextBlock();
    typeText.text = this.data.type || '';
    typeText.color = 'lightgray';
    typeText.fontSize = 11;
    typeText.top = '18px';
    this.label.addControl(typeText);

    // Add to GUI texture
    this.guiTexture.addControl(this.label);

    // Link label to mesh (will follow mesh position)
    this.label.linkWithMesh(this.mesh);
    this.label.linkOffsetY = -60; // Position above mesh

    // Initially hide label (will show when player gets close)
    this.label.isVisible = false;
  }

  updateLabelVisibility(playerPosition, maxDistance = 8) {
    // If label doesn't exist, sample was collected (label disposed)
    if (!this.label) return;

    // Use mesh.position (updated by animation) instead of cached this.position
    const distance = BABYLON.Vector3.Distance(playerPosition, this.mesh.position);

    if (distance < maxDistance) {
      // Fade in based on distance
      const alpha = 1 - (distance / maxDistance);
      this.label.alpha = alpha * 0.9; // Max 0.9 opacity
      this.label.isVisible = true;
    } else {
      this.label.isVisible = false;
    }
  }

  createFallbackMesh() {
    // Create improved sample mesh based on type
    // Sizes are 5x larger than realistic for gameplay visibility
    const size = (this.data.size || 1) * 5;

    // Different shapes for different sample types - more distinctive
    let shape;
    switch (this.data.id) {
      case 'kelp':
        // Tall waving plant
        shape = BABYLON.MeshBuilder.CreateCylinder(
          `sample_${this.data.id}`,
          { height: size * 3, diameter: size * 0.4, tessellation: 12 },
          this.scene
        );
        break;
      case 'shell':
        // Spiraled shell shape (torus + sphere)
        const shellParent = new BABYLON.TransformNode(`sample_${this.data.id}`, this.scene);
        const shellBody = BABYLON.MeshBuilder.CreateSphere(
          'shellBody',
          { diameter: size * 1.2, segments: 12 },
          this.scene
        );
        shellBody.scaling.y = 0.7; // Flatten slightly
        shellBody.parent = shellParent;

        const shellSpiral = BABYLON.MeshBuilder.CreateTorus(
          'shellSpiral',
          { diameter: size * 0.8, thickness: size * 0.15, tessellation: 16 },
          this.scene
        );
        shellSpiral.position.y = size * 0.3;
        shellSpiral.rotation.x = Math.PI / 4;
        shellSpiral.parent = shellParent;

        shape = shellParent;
        break;
      case 'coral':
        // Branching coral structure
        const coralParent = new BABYLON.TransformNode(`sample_${this.data.id}`, this.scene);

        // Main trunk
        const trunk = BABYLON.MeshBuilder.CreateCylinder(
          'coralTrunk',
          { height: size * 1.5, diameter: size * 0.4, tessellation: 8 },
          this.scene
        );
        trunk.parent = coralParent;

        // Branches
        for (let i = 0; i < 4; i++) {
          const branch = BABYLON.MeshBuilder.CreateCylinder(
            `coralBranch${i}`,
            { height: size * 0.8, diameter: size * 0.2, tessellation: 6 },
            this.scene
          );
          branch.position.y = size * (0.2 + i * 0.3);
          branch.rotation.z = Math.PI / 3;
          branch.rotation.y = (Math.PI / 2) * i;
          branch.parent = coralParent;
        }

        shape = coralParent;
        break;
      case 'smallfish':
        // Fish-like body with tail
        const fishParent = new BABYLON.TransformNode(`sample_${this.data.id}`, this.scene);

        const body = BABYLON.MeshBuilder.CreateSphere(
          'fishBody',
          { diameter: size, segments: 12 },
          this.scene
        );
        body.scaling.x = 0.6;
        body.scaling.z = 1.4;
        body.parent = fishParent;

        const tail = BABYLON.MeshBuilder.CreateCylinder(
          'fishTail',
          { height: size * 0.6, diameterTop: 0, diameterBottom: size * 0.5, tessellation: 3 },
          this.scene
        );
        tail.rotation.x = Math.PI / 2;
        tail.position.z = -size * 0.8;
        tail.parent = fishParent;

        fishParent.rotation.y = Math.PI / 2; // Face forward
        shape = fishParent;
        break;
      case 'starfish':
        // Five-armed starfish
        const starParent = new BABYLON.TransformNode(`sample_${this.data.id}`, this.scene);

        // Center body
        const center = BABYLON.MeshBuilder.CreateCylinder(
          'starCenter',
          { height: size * 0.3, diameter: size * 0.8, tessellation: 16 },
          this.scene
        );
        center.parent = starParent;

        // Five arms
        for (let i = 0; i < 5; i++) {
          const arm = BABYLON.MeshBuilder.CreateCylinder(
            `starArm${i}`,
            { height: size, diameterTop: size * 0.2, diameterBottom: size * 0.4, tessellation: 8 },
            this.scene
          );
          arm.rotation.x = Math.PI / 2;
          arm.position.x = Math.cos((i / 5) * Math.PI * 2) * size * 0.5;
          arm.position.z = Math.sin((i / 5) * Math.PI * 2) * size * 0.5;
          arm.rotation.y = (i / 5) * Math.PI * 2;
          arm.parent = starParent;
        }

        shape = starParent;
        break;
      default:
        shape = BABYLON.MeshBuilder.CreateSphere(
          `sample_${this.data.id}`,
          { diameter: size, segments: 12 },
          this.scene
        );
    }

    // Create material with sample color and strong emissive glow
    const mat = new BABYLON.StandardMaterial(`sampleMat_${this.data.id}`, this.scene);

    // Parse color string (hex format)
    const color = this.parseColor(this.data.color);
    mat.diffuseColor = color;
    mat.emissiveColor = color.scale(0.6); // Strong glow for visibility underwater
    mat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8); // Shiny appearance
    mat.specularPower = 32; // Glossy highlight

    // Apply material to all meshes in shape
    if (shape.getChildMeshes) {
      shape.getChildMeshes().forEach(mesh => {
        mesh.material = mat;
      });
    } else {
      shape.material = mat;
    }

    return shape;
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

    // Store callback reference for cleanup
    this.animationCallback = () => {
      if (!this.collected && this.mesh) {
        const time = performance.now() * 0.001;
        this.mesh.position.y = baseY + Math.sin(time * frequency) * amplitude;
        this.mesh.rotation.y += 0.01;
      }
    };

    this.scene.registerBeforeRender(this.animationCallback);
  }

  distanceTo(position) {
    // Use mesh.position (updated by animation) for accurate distance
    return BABYLON.Vector3.Distance(this.mesh.position, position);
  }

  collect() {
    this.collected = true;

    // Unregister animation callback to prevent memory leak
    if (this.animationCallback) {
      this.scene.unregisterBeforeRender(this.animationCallback);
      this.animationCallback = null;
    }

    if (this.label) {
      this.label.dispose();
      this.label = null;
    }
    if (this.mesh) {
      this.mesh.dispose();
      this.mesh = null;
    }
  }

  dispose() {
    // Unregister animation callback
    if (this.animationCallback) {
      this.scene.unregisterBeforeRender(this.animationCallback);
      this.animationCallback = null;
    }

    if (this.label) {
      this.label.dispose();
      this.label = null;
    }
    if (this.mesh) {
      this.mesh.dispose();
      this.mesh = null;
    }
  }
}
