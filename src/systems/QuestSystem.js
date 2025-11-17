import samplesData from '../data/samples.json';

/**
 * Quest system - manages quests (Phase 1: single manual quest)
 */
export class QuestSystem {
  constructor() {
    this.activeQuest = null;
    this.onQuestCompleted = null;
  }

  // Create a simple starter quest
  createStarterQuest() {
    const samples = samplesData.samples;

    // Simple quest: collect 2 kelp and 1 shell
    this.activeQuest = {
      id: 'starter_1',
      name: 'First Collection',
      description: 'Collect your first samples for the research team.',
      objectives: [
        {
          sampleId: 'kelp',
          sampleName: 'Kelp',
          count: 2,
        },
        {
          sampleId: 'shell',
          sampleName: 'Conch Shell',
          count: 1,
        },
      ],
      reward: 100,
      completed: false,
    };

    return this.activeQuest;
  }

  getActiveQuest() {
    return this.activeQuest;
  }

  checkQuestCompletion(inventory) {
    if (!this.activeQuest || this.activeQuest.completed) {
      return false;
    }

    // Check if all objectives are met
    for (const objective of this.activeQuest.objectives) {
      const collected = inventory.filter(s => s.id === objective.sampleId).length;
      if (collected < objective.count) {
        return false;
      }
    }

    return true;
  }

  completeQuest(inventory) {
    if (!this.activeQuest) return null;

    if (this.checkQuestCompletion(inventory)) {
      this.activeQuest.completed = true;

      const reward = this.activeQuest.reward;
      const completedQuest = this.activeQuest;

      // Clear quest
      this.activeQuest = null;

      // Trigger callback
      if (this.onQuestCompleted) {
        this.onQuestCompleted(completedQuest, reward);
      }

      return { quest: completedQuest, reward };
    }

    return null;
  }

  setQuestCompletedCallback(callback) {
    this.onQuestCompleted = callback;
  }
}
