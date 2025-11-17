# User Acceptance Testing (UAT) Instructions
## Submarine Sample Collection Game - Phase 1

---

## Getting Started

### 1. Prerequisites
- Modern web browser (Chrome, Firefox, or Safari recommended)
- Development server running on http://localhost:3000/

### 2. Open the Game
1. Navigate to http://localhost:3000/ in your browser
2. You should see a dark blue ocean scene with a yellow submarine
3. The HUD should display in the corners of the screen

### 3. Initial Setup
- **Click anywhere on the canvas** to lock your mouse pointer (for camera control)
- Read the welcome messages that appear at the bottom of the screen
- Press **ESC** at any time to unlock the mouse pointer

---

## Basic Controls

| Action | Control |
|--------|---------|
| Move Forward | W |
| Move Backward | S |
| Strafe Left | A |
| Strafe Right | D |
| Move Up (ascend) | SPACE |
| Move Down (descend) | SHIFT |
| Look Around | Mouse Movement (when pointer locked) |
| Collect Sample | E (when near sample) |
| Open Research Ship UI | E (when at surface near origin) |
| Close UI | ESC |

---

## Phase 1 Gameplay Loop

### Step 1: Accept a Quest
1. **Surface the submarine** (press SPACE until depth is <= 2m)
2. **Move to origin** (position near 0,0,0 - the starting area)
3. **Press E** to open the Research Ship UI
4. **Click "ACCEPT QUEST: First Collection"**
5. Quest appears in top-right HUD
6. **Close UI** (ESC or click CLOSE button)

**Quest Objective**: Collect 2 Kelp and 1 Conch Shell

---

### Step 2: Dive and Collect Samples
1. **Dive underwater** (press SHIFT to descend)
2. **Navigate** using WASD and mouse
3. **Look for samples** (colored objects floating near ocean floor)
   - **Kelp**: Green, tall cylinders
   - **Conch Shell**: Orange/tan spheres
   - **Coral**: Red boxes
   - **Small Fish**: Cyan capsules
   - **Starfish**: Pink tori (donut shapes)
4. **Get close to a sample** (within 3 meters)
5. **Press E to collect** (should see "Collected: [Sample Name]" message)
6. **Monitor your oxygen** (top-left HUD - don't let it reach 0%!)
7. **Check quest progress** (top-right HUD shows collected/required)

**Important**:
- You can only carry 5 samples at a time
- Oxygen depletes at 1% per second underwater
- Return to surface before oxygen runs out!

---

### Step 3: Return to Surface
1. **Press SPACE** to ascend
2. **Watch depth meter** - when it shows <= 2m, you're at surface
3. **Oxygen refills automatically** at surface (10% per second)
4. **Navigate back to origin** (0,0,0) if needed

---

### Step 4: Complete Quest
1. **Press E** at surface near origin to open Research Ship UI
2. **Check quest progress** in Quest Terminal section
3. If objectives are met, **click "COMPLETE QUEST"**
4. **Receive 100 credits**
5. Inventory is cleared (samples delivered)
6. Quest becomes available again

---

### Step 5: Purchase Upgrades
1. In Research Ship UI, scroll to **Upgrade Station** section
2. Two upgrades available:
   - **Extended Oxygen Tank** (200 credits) - doubles oxygen capacity
   - **Enhanced Engine** (150 credits) - 50% faster movement
3. **Click "PURCHASE"** on desired upgrade (if you have enough credits)
4. Upgrade applies immediately
5. **Close UI** and test the upgrade

---

## Testing Checklist

Please test the following and report any issues:

### Core Movement ✓
- [ ] Submarine moves forward/backward with W/S
- [ ] Submarine strafes left/right with A/D
- [ ] Submarine ascends/descends with SPACE/SHIFT
- [ ] Mouse controls camera rotation
- [ ] Submarine doesn't pass through ocean floor
- [ ] Submarine doesn't escape ocean boundaries

### Oxygen System ✓
- [ ] Oxygen depletes at 1% per second underwater
- [ ] Oxygen stops depleting at surface
- [ ] Oxygen refills at surface
- [ ] Oxygen bar turns red when low (<= 20%)
- [ ] Submarine respawns when oxygen reaches 0%
- [ ] Inventory cleared on respawn

### Sample Collection ✓
- [ ] 15 samples visible in ocean
- [ ] Samples have different colors/shapes
- [ ] Press E near sample collects it
- [ ] Collection message appears
- [ ] Inventory count increases
- [ ] Cannot collect when inventory full (5/5)
- [ ] Sample disappears after collection

### HUD Display ✓
- [ ] Oxygen percentage displays correctly
- [ ] Depth displays correctly
- [ ] Credits display correctly
- [ ] Quest objectives display correctly
- [ ] Quest progress updates when collecting samples
- [ ] Inventory count displays correctly

### Quest System ✓
- [ ] Can accept "First Collection" quest
- [ ] Quest objectives: 2 Kelp, 1 Conch Shell
- [ ] Progress updates as samples collected
- [ ] Can complete quest when objectives met
- [ ] Receive 100 credits on completion
- [ ] Inventory cleared after completion
- [ ] Can accept quest again (repeatable)

### Upgrade System ✓
- [ ] Can purchase Extended Oxygen Tank (200 credits)
- [ ] Oxygen capacity increases to 120s after purchase
- [ ] Can purchase Enhanced Engine (150 credits)
- [ ] Movement speed increases after purchase
- [ ] Cannot purchase without enough credits
- [ ] Upgrades persist across dives/respawns

### Research Ship UI ✓
- [ ] Can open UI at surface near origin with E key
- [ ] Quest Terminal shows active quest or accept button
- [ ] Upgrade Station shows available upgrades
- [ ] Can close UI with ESC or CLOSE button
- [ ] UI buttons work correctly

---

## Known Issues / Limitations (Phase 1)

These are intentional for Phase 1:

1. **Only 15 samples total** - samples don't respawn
2. **Only one repeatable quest** - same quest each time
3. **No save/load** - refreshing page resets game
4. **No 3D research ship** - just UI overlay
5. **No combat or enemies** (Phase 2)
6. **No armor/health system** (Phase 2)
7. **Limited upgrades** - only 2 tiers each

---

## How to Report Bugs

If you encounter any bugs, please note:

1. **What you were doing** (steps to reproduce)
2. **What you expected to happen**
3. **What actually happened**
4. **Any error messages** (check browser console with F12)
5. **Browser and OS** you're using

---

## Expected Test Duration

- **Quick test** (basic functionality): 10-15 minutes
- **Thorough test** (all features): 30-45 minutes

---

## Success Criteria

Phase 1 is considered complete if you can:

✓ Dive underwater and navigate smoothly
✓ Collect samples with E key
✓ Complete a quest successfully
✓ Earn credits and purchase an upgrade
✓ Respawn when oxygen depletes
✓ See all HUD elements update correctly

---

## Need Help?

- **Controls not working?** Make sure mouse pointer is locked (click canvas)
- **Can't collect samples?** Get within 3 meters and press E
- **Can't open Research Ship UI?** Surface (depth <= 2m) and move to origin
- **Oxygen depleting too fast?** Purchase Extended Oxygen Tank upgrade
- **Game won't load?** Check browser console (F12) for errors

---

## After Testing

Once you've completed testing:
1. Report any bugs or issues found
2. Provide feedback on gameplay feel
3. Approve Phase 1 or request changes
4. We'll move to Phase 2 development

Thank you for testing!

---

**UAT Version**: 1.0
**Date**: 2025-11-16
**Phase**: 1 - Core Mechanics Prototype
