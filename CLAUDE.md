# CLAUDE.md - Development Guide

## Project: Submarine Sample Collection Game

This document provides architectural guidance, development patterns, and instructions for AI assistants (Claude) working on this project.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Development Workflow](#development-workflow)
5. [Code Patterns & Standards](#code-patterns--standards)
6. [Testing Strategy](#testing-strategy)
7. [Deployment](#deployment)
8. [Common Tasks](#common-tasks)

---

## Project Structure

```
submarine-game/
├── src/
│   ├── index.html              # Entry point
│   ├── main.js                 # Application initialization
│   ├── core/                   # Core game engine
│   │   ├── Engine.js           # Main game loop
│   │   ├── Scene.js            # Scene management
│   │   ├── Input.js            # Input handling
│   │   └── Time.js             # Delta time, frame management
│   ├── entities/               # Game objects
│   │   ├── Submarine.js        # Player submarine
│   │   ├── Sample.js           # Collectible samples
│   │   ├── Creature.js         # Sea creatures (base class)
│   │   └── ResearchShip.js     # Hub/quest ship
│   ├── systems/                # Game systems (ECS-inspired)
│   │   ├── MovementSystem.js   # Handle movement
│   │   ├── CollectionSystem.js # Sample collection logic
│   │   ├── CombatSystem.js     # Damage, attacks
│   │   ├── QuestSystem.js      # Quest generation & tracking
│   │   ├── UpgradeSystem.js    # Upgrade management
│   │   └── OxygenSystem.js     # Oxygen depletion
│   ├── world/                  # Environment & level design
│   │   ├── Ocean.js            # Ocean environment
│   │   ├── DepthZone.js        # Depth zone definitions
│   │   └── BiomeManager.js     # Biome generation
│   ├── ui/                     # User interface
│   │   ├── HUD.js              # In-game HUD
│   │   ├── QuestUI.js          # Quest interface
│   │   ├── UpgradeUI.js        # Upgrade shop
│   │   └── Menu.js             # Menus
│   ├── data/                   # Game data & configuration
│   │   ├── samples.json        # Sample definitions
│   │   ├── creatures.json      # Creature definitions
│   │   ├── upgrades.json       # Upgrade trees
│   │   └── config.js           # Game constants
│   ├── utils/                  # Utilities
│   │   ├── MathUtils.js        # Math helpers
│   │   ├── Random.js           # Random generation
│   │   └── SaveManager.js      # LocalStorage save/load
│   └── assets/                 # Game assets
│       ├── models/             # 3D models
│       ├── textures/           # Textures
│       ├── sounds/             # Audio files
│       └── shaders/            # Custom shaders (if needed)
├── tests/                      # Test files
├── dist/                       # Build output
├── package.json
├── vite.config.js              # Build tool config
├── README.md                   # Requirements document
└── CLAUDE.md                   # This file
```

---

## Technology Stack

### Recommended Stack

**Core:**
- **Game Engine**: Babylon.js (recommended) or Three.js
  - *Babylon.js* preferred for built-in physics, collision, audio, input systems
  - *Three.js* if more lightweight/custom control desired
- **Language**: JavaScript (ES6+) or TypeScript (recommended for larger project)
- **Build Tool**: Vite (fast dev server, hot reload)
- **Package Manager**: npm or pnpm

**Optional Libraries:**
- **UI**: HTML/CSS overlay or Babylon.js GUI
- **State Management**: Simple ES6 classes or Zustand (if complexity grows)
- **Audio**: Howler.js or Babylon.js built-in audio
- **Particle Effects**: Babylon.js particle system

**Development:**
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Vitest (unit tests), Playwright (E2E if needed)

### Initial Setup Commands

```bash
# Initialize project
npm init -y

# Install core dependencies
npm install babylonjs babylonjs-loaders

# Install dev dependencies
npm install -D vite eslint prettier

# Optional: TypeScript
npm install -D typescript @types/node
```

---

## Architecture Overview

### Camera & Player Perspective

**Third-Person Camera** (Changed from first-person after initial UAT)

The game uses a **third-person follow camera** for better spatial awareness and visual feedback:

```javascript
// Camera setup in Engine.js or Submarine.js
const camera = new BABYLON.ArcRotateCamera(
  'camera',
  Math.PI / 2,  // Alpha (horizontal rotation)
  Math.PI / 3,  // Beta (vertical angle)
  10,           // Radius (distance from target)
  BABYLON.Vector3.Zero(),
  scene
);

camera.lowerRadiusLimit = 5;   // Min zoom distance
camera.upperRadiusLimit = 20;  // Max zoom distance
camera.lowerBetaLimit = 0.1;   // Prevent camera going below ground
camera.upperBetaLimit = Math.PI / 2;

// Attach camera to submarine mesh
camera.setTarget(submarine.mesh);
```

**Rationale for Third-Person:**
- Better spatial awareness of surroundings
- Submarine model is visible (provides orientation feedback)
- Easier to see nearby samples and obstacles
- More engaging for collection gameplay
- Industry standard for vehicle-based games

### 3D Asset Pipeline

**Model Format:** GLB (optimized GLTF)
- Single-file format with embedded textures
- Optimized for web delivery
- Supported natively by Babylon.js SceneLoader

**Loading 3D Models:**

```javascript
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders/glTF'; // Required for GLB loading

// Example: Load submarine model
BABYLON.SceneLoader.ImportMesh(
  '',  // Import all meshes
  'assets/models/',  // Path
  'submarine.glb',   // Filename
  scene,
  (meshes) => {
    this.mesh = meshes[0];
    this.mesh.position = startPosition;
    this.mesh.scaling = new BABYLON.Vector3(1, 1, 1);
  }
);

// Example: Load sample model with callback
async loadSampleModel(sampleType) {
  const result = await BABYLON.SceneLoader.ImportMeshAsync(
    '',
    'assets/models/samples/',
    `${sampleType}.glb`,
    this.scene
  );
  return result.meshes[0];
}
```

**Asset Sources:**
- Custom 3D modeling (Blender, Maya, etc.)
- Free asset libraries (Sketchfab, Poly Haven, Quaternius)
- Procedurally generated (for simple shapes)

**Scale Guidelines:**
- Submarine: ~2-4 units (width/height)
- Samples: 1-3 units (3-5x larger than realistic for gameplay visibility)
- Research Ship: 8-12 units (large, visible landmark)

### Visual Identification System

**Babylon.js GUI Floating Labels:**

```javascript
import * as GUI from '@babylonjs/gui';

// Create fullscreen GUI
const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');

// Add label to sample
const label = new GUI.Rectangle('sampleLabel');
label.width = '150px';
label.height = '40px';
label.cornerRadius = 5;
label.color = 'white';
label.thickness = 2;
label.background = 'rgba(0, 0, 0, 0.7)';

const text = new GUI.TextBlock();
text.text = sample.name;
text.color = 'white';
text.fontSize = 14;
label.addControl(text);

advancedTexture.addControl(label);
label.linkWithMesh(sample.mesh);
label.linkOffsetY = -50; // Position above mesh
```

**Label Visibility:**
- Show labels when within collection range (~5 units)
- Fade in/out based on distance
- Color-coded by sample type/rarity
- Hide labels when inventory full or tool not equipped

### Design Pattern: Entity-Component-System (Inspired)

While not a pure ECS, we use a similar pattern:

**Entities**: Game objects (Submarine, Samples, Creatures)
- Have properties (position, health, etc.)
- Managed by systems

**Systems**: Logic processors (MovementSystem, CombatSystem, etc.)
- Update entities each frame
- Handle specific aspects of gameplay
- Decoupled from each other when possible

**Benefits:**
- Modular, testable code
- Easy to add new features
- Clear separation of concerns

### Core Game Loop

```javascript
// Simplified example
class Engine {
  constructor() {
    this.systems = [];
    this.entities = [];
  }

  update(deltaTime) {
    for (const system of this.systems) {
      system.update(this.entities, deltaTime);
    }
  }

  render() {
    // Babylon.js handles rendering
    this.scene.render();
  }
}
```

### State Management

**Player State:**
- Current oxygen level
- Current armor/health
- Position, depth
- Equipped tool
- Inventory (collected samples)
- Owned upgrades

**Game State:**
- Active quests
- Research credits
- Unlocked zones
- Statistics (for leaderboard)

**Persistence:**
- Use `localStorage` for save data
- Auto-save on quest completion, upgrade purchase, resurfacing

---

## Development Workflow

### Phase-by-Phase Development

Follow the MVP phases outlined in README.md:

1. **Phase 1**: Focus on core movement, basic collection, simple quest loop
2. **Phase 2**: Add depth zones, combat, danger mechanics
3. **Phase 3**: Full quest system, all upgrades, economy
4. **Phase 4**: Polish, 3D ship, audio, visual effects
5. **Phase 5**: Leaderboards, achievements, endgame content

### Feature Development Process

1. **Plan**: Review requirements, identify affected systems
2. **Implement**: Write code following patterns below
3. **Test**: Manual testing + automated tests (if applicable)
4. **Integrate**: Ensure no regressions in existing features
5. **Document**: Update comments, README if needed

### Git Workflow

- **Branch naming**: `claude/feature-name-sessionID`
- **Commit messages**: Clear, descriptive (e.g., "Add oxygen depletion system")
- **Commits**: Logical chunks, not too large
- **Push**: To feature branch, create PR when ready

---

## Code Patterns & Standards

### JavaScript/TypeScript Style

**Naming Conventions:**
- Classes: `PascalCase` (e.g., `MovementSystem`)
- Functions/methods: `camelCase` (e.g., `updateOxygen()`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_DEPTH`)
- Files: Match class name (e.g., `MovementSystem.js`)

**Code Structure:**
```javascript
// Good: Clear, single responsibility
class OxygenSystem {
  constructor(config) {
    this.depletionRate = config.depletionRate;
  }

  update(submarine, deltaTime) {
    if (submarine.isUnderwater()) {
      submarine.oxygen -= this.depletionRate * deltaTime;
      if (submarine.oxygen <= 0) {
        submarine.triggerDeath();
      }
    } else {
      submarine.oxygen = submarine.maxOxygen; // Refill at surface
    }
  }
}
```

**Avoid:**
- Global variables (use dependency injection or module exports)
- Magic numbers (use named constants)
- Deep nesting (extract functions)
- Tight coupling (use events/callbacks for communication)

### Configuration-Driven Design

Store game balance data in JSON files:

```json
// data/upgrades.json
{
  "oxygen": [
    { "tier": 1, "name": "Basic", "maxOxygen": 60, "cost": 0 },
    { "tier": 2, "name": "Extended", "maxOxygen": 120, "cost": 500 },
    { "tier": 3, "name": "Advanced", "maxOxygen": 180, "cost": 1500 }
  ]
}
```

Benefits:
- Easy balancing without code changes
- Designers can tweak values
- Automated generation of UI

### Event System

Use events for decoupled communication:

```javascript
// Example: Quest completion
class QuestSystem {
  completeQuest(quest) {
    const credits = quest.reward;
    this.eventBus.emit('questCompleted', { quest, credits });
  }
}

// Other systems listen
class EconomySystem {
  constructor(eventBus) {
    eventBus.on('questCompleted', ({ credits }) => {
      this.addCredits(credits);
    });
  }
}
```

---

## Testing Strategy

### CRITICAL: Testing Requirements

**⚠️ MANDATORY SMOKE TEST BEFORE UAT ⚠️**

After initial UAT failure (see docs/GAP_ANALYSIS.md), the following testing protocol is now **MANDATORY**:

1. **Run the game in a browser** - Always execute `npm run dev` and open `localhost:5173` in browser
2. **Play for 5 minutes minimum** - Actually interact with the game as a user would
3. **Document with evidence** - Screenshots or short video clips showing:
   - Game loading successfully
   - Core controls working (WASD, mouse look, SPACE/SHIFT)
   - Visual elements rendering correctly (submarine, samples, research ship)
   - UI displaying properly (HUD, messages, inventory)
   - Key gameplay loop functional (collect, quest, upgrade)

**NEVER claim "testing complete" without browser execution evidence.**

### Smoke Test Checklist (5-10 minutes)

**MANDATORY** before any UAT or "ready for review" claim:

- [ ] **Load Test**: Game loads without 404 or console errors
- [ ] **Visibility Test**: Can see submarine, research ship, samples
- [ ] **Control Test**: WASD moves submarine, mouse rotates camera
- [ ] **Depth Test**: SPACE/SHIFT changes depth as expected
- [ ] **Tutorial Test**: Tutorial messages appear and are readable
- [ ] **Collection Test**: Can collect at least one sample with E key
- [ ] **Interaction Test**: Can open research ship UI with E key
- [ ] **HUD Test**: Oxygen, depth, inventory display correctly
- [ ] **Performance Test**: Runs at acceptable FPS (check with F12 → Performance)

**Evidence Required:**
- Screenshot of game running with visible submarine
- Screenshot of HUD showing stats
- Short clip of movement (GIF or video)

### Unit Tests

Test individual systems in isolation:

```javascript
// tests/OxygenSystem.test.js
import { describe, it, expect } from 'vitest';
import OxygenSystem from '../src/systems/OxygenSystem';

describe('OxygenSystem', () => {
  it('depletes oxygen underwater', () => {
    const system = new OxygenSystem({ depletionRate: 1 });
    const submarine = { oxygen: 60, isUnderwater: () => true };

    system.update(submarine, 1); // 1 second
    expect(submarine.oxygen).toBe(59);
  });

  it('refills oxygen at surface', () => {
    const system = new OxygenSystem({ depletionRate: 1 });
    const submarine = {
      oxygen: 30,
      maxOxygen: 60,
      isUnderwater: () => false
    };

    system.update(submarine, 1);
    expect(submarine.oxygen).toBe(60);
  });
});
```

### Manual Testing Checklist

For each phase, test:
- [ ] Core mechanics work as expected
- [ ] UI elements display correctly
- [ ] No console errors
- [ ] Performance is acceptable (60 FPS)
- [ ] Save/load works

### Integration Testing

Test full gameplay loops:
- Dive → Collect → Surface → Complete Quest → Buy Upgrade

### Lessons Learned: Testing Failures

**Root Cause of Phase 1 UAT Failure:**
- Test plan was created but **never executed**
- Game was never actually run in a browser
- All bugs (inverted controls, invisible ship, poor tutorial) were trivially discoverable in <5 minutes
- Confused "writing a test plan" with "actually testing"

**New Protocol:**
- Test plan creation ≠ Testing complete
- "Browser execution" is now mandatory checkpoint
- Evidence (screenshots/video) required for all test claims
- Smoke test must pass before any UAT request

---

## Deployment

### Build Process

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Hosting Options

- **GitHub Pages**: Free, easy for static sites
- **Netlify/Vercel**: Auto-deploy from Git
- **Itch.io**: Great for web games

### Build Configuration (vite.config.js)

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Relative paths for GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
```

---

## Common Tasks

### Adding a New Sample Type

1. **Add definition** to `src/data/samples.json`:
```json
{
  "id": "anglerfish",
  "name": "Anglerfish",
  "type": "aggressive",
  "zones": ["deep", "abyssal"],
  "rarity": "rare",
  "creditValue": 50,
  "requiredTool": "harpoon"
}
```

2. **Create 3D model** or placeholder in `src/assets/models/`

3. **Register** in `Sample.js` factory or manager

4. **Test**: Verify it spawns in correct zones, can be collected

### Adding a New Upgrade

1. **Define** in `src/data/upgrades.json`

2. **Add UI element** in `UpgradeUI.js`

3. **Implement effect** in relevant system (e.g., `OxygenSystem` for oxygen upgrades)

4. **Add dependency check** if required

5. **Test**: Purchase, verify effect applies

### Adding a New Depth Zone

1. **Define zone** in `src/world/DepthZone.js`:
```javascript
const DEPTH_ZONES = {
  abyssal: {
    minDepth: 300,
    maxDepth: 500,
    requiredUpgrade: 'depthRating_4',
    lighting: 0.1,
    spawnRates: { rare: 0.3, aggressive: 0.7 }
  }
};
```

2. **Create biome visuals** (colors, particle effects, fog)

3. **Update sample/creature spawn** logic

4. **Add depth rating upgrade** to unlock zone

5. **Test**: Cannot enter without upgrade, visual changes, spawns work

### Debugging Tips

**Common Issues:**

- **Objects not rendering**: Check mesh creation, scene.add(), camera position
- **Physics not working**: Ensure collision meshes set up, physics enabled
- **Performance drops**: Profile with browser DevTools, reduce draw calls, optimize meshes
- **Input not responding**: Check event listeners attached, input system initialized

**Babylon.js Inspector:**

```javascript
// Enable in dev mode
scene.debugLayer.show();
```

---

## Performance Considerations

### Optimization Strategies

1. **Object Pooling**: Reuse sample/creature instances instead of create/destroy
2. **Level of Detail (LOD)**: Use simpler models when far from camera
3. **Occlusion Culling**: Don't render what's not visible
4. **Texture Atlases**: Combine textures to reduce draw calls
5. **Lazy Loading**: Load assets as needed, not all at once

### Target Performance

- **FPS**: 60 FPS on mid-range hardware
- **Load Time**: <5 seconds initial load
- **Memory**: <500MB RAM usage

---

## Key Design Principles

1. **Modularity**: Each system should be independent and testable
2. **Data-Driven**: Game balance in JSON, not hardcoded
3. **Progressive Enhancement**: Start simple (Phase 1), add complexity incrementally
4. **Player-Centric**: Prioritize fun, clear feedback, responsive controls
5. **Fail Fast**: Validate inputs, throw errors early, don't hide bugs

---

## Resources & References

### Babylon.js Documentation
- [Official Docs](https://doc.babylonjs.com/)
- [Playground](https://playground.babylonjs.com/) - Test code snippets
- [Forum](https://forum.babylonjs.com/) - Community help

### Game Design Patterns
- [Game Programming Patterns](https://gameprogrammingpatterns.com/)
- [Component-based entity systems](https://www.gamedev.net/articles/programming/general-and-gameplay-programming/understanding-component-entity-systems-r3013/)

### Web Game Development
- [MDN WebGL Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
- [HTML5 Game Development](https://developer.mozilla.org/en-US/docs/Games)

---

## Notes for AI Assistants (Claude)

### When Working on This Project:

1. **Always check README.md first** for requirements and current phase
2. **Follow the MVP phase order** - don't jump ahead
3. **Write modular, testable code** - avoid monolithic files
4. **Use configuration files** for game data, not hardcoded values
5. **Comment complex logic**, especially game mechanics math
6. **Test after every feature** - don't accumulate untested code
7. **Ask clarifying questions** if requirements are ambiguous
8. **Propose alternatives** if you see a better approach
9. **Keep performance in mind** - web games need to be lightweight
10. **Document breaking changes** or architectural decisions

### Code Review Checklist:

Before committing, verify:
- [ ] Code follows style guide
- [ ] No console errors
- [ ] Feature works as specified in README.md
- [ ] No performance regressions
- [ ] Constants in config files, not magic numbers
- [ ] Comments explain "why", not "what"
- [ ] Git commit message is clear

---

## Changelog

### 2025-11-20
- **MAJOR UPDATE**: Changed camera perspective from first-person to third-person
- Added 3D asset pipeline documentation (GLB format, SceneLoader)
- Added Babylon.js GUI floating label system for sample identification
- **CRITICAL**: Added mandatory smoke test requirements after UAT failure
- Documented testing lessons learned (see docs/GAP_ANALYSIS.md)
- Added evidence requirements for all testing claims
- Updated architecture overview with camera setup code examples

### 2025-11-16
- Initial CLAUDE.md created
- Defined project structure, tech stack, architecture
- Established code patterns and testing strategy

---

**Document Version**: 2.0
**Last Updated**: 2025-11-20
**Maintained By**: Development Team + AI Assistants
