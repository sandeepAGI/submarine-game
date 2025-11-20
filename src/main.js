import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import { Engine } from './core/Engine.js';
import { Input } from './core/Input.js';
import { Ocean } from './world/Ocean.js';
import { Submarine } from './entities/Submarine.js';
import { Sample } from './entities/Sample.js';
import { ResearchShip } from './entities/ResearchShip.js';
import { MovementSystem } from './systems/MovementSystem.js';
import { OxygenSystem } from './systems/OxygenSystem.js';
import { CollectionSystem } from './systems/CollectionSystem.js';
import { QuestSystem } from './systems/QuestSystem.js';
import { UpgradeSystem } from './systems/UpgradeSystem.js';
import { HUD } from './ui/HUD.js';
import { ResearchShipUI } from './ui/ResearchShipUI.js';
import { HelpUI } from './ui/HelpUI.js';
import samplesData from './data/samples.json';

/**
 * Main Game Class
 */
class Game {
  constructor() {
    this.engine = null;
    this.input = null;
    this.ocean = null;
    this.submarine = null;
    this.researchShip = null;
    this.hud = null;
    this.researchShipUI = null;
    this.helpUI = null;
    this.guiTexture = null; // For floating labels

    // Game state
    this.credits = 0;
    this.gameStarted = false;
    this.lastUIOpenTime = 0;
    this.uiOpenCooldown = 0.5; // 500ms cooldown

    // Systems
    this.questSystem = null;
    this.upgradeSystem = null;
    this.movementSystem = null;
    this.oxygenSystem = null;
    this.collectionSystem = null;
  }

  async init() {
    const canvas = document.getElementById('renderCanvas');

    // Create engine
    this.engine = new Engine(canvas);
    this.engine.init();

    // Create input system
    this.input = new Input(this.engine.scene);

    // Create GUI texture for floating labels
    this.guiTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI', true, this.engine.scene);

    // Create ocean
    this.ocean = new Ocean(this.engine.scene);
    this.ocean.create();

    // Create research ship at surface
    this.researchShip = new ResearchShip(this.engine.scene);
    this.engine.addEntity('researchShip', this.researchShip);

    // Create submarine
    this.submarine = new Submarine(this.engine.scene, this.engine.camera);
    this.engine.addEntity('submarine', this.submarine);

    // Spawn samples
    this.spawnSamples(15);

    // Create game systems
    this.questSystem = new QuestSystem();
    this.upgradeSystem = new UpgradeSystem();

    this.movementSystem = new MovementSystem(this.input);
    this.oxygenSystem = new OxygenSystem(this.ocean);
    this.collectionSystem = new CollectionSystem(this.input);

    // Setup oxygen depletion callback
    this.oxygenSystem.setOxygenDepletedCallback(() => {
      this.handleOxygenDepleted();
    });

    // Setup collection callback
    this.collectionSystem.setSampleCollectedCallback((sample) => {
      this.handleSampleCollected(sample);
    });

    // Add systems to engine
    this.engine.addSystem(this.movementSystem);
    this.engine.addSystem(this.oxygenSystem);
    this.engine.addSystem(this.collectionSystem);

    // Add HUD update system
    this.engine.addSystem({
      update: () => this.updateHUD(),
    });

    // Add label update system
    this.engine.addSystem({
      update: () => this.updateSampleLabels(),
    });

    // Add research ship interaction system
    this.engine.addSystem({
      update: () => this.checkResearchShipInteraction(),
    });

    // Create UI
    this.hud = new HUD();
    this.researchShipUI = new ResearchShipUI(this.questSystem, this.upgradeSystem);
    this.helpUI = new HelpUI();

    // Setup UI callbacks
    this.researchShipUI.setCallbacks({
      onQuestAccepted: (quest) => this.handleQuestAccepted(quest),
      onQuestCompleted: (quest, reward) => this.handleQuestCompleted(quest, reward),
      onUpgradePurchased: (result) => this.handleUpgradePurchased(result),
    });

    // Expose UI to window for button onclick handlers
    window.researchShipUI = this.researchShipUI;
    window.game = this;

    // Start game
    this.engine.start();
    this.gameStarted = true;

    // Show tutorial messages
    setTimeout(() => {
      this.hud.showMessage('=== WELCOME TO SUBMARINE SAMPLE COLLECTION ===', 5000);
    }, 500);

    setTimeout(() => {
      this.hud.showMessage('Press H for HELP & CONTROLS anytime!', 5000);
    }, 2000);

    setTimeout(() => {
      this.hud.showMessage('OBJECTIVE: Press E at the ORANGE RESEARCH SHIP to accept a quest', 6000);
    }, 4000);

    setTimeout(() => {
      this.hud.showMessage('The orange ship is right in front of you! Swim to it and press E', 6000);
    }, 6500);
  }

  spawnSamples(count) {
    const samples = samplesData.samples;
    const oceanSize = 200;
    const minDepth = -10;
    const maxDepth = -45;

    for (let i = 0; i < count; i++) {
      // Random sample type
      const sampleData = samples[Math.floor(Math.random() * samples.length)];

      // Random position
      const x = (Math.random() - 0.5) * oceanSize * 0.8;
      const z = (Math.random() - 0.5) * oceanSize * 0.8;
      const y = minDepth + Math.random() * (maxDepth - minDepth);

      const position = new BABYLON.Vector3(x, y, z);
      const sample = new Sample(this.engine.scene, sampleData, position, this.guiTexture);

      this.engine.addEntity('sample', sample);
    }
  }

  updateHUD() {
    const gameState = {
      oxygenPercent: this.submarine.getOxygenPercentage(),
      depth: this.submarine.depth,
      credits: this.credits,
      inventoryCount: this.submarine.inventory.length,
      inventoryMax: this.submarine.inventoryCapacity,
      activeQuest: this.questSystem.getActiveQuest(),
      inventory: this.submarine.inventory,
    };

    this.hud.update(gameState);
  }

  updateSampleLabels() {
    // Update label visibility for all samples based on submarine position
    const submarinePos = this.submarine.position;
    const samples = this.engine.entities.samples;

    for (const sample of samples) {
      if (sample && !sample.collected) {
        sample.updateLabelVisibility(submarinePos, 8); // Show labels within 8 units
      }
    }
  }

  checkResearchShipInteraction() {
    // Check if at surface and near research ship (position 0,0,0)
    const atSurface = this.ocean.isAtSurface(this.submarine.position);
    const nearShip = this.submarine.position.length() < 10; // Within 10 meters of origin

    // Update cooldown timer
    this.lastUIOpenTime += this.engine.engine.getDeltaTime() / 1000;

    // Listen for E key to open UI with cooldown
    if (atSurface && nearShip && this.input.isKeyPressed('e') &&
        !this.researchShipUI.isOpen() && this.lastUIOpenTime >= this.uiOpenCooldown) {
      this.openResearchShipUI();
      this.lastUIOpenTime = 0; // Reset cooldown
    }
  }

  openResearchShipUI() {
    this.researchShipUI.open(this.submarine, this.credits);
    this.hud.showMessage('Research Ship Interface Opened');
  }

  closeUI() {
    this.researchShipUI.close();
  }

  handleSampleCollected(sample) {
    this.hud.showMessage(`Collected: ${sample.name}`);
  }

  handleQuestAccepted(quest) {
    this.hud.showMessage(`Quest Accepted: ${quest.name}`);
  }

  handleQuestCompleted(quest, reward) {
    this.credits += reward;
    this.hud.showMessage(`Quest Completed! +${reward} credits`);
  }

  handleUpgradePurchased(result) {
    this.credits -= result.cost;

    // Apply upgrade to submarine
    if (result.category === 'oxygen') {
      this.submarine.upgradeOxygen(result.upgrade.maxOxygen);
      this.hud.showMessage(`Upgraded: ${result.upgrade.name}`);
    } else if (result.category === 'speed') {
      this.submarine.upgradeSpeed(result.upgrade.speedMultiplier);
      this.hud.showMessage(`Upgraded: ${result.upgrade.name}`);
    }
  }

  handleOxygenDepleted() {
    this.hud.showMessage('OXYGEN DEPLETED! Respawning...', 2000);

    // Respawn submarine
    setTimeout(() => {
      this.submarine.respawn();
      this.hud.showMessage('Respawned at surface. Inventory lost.');
    }, 2000);
  }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.init();
});
