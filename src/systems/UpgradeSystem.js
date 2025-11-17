import upgradesData from '../data/upgrades.json';

/**
 * Upgrade system - manages submarine upgrades
 */
export class UpgradeSystem {
  constructor() {
    this.currentUpgrades = {
      oxygen: 1,
      speed: 1,
    };
    this.upgradesData = upgradesData;
  }

  getAvailableUpgrades(credits) {
    const available = [];

    // Check oxygen upgrades
    const nextOxygenTier = this.currentUpgrades.oxygen + 1;
    if (nextOxygenTier <= this.upgradesData.oxygen.length) {
      const upgrade = this.upgradesData.oxygen[nextOxygenTier - 1];
      available.push({
        category: 'oxygen',
        tier: nextOxygenTier,
        ...upgrade,
        canAfford: credits >= upgrade.cost,
      });
    }

    // Check speed upgrades
    const nextSpeedTier = this.currentUpgrades.speed + 1;
    if (nextSpeedTier <= this.upgradesData.speed.length) {
      const upgrade = this.upgradesData.speed[nextSpeedTier - 1];
      available.push({
        category: 'speed',
        tier: nextSpeedTier,
        ...upgrade,
        canAfford: credits >= upgrade.cost,
      });
    }

    return available;
  }

  purchaseUpgrade(category, tier, credits) {
    const upgradeData = this.upgradesData[category];
    if (!upgradeData || tier > upgradeData.length) {
      return { success: false, message: 'Invalid upgrade' };
    }

    const upgrade = upgradeData[tier - 1];

    // Check if can afford
    if (credits < upgrade.cost) {
      return { success: false, message: 'Not enough credits' };
    }

    // Check if correct tier
    if (tier !== this.currentUpgrades[category] + 1) {
      return { success: false, message: 'Must purchase upgrades in order' };
    }

    // Purchase successful
    this.currentUpgrades[category] = tier;

    return {
      success: true,
      category,
      tier,
      upgrade,
      cost: upgrade.cost,
    };
  }

  getCurrentUpgrade(category) {
    const tier = this.currentUpgrades[category];
    return this.upgradesData[category][tier - 1];
  }
}
