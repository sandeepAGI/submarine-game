/**
 * Research Ship UI - manages the ship interface (quests, upgrades, repairs)
 */
export class ResearchShipUI {
  constructor(questSystem, upgradeSystem) {
    this.questSystem = questSystem;
    this.upgradeSystem = upgradeSystem;

    this.modal = document.getElementById('ui-modal');
    this.questSection = document.getElementById('quest-section');
    this.upgradeSection = document.getElementById('upgrade-section');
    this.activeQuestDisplay = document.getElementById('active-quest-display');
    this.questActions = document.getElementById('quest-actions');
    this.upgradeList = document.getElementById('upgrade-list');

    this.onQuestAccepted = null;
    this.onQuestCompleted = null;
    this.onUpgradePurchased = null;

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // Close UI on ESC key
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  open(submarine, credits) {
    this.submarine = submarine;
    this.credits = credits;

    this.updateQuestSection();
    this.updateUpgradeSection();

    this.modal.classList.add('active');

    // Pause game / unlock pointer
    return true;
  }

  close() {
    this.modal.classList.remove('active');
  }

  isOpen() {
    return this.modal.classList.contains('active');
  }

  updateQuestSection() {
    const activeQuest = this.questSystem.getActiveQuest();

    if (activeQuest) {
      // Show active quest
      let html = '<p><strong>Active Quest:</strong> ' + activeQuest.name + '</p>';
      html += '<p>' + activeQuest.description + '</p>';
      html += '<ul>';
      for (const obj of activeQuest.objectives) {
        const collected = this.submarine.inventory.filter(s => s.id === obj.sampleId).length;
        html += `<li>${obj.sampleName}: ${collected}/${obj.count}</li>`;
      }
      html += '</ul>';
      html += `<p>Reward: ${activeQuest.reward} credits</p>`;

      this.activeQuestDisplay.innerHTML = html;

      // Check if can complete
      if (this.questSystem.checkQuestCompletion(this.submarine.inventory)) {
        this.questActions.innerHTML = `
          <button class="button" onclick="window.researchShipUI.completeQuest()">
            COMPLETE QUEST
          </button>
        `;
      } else {
        this.questActions.innerHTML = '<p style="color: #ff6666;">Quest objectives not met.</p>';
      }
    } else {
      // No active quest, offer starter quest
      this.activeQuestDisplay.innerHTML = '<p>No active quest.</p>';
      this.questActions.innerHTML = `
        <button class="button" onclick="window.researchShipUI.acceptQuest()">
          ACCEPT QUEST: First Collection
        </button>
      `;
    }
  }

  updateUpgradeSection() {
    const availableUpgrades = this.upgradeSystem.getAvailableUpgrades(this.credits);

    if (availableUpgrades.length === 0) {
      this.upgradeList.innerHTML = '<p>All upgrades purchased!</p>';
      return;
    }

    let html = '';
    for (const upgrade of availableUpgrades) {
      const disabled = !upgrade.canAfford;
      html += `<div class="upgrade-item">`;
      html += `<strong>${upgrade.name}</strong><br>`;
      html += `${upgrade.description}<br>`;
      html += `Cost: ${upgrade.cost} credits<br>`;

      if (disabled) {
        html += `<button class="button" disabled>NOT ENOUGH CREDITS</button>`;
      } else {
        html += `<button class="button" onclick="window.researchShipUI.purchaseUpgrade('${upgrade.category}', ${upgrade.tier})">
          PURCHASE
        </button>`;
      }

      html += `</div>`;
    }

    this.upgradeList.innerHTML = html;
  }

  acceptQuest() {
    const quest = this.questSystem.createStarterQuest();
    if (this.onQuestAccepted) {
      this.onQuestAccepted(quest);
    }
    this.updateQuestSection();
  }

  completeQuest() {
    const result = this.questSystem.completeQuest(this.submarine.inventory);
    if (result && this.onQuestCompleted) {
      this.onQuestCompleted(result.quest, result.reward);
      this.submarine.clearInventory();
    }
    this.updateQuestSection();
  }

  purchaseUpgrade(category, tier) {
    const result = this.upgradeSystem.purchaseUpgrade(category, tier, this.credits);

    if (result.success && this.onUpgradePurchased) {
      this.onUpgradePurchased(result);
      // Credits are deducted in the callback (main.js handleUpgradePurchased)
      // Update local UI credits to match
      this.credits -= result.cost;
    } else {
      alert(result.message);
    }

    // Refresh UI to show updated state
    this.updateUpgradeSection();
  }

  setCallbacks(callbacks) {
    this.onQuestAccepted = callbacks.onQuestAccepted;
    this.onQuestCompleted = callbacks.onQuestCompleted;
    this.onUpgradePurchased = callbacks.onUpgradePurchased;
  }
}
