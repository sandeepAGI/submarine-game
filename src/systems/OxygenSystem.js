/**
 * Oxygen system - manages oxygen depletion and refilling
 */
export class OxygenSystem {
  constructor(ocean) {
    this.ocean = ocean;
    this.onOxygenDepleted = null; // Callback for when oxygen runs out
  }

  update(deltaTime, entities) {
    const submarine = entities.submarine;
    if (!submarine) return;

    // Update submarine depth status
    submarine.updateDepth(this.ocean);

    // Handle oxygen depletion/refill
    if (submarine.isUnderwater) {
      submarine.depleteOxygen(deltaTime);

      // Check if oxygen depleted
      if (submarine.isOutOfOxygen() && this.onOxygenDepleted) {
        this.onOxygenDepleted();
      }
    } else {
      submarine.refillOxygen(deltaTime);
    }
  }

  setOxygenDepletedCallback(callback) {
    this.onOxygenDepleted = callback;
  }
}
