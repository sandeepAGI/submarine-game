# Submarine Sample Collection Game

## Project Overview

A first-person web-based submarine exploration and collection game where players dive into the ocean depths to collect biological samples for research, complete quests, and upgrade their submarine to reach deeper, more dangerous waters.

## Core Gameplay Loop

1. **Receive Quests** - Accept up to 3 procedurally generated collection quests at the research ship
2. **Dive & Explore** - Navigate the submarine through different ocean depth zones
3. **Collect Samples** - Use tools/weapons to collect specimens, some of which may fight back
4. **Manage Resources** - Monitor oxygen levels and armor while underwater
5. **Surface & Deliver** - Return to the research ship (which follows you) to complete quests
6. **Upgrade** - Spend research credits on submarine upgrades
7. **Repeat** - Take on harder quests to access deeper zones with rarer samples

---

## Detailed Feature Requirements

### 1. Core Mechanics

#### 1.1 Player & Submarine
- **Perspective**: First-person view from inside submarine
- **Controls**: WASD movement + mouse look (simplified, not full 6-DOF)
- **Movement Style**: Arcade-style (not physics-based simulation)
- **Health System**: Armor points that deplete from attacks/hazards
- **Oxygen System**: Depletes over time, must surface to refill
- **Death Condition**: If armor reaches zero before surfacing, player dies and respawns

#### 1.2 Sample Collection
- **Collection Method**: Equippable tools/nets or shooting mechanisms
- **Tool Limitation**: Can only equip one tool at a time
- **Sample Behavior**: Some samples are passive, others fight back or flee
- **Targeting**: Manual aiming required
- **Inventory**: Can carry multiple samples (specific capacity based on upgrades)

#### 1.3 Combat & Threats
- **Hostile Creatures**: Aggressive sea life that attacks the submarine
- **Environmental Hazards**: Depth pressure, underwater currents, obstacles
- **Combat Mechanics**: Manual aiming, shoot/defend against threats
- **Damage System**: Attacks reduce armor points
- **Escape Mechanic**: Can retreat to surface before death

### 2. Quest System

#### 2.1 Quest Structure
- **Simultaneous Quests**: 3 active quests at any time
- **Generation**: Procedurally generated based on available samples and player progression
- **Quest Types**: "Collect X of specimen Y" (e.g., "3 sea bass, 2 urchins")
- **Abandonment**: Cannot abandon quests once accepted
- **Time Limits**: No time pressure (endless gameplay)

#### 2.2 Quest Rewards
- **Research Credits**: Currency earned for completing quests
- **Scaling Rewards**: Harder quests (deeper/rarer samples) = more credits
- **Quest Difficulty**: Tied to depth zones and sample rarity

### 3. Ocean Environment

#### 3.1 World Structure
- **Type**: Confined area (not open world)
- **Size**: Large explorable zone
- **Layout**: Vertical depth-based zones

#### 3.2 Depth Zones & Biomes
- **Shallow Zone** (0-50m): Easy samples, fewer threats, tutorial area
- **Mid-Depth Zone** (50-150m): Moderate difficulty, diverse samples
- **Deep Zone** (150-300m): Harder samples, more aggressive creatures
- **Abyssal Zone** (300m+): Rarest samples, maximum danger, requires upgrades
- **Pressure System**: Cannot descend beyond current depth rating upgrade
- **Biome Variation**: Visual and gameplay differences per zone

#### 3.3 Lighting & Visibility
- **Time of Day**: Always daytime at surface
- **Depth Lighting**: Gets progressively darker with depth
- **Submarine Lights**: Illuminate surroundings (range based on upgrades)

### 4. Research Ship (Hub)

#### 4.1 Functionality
- **Type**: Interactive 3D environment
- **Location**: Always at the surface, repositions to where player surfaces
- **Interactions**:
  - Quest terminal (accept/complete quests)
  - Upgrade station (purchase upgrades)
  - Repair station (restore armor, costs research credits)
  - Statistics/leaderboard display

#### 4.2 Resurfacing
- **Automatic Positioning**: Ship is always where you surface
- **Oxygen Refill**: Automatic when at surface
- **Quest Turn-in**: Deliver samples, receive credits

### 5. Progression & Economy

#### 5.1 Research Credits
- **Earning**: Complete quests
- **Spending**:
  - Purchase upgrades (one-time costs)
  - Repair armor (ongoing cost based on damage)
- **Scaling**: Quest rewards scale with difficulty

#### 5.2 Upgrade System

**Upgrade Categories:**

1. **Oxygen Capacity**
   - Increases max oxygen supply
   - Longer dive times
   - Individual tiers: Basic (60s) → Extended (120s) → Advanced (180s) → Deep Dive (300s)

2. **Armor Rating**
   - Increases damage resistance
   - Survive more attacks
   - Tiers: Light → Medium → Heavy → Reinforced

3. **Depth Rating**
   - Maximum survivable depth
   - Required to access deeper zones
   - Tiers: Shallow (50m) → Mid (150m) → Deep (300m) → Abyssal (500m+)

4. **Collection Tools/Weapons**
   - Different tools for different sample types
   - Options: Basic Net, Harpoon Gun, Stun Net, Vacuum System, Sedation Dart
   - Some tools required for specific dangerous samples

5. **Engine/Speed**
   - Increases submarine speed
   - Helps escape threats, cover more area
   - Tiers: Standard → Enhanced → Turbo

6. **Sonar/Detection Range**
   - Increases mini-map/detection radius
   - Spots samples and threats from farther away
   - Tiers: Basic (20m) → Advanced (40m) → Long-range (80m)

7. **Light Range**
   - Increases submarine light visibility
   - Essential for deep zones
   - Tiers: Basic → Flood → High-Intensity

8. **Storage/Inventory Capacity**
   - Number of samples can carry per dive
   - Tiers: Small (5) → Medium (10) → Large (20) → Massive (40)

**Upgrade Dependencies:**
- Deep/Abyssal weapons require corresponding Depth Rating
- Advanced tools require minimum Engine upgrade (for power generation)
- Long-range Sonar requires Advanced Light (power requirements)

#### 5.3 Progression Gates
- **Depth Zones**: Locked behind Depth Rating upgrades
- **Quest Difficulty**: Scales with available upgrades
- **Sample Accessibility**: Rarer samples in deeper zones

### 6. Samples & Creatures

#### 6.1 Sample Categories
- **Passive**: Easy to collect (kelp, shells, small fish)
- **Evasive**: Flee when approached (fast fish, squid)
- **Aggressive**: Attack when disturbed (eels, large predators)
- **Rare**: Found only in specific zones, may require specific tools

#### 6.2 Creature AI
- **Passive**: Wander, ignore player
- **Territorial**: Attack if player gets too close
- **Predatory**: Actively hunt player
- **Damage Scaling**: Deeper creatures deal more damage

### 7. UI/UX Requirements

#### 7.1 HUD (In Submarine)
- Oxygen meter
- Armor/health meter
- Current depth indicator
- Active quest tracker (current objectives)
- Mini-map/sonar display
- Tool/weapon indicator
- Sample inventory count

#### 7.2 Menus
- Main menu (start, settings, leaderboard)
- Research ship UI (quests, upgrades, repairs, stats)
- Pause menu
- Death/respawn screen

### 8. Technical Requirements

#### 8.1 Platform
- **Type**: Web-based game
- **Suggested Engine**: Three.js or Babylon.js
- **Target**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Performance**: 60 FPS target on mid-range hardware

#### 8.2 Art Style
- **Visual Style**: Stylized (not photorealistic)
- **Graphics**: 3D low-poly or stylized models
- **Color Palette**: Vibrant, distinct zones
- **Animation**: Smooth character/creature animations

#### 8.3 Audio
- **Music**: Ambient underwater soundscapes per zone
- **SFX**: Sonar pings, engine hum, creature sounds, collection sounds, damage alerts
- **Audio Depth**: Sounds muffle/change with depth

### 9. Game Loop & Win/Lose Conditions

#### 9.1 Gameplay Type
- **Mode**: Endless gameplay (no final ending)
- **Goal**: High score, complete quests, full upgrade tree

#### 9.2 Death & Respawn
- **Death Trigger**: Armor reaches zero while underwater
- **Respawn**: At research ship with full oxygen/armor
- **Penalty**: Lose all collected samples from current dive (not delivered quests)
- **Quest Progress**: Incomplete quests remain active

#### 9.3 Scoring & Leaderboards
- **Score Factors**: Total research credits earned, quests completed, rare samples collected
- **Leaderboard**: Global high scores, quest completion count
- **Stats Tracking**: Time played, deepest dive, total samples collected, etc.

### 10. Accessibility & Settings

- **Difficulty**: Consider adjustable damage/oxygen consumption rates
- **Controls**: Rebindable keys
- **Graphics Settings**: Quality presets (low, medium, high)
- **Audio**: Separate volume sliders (music, SFX, master)
- **Colorblind Modes**: UI considerations

---

## MVP Development Phases

### Phase 1: Core Mechanics Prototype (MVP v0.1)
**Goal**: Prove the basic gameplay loop works

**Features**:
- ✅ Basic submarine movement (WASD + mouse look)
- ✅ Simple ocean environment (single depth zone, 0-50m)
- ✅ Oxygen system (depletes, refills at surface)
- ✅ 3-5 passive sample types (kelp, shells, small fish)
- ✅ Basic collection tool (net, proximity-based collection)
- ✅ Simple research ship (static UI, not 3D yet)
- ✅ 1 quest at a time (manually created, not procedural)
- ✅ Research credits earned from quest completion
- ✅ 1-2 basic upgrades (oxygen capacity, speed)
- ✅ Basic HUD (oxygen, depth, quest objective)
- ✅ Respawn on oxygen depletion

**Success Criteria**: Can dive, collect samples, surface, complete quest, buy upgrade

---

### Phase 2: Depth & Danger (MVP v0.2)
**Goal**: Add vertical progression and risk/reward

**Features**:
- ✅ Multiple depth zones (shallow, mid-depth, deep = 3 zones)
- ✅ Depth rating upgrade system
- ✅ Armor/health system
- ✅ 2-3 aggressive creatures (basic AI)
- ✅ Combat mechanic (basic weapon/harpoon)
- ✅ Environmental hazards (pressure damage if too deep)
- ✅ Death & respawn system
- ✅ Sample loss on death
- ✅ 2-3 evasive sample types
- ✅ Biome visual differences
- ✅ Armor upgrade system

**Success Criteria**: Can upgrade to reach deeper zones, face threats, risk/reward decision-making

---

### Phase 3: Quest & Progression Systems (MVP v0.3)
**Goal**: Fully functional quest and economy systems

**Features**:
- ✅ Procedural quest generation
- ✅ 3 simultaneous quests
- ✅ Quest difficulty scaling
- ✅ All 8 upgrade categories implemented
- ✅ Upgrade dependencies
- ✅ Repair system (costs credits)
- ✅ 5-6 collection tools/weapons (switchable)
- ✅ Tool requirements for certain samples
- ✅ 10+ sample types across all zones
- ✅ Expanded creature variety (8+ types)

**Success Criteria**: Engaging progression loop, multiple strategies, replayability

---

### Phase 4: Polish & Content (MVP v0.4)
**Goal**: Full gameplay experience

**Features**:
- ✅ 3D interactive research ship hub
- ✅ Ship repositioning when surfacing
- ✅ 15-20 unique sample types
- ✅ 10+ creature types with varied AI
- ✅ Sonar/mini-map system
- ✅ Dynamic lighting based on depth
- ✅ Particle effects (bubbles, murk, etc.)
- ✅ Sound effects and music
- ✅ Complete UI/UX polish
- ✅ Tutorial/onboarding
- ✅ Settings menu (graphics, audio, controls)

**Success Criteria**: Feels like a complete game, good juice/feel

---

### Phase 5: Endgame & Social Features (MVP v1.0)
**Goal**: Long-term engagement

**Features**:
- ✅ Leaderboard system
- ✅ Achievement/milestone system
- ✅ Statistics tracking
- ✅ High-score challenges
- ✅ Rare/legendary samples (collection goals)
- ✅ Abyssal zone (endgame content)
- ✅ "Boss" creatures (ultra-rare, dangerous)
- ✅ Full upgrade trees completed
- ✅ Colorblind modes
- ✅ Performance optimization
- ✅ Cross-browser testing

**Success Criteria**: Players return, compete for scores, pursue completion goals

---

### Future Considerations (Post-v1.0)
- Seasonal events/quests
- New biomes/zones
- Photo mode (document discoveries)
- Sample encyclopedia/codex
- Custom submarine cosmetics
- Speedrun modes
- Daily/weekly challenges
- Save/load system improvements

---

## Success Metrics

### Engagement Metrics
- Average session length: 15-30 minutes
- Return rate: Players come back for multiple sessions
- Quest completion rate: >70% of started quests completed

### Progression Metrics
- Time to first upgrade: <10 minutes
- Time to unlock all zones: 3-5 hours
- Time to full upgrades: 10-15 hours

### Technical Metrics
- Load time: <5 seconds
- Frame rate: Consistent 60 FPS
- Browser compatibility: 95%+ modern browsers

---

## Open Questions

1. **Should some samples be "alive" in inventory and require specific storage upgrades?**
2. **Should there be a day/night cycle at surface (visual only, no gameplay impact)?**
3. **Should research ship have crew NPCs or just UI terminals?**
4. **Should there be any meta-progression (unlocks that persist across deaths)?**
5. **Should rare samples have a chance to drop from aggressive creatures?**
6. **Should there be environmental storytelling (ruins, wreckage, etc.)?**
7. **Should oxygen be a hard limit or allow brief "emergency" time at risk?**
8. **Should there be any passive income or is it purely quest-based?**

---

## Next Steps

1. Review and finalize requirements
2. Set up development environment
3. Choose web game engine (Three.js vs Babylon.js)
4. Create technical architecture document (CLAUDE.md)
5. Begin Phase 1 prototype development

---

**Document Version**: 1.0
**Last Updated**: 2025-11-16
**Status**: Draft - Pending Review
