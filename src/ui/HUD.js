/**
 * HUD - Heads-Up Display UI management
 */
export class HUD {
  constructor() {
    // Get HUD elements
    this.oxygenValue = document.getElementById('oxygen-value');
    this.oxygenBar = document.getElementById('oxygen-bar');
    this.depthValue = document.getElementById('depth-value');
    this.creditsValue = document.getElementById('credits-value');
    this.questDisplay = document.getElementById('quest-display');
    this.inventoryCount = document.getElementById('inventory-count');
    this.inventoryMax = document.getElementById('inventory-max');
    this.messageLog = document.getElementById('message-log');
  }

  update(gameState) {
    // Update oxygen
    const oxygenPercent = gameState.oxygenPercent || 0;
    this.oxygenValue.textContent = oxygenPercent;
    this.oxygenBar.style.width = `${oxygenPercent}%`;

    // Change color if low
    if (oxygenPercent <= 20) {
      this.oxygenBar.classList.add('low');
    } else {
      this.oxygenBar.classList.remove('low');
    }

    // Update depth
    this.depthValue.textContent = Math.round(gameState.depth || 0);

    // Update credits
    this.creditsValue.textContent = gameState.credits || 0;

    // Update inventory
    this.inventoryCount.textContent = gameState.inventoryCount || 0;
    this.inventoryMax.textContent = gameState.inventoryMax || 5;

    // Update quest display
    if (gameState.activeQuest) {
      this.updateQuestDisplay(gameState.activeQuest, gameState.inventory);
    } else {
      this.questDisplay.innerHTML = '<div class="quest-item"><strong>NO ACTIVE QUEST</strong><br>Surface near the ORANGE SHIP<br>Press [E] to interact</div>';
    }
  }

  updateQuestDisplay(quest, inventory) {
    let html = `<div class="quest-item">`;
    html += `<strong>${quest.name}</strong><br>`;

    // Show progress for each objective
    for (const objective of quest.objectives) {
      const collected = this.countSampleInInventory(objective.sampleId, inventory);
      const required = objective.count;
      const complete = collected >= required;

      html += `<span style="color: ${complete ? '#00ff88' : '#ffffff'}">`;
      html += `${objective.sampleName}: ${collected}/${required}`;
      html += `</span><br>`;
    }

    html += `Reward: ${quest.reward} credits</div>`;
    this.questDisplay.innerHTML = html;
  }

  countSampleInInventory(sampleId, inventory) {
    return inventory.filter(s => s.id === sampleId).length;
  }

  showMessage(text, duration = 3000) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = text;

    this.messageLog.appendChild(messageDiv);

    // Remove after duration
    setTimeout(() => {
      messageDiv.remove();
    }, duration);
  }
}
