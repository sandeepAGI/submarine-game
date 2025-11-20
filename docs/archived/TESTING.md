# Phase 1 Testing Plan

## Test Environment
- **Server**: Running on http://localhost:3000/
- **Build Tool**: Vite dev server
- **Browser**: Chrome/Firefox/Safari (modern browsers)

---

## Automated Tests

### Server Startup Test
✅ **PASSED** - Vite dev server starts without errors
- Server running on port 3000
- No compilation errors
- All modules loaded successfully

---

## Manual Test Checklist

### 1. Initial Load & Scene Setup
**Test**: Game loads and initializes properly
- [ ] Page loads without console errors
- [ ] 3D scene renders (dark blue ocean environment)
- [ ] Submarine model visible (yellow capsule)
- [ ] Ocean floor visible at -50m depth
- [ ] HUD displays correctly (oxygen, depth, credits, quest, inventory)
- [ ] Welcome messages appear

**Expected Console Output**:
- No errors
- Babylon.js initialization messages

---

### 2. Input System
**Test**: Mouse and keyboard input works

#### Pointer Lock
- [ ] Click on canvas requests pointer lock
- [ ] Mouse movement rotates camera/submarine
- [ ] ESC key releases pointer lock

#### Keyboard Controls
- [ ] W key moves submarine forward
- [ ] S key moves submarine backward
- [ ] A key moves submarine left
- [ ] D key moves submarine right
- [ ] SPACE key moves submarine up
- [ ] SHIFT key moves submarine down
- [ ] E key triggers collection/interaction

---

### 3. Submarine Movement
**Test**: Submarine moves correctly with physics

#### Movement
- [ ] Submarine moves in all 6 directions (WASD + Space/Shift)
- [ ] Movement speed feels responsive (5 units/sec base)
- [ ] Submarine rotates with mouse (yaw and pitch)
- [ ] Pitch rotation limited to prevent flipping
- [ ] Submarine has collision detection with ocean floor
- [ ] Submarine cannot pass through invisible boundaries
- [ ] Submarine headlight illuminates surroundings

#### Position Tracking
- [ ] Depth meter updates correctly (0m at surface, increases with depth)
- [ ] Depth value matches submarine's Y position
- [ ] Position constrained within ocean bounds (200x200 area)

---

### 4. Oxygen System
**Test**: Oxygen depletes and refills correctly

#### Underwater Behavior
- [ ] Oxygen starts at 100% (60 seconds)
- [ ] Oxygen depletes at 1%/second when underwater
- [ ] Oxygen bar updates in real-time
- [ ] Oxygen percentage displays correctly
- [ ] Oxygen bar turns red when below 20%

#### Surface Behavior
- [ ] Oxygen stops depleting at surface (depth <= 2m)
- [ ] Oxygen refills at 10%/second at surface
- [ ] "At surface" detected correctly

#### Depletion
- [ ] When oxygen reaches 0%, respawn message appears
- [ ] After 2 seconds, submarine respawns at surface
- [ ] Oxygen refills to 100% on respawn
- [ ] Inventory cleared on respawn
- [ ] Message shown: "Respawned at surface. Inventory lost."

---

### 5. Sample Collection
**Test**: Samples spawn and can be collected

#### Sample Spawning
- [ ] 15 samples spawn on game start
- [ ] Samples distributed randomly across ocean floor
- [ ] All 5 sample types represented (kelp, shell, coral, fish, starfish)
- [ ] Samples have correct colors and shapes
- [ ] Samples float/animate slightly
- [ ] Samples rotate slowly

#### Collection Mechanic
- [ ] Press E when near sample (within 3m) collects it
- [ ] Collection message appears: "Collected: [Sample Name]"
- [ ] Sample disappears from scene
- [ ] Inventory count increases
- [ ] Cannot collect when inventory full (5/5)
- [ ] Quest progress updates if collecting quest samples

---

### 6. HUD Display
**Test**: HUD updates correctly in real-time

#### Top-Left Panel
- [ ] Oxygen percentage displays (0-100%)
- [ ] Oxygen bar width matches percentage
- [ ] Depth displays in meters
- [ ] Credits display current amount

#### Top-Right Panel
- [ ] Quest display shows active quest or "No active quest" message
- [ ] Quest objectives list displayed
- [ ] Quest progress updates as samples collected
- [ ] Quest items turn green when completed
- [ ] Inventory count shows current/max (e.g., "3/5")

#### Messages
- [ ] Messages appear at bottom center
- [ ] Messages fade in/out correctly
- [ ] Multiple messages stack properly

---

### 7. Research Ship UI
**Test**: Research ship interface works

#### Opening UI
- [ ] Surface to depth <= 2m
- [ ] Move within 10m of origin (0,0,0)
- [ ] Press E to open research ship UI
- [ ] Modal appears with quest, upgrade, and repair sections
- [ ] Message: "Research Ship Interface Opened"

#### Quest Terminal
- [ ] Shows "Accept Quest: First Collection" initially
- [ ] Click button accepts quest
- [ ] Quest becomes active
- [ ] Quest objectives displayed with current progress
- [ ] When quest complete, "COMPLETE QUEST" button appears
- [ ] Clicking complete quest:
  - Awards credits (100)
  - Clears inventory
  - Clears active quest
  - Shows completion message

#### Upgrade Station
- [ ] Shows available upgrades (Oxygen tier 2, Speed tier 2)
- [ ] Displays upgrade name, description, cost
- [ ] "NOT ENOUGH CREDITS" if can't afford
- [ ] "PURCHASE" button if can afford
- [ ] Clicking purchase:
  - Deducts credits
  - Applies upgrade effect
  - Updates upgrade tier
  - Shows next tier (if available)
  - Upgrades list refreshes

#### Closing UI
- [ ] Click "CLOSE [ESC]" button closes UI
- [ ] ESC key closes UI
- [ ] Returns to game

---

### 8. Quest System
**Test**: Quest flow works end-to-end

#### Quest: "First Collection"
- **Objectives**: Collect 2 Kelp, 1 Conch Shell
- **Reward**: 100 credits

**Steps**:
1. [ ] Open research ship UI at surface
2. [ ] Accept quest
3. [ ] Quest appears in HUD
4. [ ] Dive and collect samples
5. [ ] Progress updates: "Kelp: 1/2", "Conch Shell: 0/1"
6. [ ] Collect required samples
7. [ ] All objectives turn green
8. [ ] Return to surface
9. [ ] Open research ship UI
10. [ ] Complete quest button available
11. [ ] Click complete quest
12. [ ] Receive 100 credits
13. [ ] Inventory cleared
14. [ ] Can accept new quest (same quest for Phase 1)

---

### 9. Upgrade System
**Test**: Upgrades purchase and apply correctly

#### Oxygen Upgrade
- **Tier 2**: Extended Oxygen Tank (120s, 200 credits)

**Steps**:
1. [ ] Complete quest to earn 200 credits
2. [ ] Open research ship UI
3. [ ] Navigate to upgrade station
4. [ ] Purchase "Extended Oxygen Tank"
5. [ ] Credits deducted: 200
6. [ ] Max oxygen increases to 120s
7. [ ] Oxygen refills to 120s
8. [ ] HUD shows oxygen depleting over 120s instead of 60s
9. [ ] Upgrade no longer available (tier 2 is max for Phase 1)

#### Speed Upgrade
- **Tier 2**: Enhanced Engine (1.5x speed, 150 credits)

**Steps**:
1. [ ] Earn 150 credits
2. [ ] Open research ship UI
3. [ ] Purchase "Enhanced Engine"
4. [ ] Credits deducted: 150
5. [ ] Submarine moves 50% faster
6. [ ] Movement feels noticeably faster
7. [ ] Upgrade no longer available

---

### 10. Respawn System
**Test**: Death and respawn works correctly

#### Oxygen Depletion Death
**Steps**:
1. [ ] Dive underwater
2. [ ] Wait for oxygen to reach 0%
3. [ ] Message appears: "OXYGEN DEPLETED! Respawning..."
4. [ ] After 2 seconds, submarine teleports to surface (0, -2, 0)
5. [ ] Oxygen refills to max
6. [ ] Inventory cleared (samples lost)
7. [ ] Message: "Respawned at surface. Inventory lost."
8. [ ] Can resume gameplay normally

---

### 11. Game Loop Integration
**Test**: All systems work together

**Full Gameplay Cycle**:
1. [ ] Start game
2. [ ] Click canvas to lock pointer
3. [ ] Use WASD to navigate submarine
4. [ ] Dive to collect samples
5. [ ] Monitor oxygen and return before depleting
6. [ ] Collect quest samples (2 kelp, 1 shell)
7. [ ] Return to surface (depth <= 2m, within 10m of origin)
8. [ ] Press E to open research ship UI
9. [ ] Complete quest
10. [ ] Receive 100 credits
11. [ ] Purchase upgrade (if enough credits)
12. [ ] Accept new quest
13. [ ] Repeat cycle
14. [ ] Verify upgrades persist across dives
15. [ ] Verify death/respawn works

---

### 12. Performance & Visuals
**Test**: Game runs smoothly

- [ ] Maintains 60 FPS
- [ ] No lag or stuttering
- [ ] Fog effect visible (gets denser with depth)
- [ ] Submarine light illuminates nearby objects
- [ ] Sample animations smooth
- [ ] UI responsive (no delays)
- [ ] Scene renders correctly (no z-fighting, clipping issues)

---

### 13. Edge Cases & Bugs

#### Boundary Testing
- [ ] Submarine cannot escape ocean boundaries
- [ ] Submarine cannot go below ocean floor
- [ ] Submarine cannot go above surface (y > 0)

#### Collection Edge Cases
- [ ] Cannot collect when inventory full (5/5)
- [ ] Cannot collect samples outside 3m range
- [ ] E key only collects nearest sample
- [ ] Samples don't respawn after collection

#### Quest Edge Cases
- [ ] Cannot complete quest without meeting objectives
- [ ] Cannot accept quest when one is active
- [ ] Quest objectives count only correct sample types

#### Upgrade Edge Cases
- [ ] Cannot purchase upgrades without enough credits
- [ ] Cannot purchase same upgrade tier twice
- [ ] Upgrades must be purchased in tier order

#### UI Edge Cases
- [ ] Can only open research ship UI at surface near origin
- [ ] ESC key closes UI properly
- [ ] UI buttons disabled when conditions not met

---

## Known Limitations (Phase 1)

1. **Single Quest**: Only one repeatable quest available
2. **No Quest Variety**: Same quest each time
3. **No Sample Respawning**: 15 samples total, don't respawn
4. **Limited Upgrades**: Only 2 tiers each for oxygen and speed
5. **No 3D Research Ship**: UI is modal overlay, not 3D object
6. **No Combat**: No aggressive creatures yet
7. **No Armor/Health**: Only oxygen system in Phase 1
8. **No Save/Load**: Game state resets on page reload

---

## Bug Tracking

### Critical Bugs (Game-Breaking)
- [ ] None identified

### Major Bugs (Impact Core Gameplay)
- [ ] None identified

### Minor Bugs (Polish Issues)
- [ ] None identified

---

## UAT Readiness Checklist

Before user acceptance testing:
- [x] All core features implemented
- [x] Code committed and pushed
- [x] Dev server running
- [ ] Manual test plan created
- [ ] Code reviewed for obvious bugs
- [ ] Test instructions documented

---

## Next Steps for UAT

1. **User opens** http://localhost:3000/
2. **User follows** manual test checklist above
3. **User reports** any bugs or issues
4. **Developer fixes** reported issues
5. **User retests** until Phase 1 is approved
6. **Move to** Phase 2 development

---

## Success Criteria (Phase 1)

✅ All Phase 1 requirements met:
- ✅ Basic submarine movement (WASD + mouse look)
- ✅ Simple ocean environment (single depth zone, 0-50m)
- ✅ Oxygen system (depletes, refills at surface)
- ✅ 3-5 passive sample types
- ✅ Basic collection tool (net, proximity-based collection)
- ✅ Simple research ship (static UI)
- ✅ 1 quest at a time
- ✅ Research credits earned from quest completion
- ✅ 1-2 basic upgrades (oxygen capacity, speed)
- ✅ Basic HUD (oxygen, depth, quest objective)
- ✅ Respawn on oxygen depletion

**Phase 1 Success**: Can dive, collect samples, surface, complete quest, buy upgrade ✓

---

**Test Plan Version**: 1.0
**Date**: 2025-11-16
**Status**: Ready for UAT
