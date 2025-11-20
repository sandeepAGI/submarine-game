# Testing Plan - Visual Overhaul (Option C)

**Created**: 2025-11-20
**Purpose**: Comprehensive testing plan for third-person camera and 3D model implementation
**Status**: Ready for execution after implementation

---

## Overview

This document outlines the complete testing strategy for the visual overhaul of the submarine game. After the Phase 1 UAT failure (documented in GAP_ANALYSIS.md), this plan ensures **actual browser execution and evidence collection** before any UAT claims.

### Key Principles

1. **Browser execution is mandatory** - No testing claim is valid without running `npm run dev`
2. **Evidence is required** - Screenshots, videos, or console logs for every test
3. **User perspective first** - Test as a player would experience the game
4. **Smoke tests before deep tests** - Quick validation before detailed testing
5. **Document failures immediately** - Don't skip bugs, log them with evidence

---

## 1. Mandatory Smoke Test (15 minutes)

**Purpose**: Quick validation that the game is playable before detailed testing
**When**: IMMEDIATELY after completing implementation, before any other testing
**Evidence Required**: Screenshots for each test item

### Prerequisites

```bash
# Ensure dependencies are installed
npm install

# Start dev server
npm run dev

# Open browser to http://localhost:5173
```

### Smoke Test Checklist

| # | Test | Expected Result | Pass/Fail | Screenshot |
|---|------|----------------|-----------|------------|
| 1 | **Load Test** | Game loads without 404 or console errors | ☐ | `smoke_01_load.png` |
| 2 | **Camera View** | Third-person camera shows submarine from behind/above | ☐ | `smoke_02_camera.png` |
| 3 | **Submarine Model** | Custom 3D submarine model visible (not primitive box) | ☐ | `smoke_03_submarine.png` |
| 4 | **Research Ship** | Orange research ship visible at surface with 3D model | ☐ | `smoke_04_ship.png` |
| 5 | **Samples Visible** | At least 3 sample 3D models visible and distinguishable | ☐ | `smoke_05_samples.png` |
| 6 | **Sample Labels** | Floating labels appear above samples showing names | ☐ | `smoke_06_labels.png` |
| 7 | **WASD Movement** | WASD keys move submarine forward/back/left/right | ☐ | `smoke_07_movement.gif` |
| 8 | **Mouse Camera** | Mouse movement rotates camera around submarine | ☐ | `smoke_08_mouse.gif` |
| 9 | **Depth Control** | SPACE ascends, SHIFT descends (correct behavior) | ☐ | `smoke_09_depth.gif` |
| 10 | **Tutorial Messages** | Tutorial messages appear sequentially and are readable | ☐ | `smoke_10_tutorial.png` |
| 11 | **HUD Display** | HUD shows oxygen, depth, inventory, credits | ☐ | `smoke_11_hud.png` |
| 12 | **Collection** | E key collects a sample, inventory updates | ☐ | `smoke_12_collect.gif` |
| 13 | **Research Ship UI** | E key near ship opens quest/upgrade interface | ☐ | `smoke_13_ui.png` |
| 14 | **Performance** | Game runs at >30 FPS (check F12 Performance tab) | ☐ | `smoke_14_fps.png` |
| 15 | **No Console Errors** | Browser console shows no red errors | ☐ | `smoke_15_console.png` |

### Smoke Test Evidence Storage

```
docs/testing/smoke_test_YYYYMMDD/
├── smoke_01_load.png
├── smoke_02_camera.png
├── smoke_03_submarine.png
├── ... (all 15 items)
└── smoke_test_report.md (summary of pass/fail)
```

**CRITICAL**: If ANY smoke test fails, STOP and fix before proceeding to detailed tests.

---

## 2. Visual Quality Tests (30 minutes)

**Purpose**: Verify visual improvements meet quality standards
**Evidence Required**: Comparison screenshots (before/after if applicable)

### 2.1 Third-Person Camera

| Test Case | Steps | Expected Result | Evidence |
|-----------|-------|----------------|----------|
| **TC-CAM-01**: Camera follows submarine | 1. Move submarine with WASD<br>2. Observe camera | Camera smoothly follows submarine from behind and above | `visual_cam_01.gif` |
| **TC-CAM-02**: Camera rotation | 1. Move mouse left/right/up/down<br>2. Observe camera angle | Camera orbits around submarine, stays focused on submarine | `visual_cam_02.gif` |
| **TC-CAM-03**: Camera zoom limits | 1. Scroll mouse wheel in/out<br>2. Try to zoom too close/far | Camera stops at min (5 units) and max (20 units) distance | `visual_cam_03.gif` |
| **TC-CAM-04**: Camera collision | 1. Move submarine close to ocean floor<br>2. Observe camera behavior | Camera adjusts to avoid clipping through terrain | `visual_cam_04.gif` |
| **TC-CAM-05**: Submarine visibility | 1. Look at submarine from all angles<br>2. Check during movement | Submarine is always visible and oriented correctly | `visual_cam_05.png` |

### 2.2 Submarine 3D Model

| Test Case | Steps | Expected Result | Evidence |
|-----------|-------|----------------|----------|
| **TC-SUB-01**: Model loads | 1. Start game<br>2. Wait for submarine to appear | Submarine 3D model (GLB) loads without errors | `visual_sub_01.png` |
| **TC-SUB-02**: Model scale | 1. Observe submarine size<br>2. Compare to samples/ship | Submarine is 2-4 units in size, appropriately scaled | `visual_sub_02.png` |
| **TC-SUB-03**: Model textures | 1. Observe submarine surface<br>2. Check from different angles | Textures are applied correctly, no missing/broken textures | `visual_sub_03.png` |
| **TC-SUB-04**: Model orientation | 1. Move submarine forward<br>2. Observe direction of movement | Submarine faces the direction it's moving (forward = +Z) | `visual_sub_04.gif` |
| **TC-SUB-05**: Model lighting | 1. Observe submarine at surface<br>2. Observe at deep depth | Model is lit correctly by scene lights, visible at all depths | `visual_sub_05.png` |

### 2.3 Sample 3D Models

| Test Case | Steps | Expected Result | Evidence |
|-----------|-------|----------------|----------|
| **TC-SAM-01**: All sample types load | 1. Dive and locate samples<br>2. Find one of each type | Kelp, shell, coral, fish, starfish all have unique 3D models | `visual_sam_01.png` |
| **TC-SAM-02**: Sample distinguishability | 1. View samples from 10 units away<br>2. Try to identify each type | Each sample type is visually distinct and recognizable | `visual_sam_02.png` |
| **TC-SAM-03**: Sample scale | 1. Approach samples<br>2. Compare size to submarine | Samples are 1-3 units (3-5x larger than realistic for visibility) | `visual_sam_03.png` |
| **TC-SAM-04**: Sample textures | 1. Observe each sample type<br>2. Check texture quality | Textures are clear, no distortion or missing materials | `visual_sam_04.png` |
| **TC-SAM-05**: Sample placement | 1. Dive to different depths<br>2. Observe sample positions | Samples are not clipping through ocean floor, properly positioned | `visual_sam_05.png` |

### 2.4 Research Ship 3D Model

| Test Case | Steps | Expected Result | Evidence |
|-----------|-------|----------------|----------|
| **TC-SHIP-01**: Ship model loads | 1. Start game at surface<br>2. Look for ship at origin | Research ship 3D model visible, not just primitive boxes | `visual_ship_01.png` |
| **TC-SHIP-02**: Ship visibility | 1. Dive 10 units down<br>2. Look up at surface | Ship is visible from underwater, bright/distinct | `visual_ship_02.png` |
| **TC-SHIP-03**: Ship scale | 1. Approach ship<br>2. Compare to submarine | Ship is 8-12 units, noticeably larger than submarine | `visual_ship_03.png` |
| **TC-SHIP-04**: Ship materials | 1. Observe ship hull, cabin, beacon<br>2. Check orange/yellow colors | Materials are vibrant (orange hull, yellow beacon), emissive glow | `visual_ship_04.png` |
| **TC-SHIP-05**: Ship beacon | 1. Observe ship from distance<br>2. Check beacon visibility | Beacon is bright, helps locate ship from far away | `visual_ship_05.png` |

### 2.5 Babylon.js GUI Labels

| Test Case | Steps | Expected Result | Evidence |
|-----------|-------|----------------|----------|
| **TC-LABEL-01**: Labels appear | 1. Approach a sample within 5 units<br>2. Observe label | Floating label appears above sample with name | `visual_label_01.png` |
| **TC-LABEL-02**: Label content | 1. Read labels for each sample type<br>2. Verify accuracy | Labels show correct sample names (Kelp, Shell, etc.) | `visual_label_02.png` |
| **TC-LABEL-03**: Label visibility range | 1. Move away from sample<br>2. Note when label disappears | Labels fade out beyond 5 units, fade in when approaching | `visual_label_03.gif` |
| **TC-LABEL-04**: Label positioning | 1. Move around sample<br>2. Observe label from different angles | Label stays above sample, faces camera (billboard effect) | `visual_label_04.gif` |
| **TC-LABEL-05**: Label styling | 1. Observe label design<br>2. Check readability | Labels have dark background, white text, rounded corners, readable | `visual_label_05.png` |
| **TC-LABEL-06**: Multiple labels | 1. Position submarine near 3+ samples<br>2. Observe all labels | All labels render correctly, no overlap/clipping | `visual_label_06.png` |

### 2.6 Lighting & Materials

| Test Case | Steps | Expected Result | Evidence |
|-----------|-------|----------------|----------|
| **TC-LIGHT-01**: Ocean lighting | 1. Observe ocean at different depths<br>2. Check color/brightness | Ocean gets darker with depth, gradient from blue to dark blue/black | `visual_light_01.png` |
| **TC-LIGHT-02**: Submarine lighting | 1. Move submarine to deep depth<br>2. Observe illumination | Submarine has headlight/emissive light to illuminate surroundings | `visual_light_02.png` |
| **TC-LIGHT-03**: Sample visibility | 1. Locate samples in deep water<br>2. Check if visible | Samples have slight emissive glow or are lit by submarine | `visual_light_03.png` |
| **TC-LIGHT-04**: Ship light | 1. Approach ship from underwater<br>2. Observe light | Ship has bright light (range 50 units) visible from distance | `visual_light_04.png` |
| **TC-LIGHT-05**: Ambient occlusion | 1. Observe all models<br>2. Check for depth/shadow | Models have appropriate shading, not flat or overly bright | `visual_light_05.png` |

---

## 3. Functional Tests (45 minutes)

**Purpose**: Verify gameplay mechanics work correctly with new visuals
**Evidence Required**: Console logs, screenshots of state changes

### 3.1 Movement & Controls

| Test Case | Steps | Expected Result | Evidence |
|-----------|-------|----------------|----------|
| **TC-MOVE-01**: Forward movement | 1. Press W key<br>2. Observe submarine | Submarine moves forward (+Z direction), camera follows | `func_move_01.gif` |
| **TC-MOVE-02**: Backward movement | 1. Press S key<br>2. Observe submarine | Submarine moves backward (-Z direction) | `func_move_02.gif` |
| **TC-MOVE-03**: Strafe left | 1. Press A key<br>2. Observe submarine | Submarine moves left (-X direction) | `func_move_03.gif` |
| **TC-MOVE-04**: Strafe right | 1. Press D key<br>2. Observe submarine | Submarine moves right (+X direction) | `func_move_04.gif` |
| **TC-MOVE-05**: Ascend | 1. Press SPACE<br>2. Observe depth in HUD | Submarine moves up (+Y), depth decreases (correct) | `func_move_05.gif` |
| **TC-MOVE-06**: Descend | 1. Press SHIFT<br>2. Observe depth in HUD | Submarine moves down (-Y), depth increases (correct) | `func_move_06.gif` |
| **TC-MOVE-07**: Mouse look | 1. Move mouse left/right<br>2. Observe camera | Camera rotates around submarine, yaw changes | `func_move_07.gif` |
| **TC-MOVE-08**: Combined movement | 1. Press W+A+SPACE<br>2. Observe motion | Submarine moves forward+left+up simultaneously | `func_move_08.gif` |

### 3.2 Sample Collection

| Test Case | Steps | Expected Result | Evidence |
|-----------|-------|----------------|----------|
| **TC-COLL-01**: Approach sample | 1. Move submarine within 3 units of sample<br>2. Observe label | Sample label appears, shows name and type | `func_coll_01.png` |
| **TC-COLL-02**: Collect sample | 1. Press E near sample<br>2. Observe result | Sample disappears, inventory count increases, message shows | `func_coll_02.gif` |
| **TC-COLL-03**: Inventory update | 1. Collect sample<br>2. Check HUD | Inventory shows "X/Y" (e.g., "1/5"), correct count | `func_coll_03.png` |
| **TC-COLL-04**: Multiple collections | 1. Collect 3 samples<br>2. Check inventory | Inventory list shows all collected samples with names | `func_coll_04.png` |
| **TC-COLL-05**: Inventory full | 1. Collect samples until inventory full (5/5)<br>2. Try to collect more | Cannot collect, message shows "Inventory Full" | `func_coll_05.png` |
| **TC-COLL-06**: Sample respawn | 1. Collect all samples<br>2. Wait or trigger respawn | New samples spawn at random locations | `func_coll_06.png` |

### 3.3 Research Ship Interaction

| Test Case | Steps | Expected Result | Evidence |
|-----------|-------|----------------|----------|
| **TC-INT-01**: Approach ship | 1. Surface submarine near ship (within 10 units)<br>2. Observe prompt | HUD message or prompt indicates "Press E to interact" | `func_int_01.png` |
| **TC-INT-02**: Open UI | 1. Press E near ship at surface<br>2. Observe UI | Research Ship UI modal opens, shows quests and upgrades | `func_int_02.png` |
| **TC-INT-03**: Quest tab | 1. Open UI<br>2. Click Quest tab | Quest list displays, shows available/active/completed quests | `func_int_03.png` |
| **TC-INT-04**: Upgrade tab | 1. Open UI<br>2. Click Upgrade tab | Upgrade tree displays, shows oxygen/speed/armor tiers | `func_int_04.png` |
| **TC-INT-05**: Close UI | 1. Open UI<br>2. Click X or press ESC | UI closes, game resumes, camera/controls work | `func_int_05.gif` |

### 3.4 Oxygen System

| Test Case | Steps | Expected Result | Evidence |
|-----------|-------|----------------|----------|
| **TC-OXY-01**: Oxygen depletion | 1. Dive underwater<br>2. Observe HUD oxygen bar | Oxygen decreases over time (e.g., 1 unit per second) | `func_oxy_01.gif` |
| **TC-OXY-02**: Oxygen refill | 1. Surface submarine (Y > -1)<br>2. Observe oxygen bar | Oxygen instantly refills to 100% | `func_oxy_02.gif` |
| **TC-OXY-03**: Oxygen depleted | 1. Stay underwater until oxygen reaches 0%<br>2. Observe result | "Oxygen Depleted" message, submarine respawns at surface | `func_oxy_03.gif` |
| **TC-OXY-04**: Inventory lost | 1. Collect samples<br>2. Deplete oxygen<br>3. Check inventory | Inventory is cleared (0/5) after respawn | `func_oxy_04.png` |

### 3.5 Quest System

| Test Case | Steps | Expected Result | Evidence |
|-----------|-------|----------------|----------|
| **TC-QUEST-01**: View quests | 1. Open Research Ship UI<br>2. Go to Quest tab | At least one quest is available (e.g., "Collect 5 Kelp") | `func_quest_01.png` |
| **TC-QUEST-02**: Accept quest | 1. Click "Accept" on a quest<br>2. Close UI | Quest appears in HUD as active, shows progress (0/5) | `func_quest_02.png` |
| **TC-QUEST-03**: Quest progress | 1. Collect required samples<br>2. Observe HUD | Quest progress updates (e.g., "Kelp Needed: 3/5") | `func_quest_03.gif` |
| **TC-QUEST-04**: Complete quest | 1. Collect all required samples<br>2. Return to ship<br>3. Open UI | Quest shows "Complete" button, can claim reward | `func_quest_04.png` |
| **TC-QUEST-05**: Claim reward | 1. Click "Complete" on quest<br>2. Observe result | Credits increase, message shows "+X credits", quest moves to completed | `func_quest_05.gif` |

### 3.6 Upgrade System

| Test Case | Steps | Expected Result | Evidence |
|-----------|-------|----------------|----------|
| **TC-UPG-01**: View upgrades | 1. Open Research Ship UI<br>2. Go to Upgrade tab | Upgrade categories (Oxygen, Speed, Armor) displayed | `func_upg_01.png` |
| **TC-UPG-02**: Check cost | 1. Hover over upgrade<br>2. Read details | Upgrade shows name, description, cost in credits | `func_upg_02.png` |
| **TC-UPG-03**: Insufficient credits | 1. Try to buy upgrade with not enough credits<br>2. Click button | Button disabled or error message "Not enough credits" | `func_upg_03.png` |
| **TC-UPG-04**: Purchase upgrade | 1. Earn credits from quest<br>2. Buy oxygen upgrade<br>3. Observe changes | Credits decrease, upgrade unlocked, oxygen max increased | `func_upg_04.gif` |
| **TC-UPG-05**: Upgrade applied | 1. After buying oxygen upgrade<br>2. Check HUD | Oxygen bar shows new max (e.g., 120 instead of 60) | `func_upg_05.png` |
| **TC-UPG-06**: Speed upgrade | 1. Buy speed upgrade<br>2. Test movement | Submarine moves faster (visibly quicker) | `func_upg_06.gif` |

---

## 4. Performance Tests (15 minutes)

**Purpose**: Verify game runs smoothly with 3D models
**Evidence Required**: F12 Performance recordings, FPS screenshots

### Performance Benchmarks

| Test | Scenario | Target | Measurement | Evidence |
|------|----------|--------|-------------|----------|
| **PERF-01** | Surface (ship visible) | >30 FPS | F12 Performance tab → FPS meter | `perf_01_surface.png` |
| **PERF-02** | Underwater (5 samples visible) | >30 FPS | F12 Performance tab → FPS meter | `perf_02_underwater.png` |
| **PERF-03** | Deep dive (10+ samples) | >30 FPS | F12 Performance tab → FPS meter | `perf_03_deep.png` |
| **PERF-04** | Camera rotation (fast mouse movement) | >30 FPS, no stutter | F12 Performance tab → Frame time | `perf_04_rotation.png` |
| **PERF-05** | Initial load time | <10 seconds | Measure from URL enter to game start | `perf_05_load.png` |
| **PERF-06** | Memory usage | <500 MB | F12 Performance → Memory tab | `perf_06_memory.png` |
| **PERF-07** | Asset load time | <5 seconds | Measure model loading duration | `perf_07_assets.png` |

### Performance Issues

If any performance test fails:
1. Document the failure with screenshots
2. Use F12 Performance profiler to identify bottleneck
3. Check for:
   - Too many polygons in 3D models
   - Unoptimized textures (too large)
   - Missing LOD (Level of Detail)
   - Excessive draw calls
   - Memory leaks

---

## 5. User Experience Tests (20 minutes)

**Purpose**: Test game from player perspective
**Evidence Required**: Playthrough notes, screenshots

### UX Test Scenarios

| Scenario | Steps | Success Criteria | Evidence |
|----------|-------|-----------------|----------|
| **UX-01**: First-time player | 1. Start game fresh<br>2. Follow tutorial<br>3. Complete first quest | Player understands controls, objective, and mechanics within 5 minutes | `ux_01_notes.md` |
| **UX-02**: Sample identification | 1. Dive and locate samples<br>2. Identify each type without collecting | Player can distinguish all 5 sample types from 10 units away | `ux_02_samples.png` |
| **UX-03**: Navigation | 1. Dive to find samples<br>2. Return to ship | Player can navigate back to ship using visual landmarks | `ux_03_navigation.png` |
| **UX-04**: Feedback clarity | 1. Collect sample<br>2. Run out of oxygen<br>3. Complete quest | Player receives clear feedback for each action (messages, HUD) | `ux_04_feedback.png` |
| **UX-05**: Camera comfort | 1. Play for 10 minutes<br>2. Use camera controls | Camera doesn't feel disorienting, submarine stays in view | `ux_05_camera_notes.md` |

### UX Evaluation Criteria

Rate each on a 1-5 scale:
- **Clarity**: Is it obvious what to do?
- **Visibility**: Can I see what I need to see?
- **Responsiveness**: Do controls feel good?
- **Guidance**: Does the game help me succeed?
- **Polish**: Does it look/feel professional?

---

## 6. Regression Tests (15 minutes)

**Purpose**: Ensure existing features still work
**Evidence Required**: Quick checks, screenshots if issues found

### Regression Checklist

| Feature | Quick Check | Pass/Fail |
|---------|-------------|-----------|
| Input handling | WASD, mouse, SPACE, SHIFT, E all work | ☐ |
| HUD display | Oxygen, depth, credits, inventory all visible | ☐ |
| Ocean rendering | Water surface, fog, depth gradient render | ☐ |
| Tutorial messages | All tutorial messages appear in sequence | ☐ |
| Pointer lock | Click to lock mouse, ESC to unlock | ☐ |
| UI modals | Research Ship UI opens/closes correctly | ☐ |
| Collision | Submarine doesn't clip through ocean floor | ☐ |
| Respawn | Respawn at surface works after oxygen depletion | ☐ |

---

## 7. Edge Case Tests (15 minutes)

**Purpose**: Test unusual scenarios that might break the game
**Evidence Required**: Console logs, screenshots

### Edge Cases

| Test | Steps | Expected Behavior | Evidence |
|------|-------|------------------|----------|
| **EDGE-01**: Dive below ocean floor | Try to dive past max depth | Submarine stops at floor or triggers barrier | `edge_01.png` |
| **EDGE-02**: Fly above surface | Try to ascend past Y=0 | Submarine stops at surface level | `edge_02.png` |
| **EDGE-03**: Collect at max inventory | Try to collect when 5/5 full | Message "Inventory Full", sample not collected | `edge_03.png` |
| **EDGE-04**: Open UI while diving | Open Research Ship UI while not at surface | UI shouldn't open (or close immediately) | `edge_04.png` |
| **EDGE-05**: Rapid key presses | Spam E key rapidly | No duplicate collections or errors | `edge_05_console.png` |
| **EDGE-06**: Model load failure | Simulate missing model file | Graceful fallback or error message (not crash) | `edge_06.png` |
| **EDGE-07**: Multiple quests | Accept 3 quests simultaneously | All tracked correctly in HUD | `edge_07.png` |
| **EDGE-08**: Buy upgrade twice | Try to buy same upgrade again | Button disabled or error shown | `edge_08.png` |

---

## 8. Cross-Browser Tests (Optional, 30 minutes)

**Purpose**: Verify game works on different browsers
**Evidence Required**: Screenshots from each browser

### Browser Support

| Browser | Version | Load Test | Gameplay Test | Performance | Evidence |
|---------|---------|-----------|---------------|-------------|----------|
| Chrome | Latest | ☐ | ☐ | ☐ | `browser_chrome.png` |
| Firefox | Latest | ☐ | ☐ | ☐ | `browser_firefox.png` |
| Safari | Latest (if macOS) | ☐ | ☐ | ☐ | `browser_safari.png` |
| Edge | Latest | ☐ | ☐ | ☐ | `browser_edge.png` |

---

## 9. Test Execution Protocol

### Before Testing

1. ✅ Pull latest code from branch
2. ✅ Run `npm install` to ensure dependencies
3. ✅ Create testing evidence folder: `docs/testing/run_YYYYMMDD_HHMM/`
4. ✅ Open test plan (this document) in second window

### During Testing

1. ✅ Run tests in order (Smoke → Visual → Functional → Performance → UX → Regression → Edge)
2. ✅ Capture evidence (screenshot/video/log) for EVERY test
3. ✅ Mark Pass/Fail immediately after each test
4. ✅ If test fails:
   - Document the failure with detailed description
   - Attach evidence (screenshot of bug)
   - Create bug report in bugs.md
   - STOP testing that section, note blockers
5. ✅ Use browser DevTools Console to check for errors
6. ✅ Keep notes in `test_session_notes.md`

### After Testing

1. ✅ Compile test results into summary report
2. ✅ Count: X passed, Y failed, Z blocked
3. ✅ List all bugs found with severity (Critical/Major/Minor)
4. ✅ Upload evidence folder to repo: `git add docs/testing/run_YYYYMMDD_HHMM/`
5. ✅ Create test summary: `docs/testing/run_YYYYMMDD_HHMM/TEST_SUMMARY.md`
6. ✅ If smoke test passed and no critical bugs: Ready for UAT
7. ✅ If critical bugs found: Fix and re-test before UAT

---

## 10. Test Summary Template

After completing all tests, create `TEST_SUMMARY.md`:

```markdown
# Test Summary - Visual Overhaul (Option C)

**Date**: YYYY-MM-DD
**Tester**: [Name or "Claude"]
**Build**: [Git commit hash]
**Duration**: [Total testing time]

## Overall Result

- **Status**: ✅ PASS / ⚠️ CONDITIONAL PASS / ❌ FAIL
- **Total Tests**: X
- **Passed**: X
- **Failed**: X
- **Blocked**: X

## Smoke Test Result

✅ All 15 smoke tests passed
⚠️ X smoke tests failed (see details)
❌ Smoke test failed - NOT READY FOR UAT

## Test Results by Category

### Visual Quality Tests
- Passed: X/30
- Failed: X/30
- Critical Issues: [List]

### Functional Tests
- Passed: X/30
- Failed: X/30
- Critical Issues: [List]

### Performance Tests
- Passed: X/7
- Failed: X/7
- Critical Issues: [List]

## Bugs Found

### Critical (Blocks UAT)
1. [Bug description] - Evidence: `file.png`

### Major (Should fix before UAT)
1. [Bug description] - Evidence: `file.png`

### Minor (Can defer)
1. [Bug description] - Evidence: `file.png`

## UAT Readiness

- ✅ Ready for UAT - All critical tests passed
- ⚠️ Conditional - Minor issues, UAT can proceed with notes
- ❌ Not Ready - Critical bugs must be fixed first

## Evidence Location

All test evidence stored in: `docs/testing/run_YYYYMMDD_HHMM/`

## Notes

[Any additional observations, recommendations, or concerns]

## Sign-off

Tester: [Name]
Date: YYYY-MM-DD
Approved for UAT: YES / NO
```

---

## 11. Pass/Fail Criteria

### Smoke Test
- **PASS**: All 15 items pass
- **FAIL**: Any item fails → STOP, fix, re-test

### Visual Quality Tests
- **PASS**: ≥90% pass (27/30), no critical visual bugs
- **CONDITIONAL**: ≥75% pass (23/30), only minor visual issues
- **FAIL**: <75% pass or any critical visual bug (e.g., model doesn't load)

### Functional Tests
- **PASS**: 100% pass (all core gameplay works)
- **CONDITIONAL**: ≥95% pass (1-2 minor bugs acceptable)
- **FAIL**: Any critical gameplay bug (e.g., can't collect samples)

### Performance Tests
- **PASS**: All benchmarks meet targets (>30 FPS, <10s load, <500MB memory)
- **CONDITIONAL**: 1-2 benchmarks slightly below target (25-29 FPS acceptable)
- **FAIL**: Major performance issues (FPS <20, load >20s, crashes)

### Overall UAT Readiness
- **READY**: Smoke PASS + Visual PASS + Functional PASS + Performance PASS
- **CONDITIONAL**: Smoke PASS + All others CONDITIONAL or better
- **NOT READY**: Smoke FAIL or any category FAIL

---

## 12. Testing Tools

### Required Tools

1. **Browser**: Chrome/Firefox with DevTools
2. **Screenshot Tool**: OS built-in (Cmd+Shift+4 on macOS, Win+Shift+S on Windows)
3. **Screen Recording**: OBS Studio, QuickTime, or browser extension (for GIFs)
4. **Text Editor**: For test notes
5. **Git**: For committing evidence

### Helpful DevTools Commands

```javascript
// Show FPS in console
const fpsCounter = new BABYLON.FpsCounter();
scene.registerBeforeRender(() => {
  console.log('FPS:', fpsCounter.getFps());
});

// Check loaded assets
console.log('Meshes:', scene.meshes.length);
console.log('Materials:', scene.materials.length);
console.log('Textures:', scene.textures.length);

// Memory usage (browser)
console.log('Memory:', performance.memory);
```

### Babylon.js Inspector

```javascript
// Enable inspector (in browser console)
scene.debugLayer.show();

// Features:
// - See all meshes in scene
// - Check material properties
// - View camera position/rotation
// - Monitor performance stats
// - Test lighting
```

---

## 13. Testing Schedule (Recommended)

| Phase | Duration | When |
|-------|----------|------|
| Smoke Test | 15 min | Immediately after implementation |
| Visual Quality | 30 min | After smoke test passes |
| Functional | 45 min | After visual tests pass |
| Performance | 15 min | After functional tests pass |
| UX | 20 min | After performance tests pass |
| Regression | 15 min | After UX tests pass |
| Edge Cases | 15 min | After regression tests pass |
| Documentation | 20 min | After all tests complete |
| **Total** | **2h 55m** | Can split into multiple sessions |

**Recommended**: Break into two sessions:
- **Session 1**: Smoke + Visual + Functional (1.5h)
- **Session 2**: Performance + UX + Regression + Edge + Docs (1.5h)

---

## 14. FAQ

**Q: What if I don't have time for all tests?**
A: Smoke test is MANDATORY. Functional tests are high priority. Others can be deferred if time-constrained, but document what was skipped.

**Q: What if a test is blocked by a previous failure?**
A: Mark it as "BLOCKED" and note the blocker. Fix the blocker first, then re-run blocked tests.

**Q: What if I don't know how to capture evidence?**
A: Use built-in OS screenshot tools. For GIFs, use online tools like EZGIF or browser extensions like Screencastify.

**Q: What if the game crashes during testing?**
A: This is a CRITICAL bug. Capture the console error, document steps to reproduce, and mark all remaining tests as BLOCKED until fixed.

**Q: Can I automate any of these tests?**
A: Yes! Functional tests can be automated with tools like Playwright. However, manual testing is still required for visual quality and UX.

---

## Conclusion

This testing plan ensures **thorough validation** of the visual overhaul. The key lesson from the Phase 1 UAT failure is:

> **Testing is not complete until the game has been run in a browser and evidence has been collected.**

By following this plan, we ensure that all critical functionality is verified, visual quality meets standards, and the game is truly ready for user acceptance testing.

---

**Document Status**: ✅ Ready for use
**Next Action**: Implement visual overhaul, then execute smoke test
**Approval Required**: No - Execute plan after implementation complete
