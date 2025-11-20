import { GAME_CONFIG } from '../data/config.js';

/**
 * Collection system - handles sample collection
 */
export class CollectionSystem {
  constructor(input) {
    this.input = input;
    this.onSampleCollected = null; // Callback
    this.lastCollectTime = 0;
    this.collectCooldown = 0.3; // 300ms cooldown between collections
  }

  update(deltaTime, entities) {
    const submarine = entities.submarine;
    if (!submarine) return;

    this.lastCollectTime += deltaTime;

    // Check for collection input (E key) with cooldown
    if (this.input.isKeyPressed('e') && submarine.canCollectMore() && this.lastCollectTime >= this.collectCooldown) {
      if (this.tryCollectNearestSample(submarine, entities.samples)) {
        this.lastCollectTime = 0; // Reset cooldown timer
      }
    }
  }

  tryCollectNearestSample(submarine, samples) {
    if (samples.length === 0) return false;

    // Find nearest uncollected sample within range
    let nearest = null;
    let nearestDistance = GAME_CONFIG.COLLECTION_RANGE;

    for (const sample of samples) {
      if (sample.collected) continue;

      const distance = sample.distanceTo(submarine.position);
      if (distance < nearestDistance) {
        nearest = sample;
        nearestDistance = distance;
      }
    }

    // Collect the sample
    if (nearest) {
      const sampleData = nearest.data;
      if (submarine.addToInventory(sampleData)) {
        nearest.collect();

        // Trigger callback with both sample entity and data
        if (this.onSampleCollected) {
          this.onSampleCollected(nearest, sampleData);
        }
        return true;
      }
    }

    return false;
  }

  setSampleCollectedCallback(callback) {
    this.onSampleCollected = callback;
  }
}
