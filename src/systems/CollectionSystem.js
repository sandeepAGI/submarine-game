import { GAME_CONFIG } from '../data/config.js';

/**
 * Collection system - handles sample collection
 */
export class CollectionSystem {
  constructor(input) {
    this.input = input;
    this.onSampleCollected = null; // Callback
  }

  update(deltaTime, entities) {
    const submarine = entities.submarine;
    if (!submarine) return;

    // Check for collection input (E key)
    if (this.input.isKeyPressed('e') && submarine.canCollectMore()) {
      this.tryCollectNearestSample(submarine, entities.samples);
    }
  }

  tryCollectNearestSample(submarine, samples) {
    if (samples.length === 0) return;

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

        // Trigger callback
        if (this.onSampleCollected) {
          this.onSampleCollected(sampleData);
        }
      }
    }
  }

  setSampleCollectedCallback(callback) {
    this.onSampleCollected = callback;
  }
}
