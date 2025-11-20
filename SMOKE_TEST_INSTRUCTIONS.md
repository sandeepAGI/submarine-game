# Smoke Test Instructions

## Implementation Complete - Ready for Testing!

I've completed the visual overhaul implementation (Option C):

✅ **Third-person camera** - ArcRotateCamera with mouse orbit controls
✅ **3D model loaders** - GLB loading for submarine, samples, and research ship with improved fallback shapes
✅ **Floating labels** - Babylon.js GUI labels that appear near samples
✅ **Improved visuals** - Better materials, lighting, and emissive glows

## CRITICAL: Browser Testing Required

**The dev server is running on http://localhost:3000/**

⚠️ **I cannot open a browser in this environment, so you must run the smoke test manually.**

## Quick Smoke Test (5 minutes)

1. **Start the game**:
   - Open http://localhost:3000/ in your browser
   - Wait for game to load

2. **Check these critical items**:
   - [ ] Game loads without errors (check browser console F12)
   - [ ] Third-person camera shows submarine from behind/above
   - [ ] Submarine has improved shape (cylinder hull with fins)
   - [ ] Research ship is visible (orange, at origin 0,0,0)
   - [ ] Samples are larger and more distinctive (5 types with unique shapes)
   - [ ] Floating labels appear above samples when you get close
   - [ ] **Controls work**:
     - WASD = Move submarine
     - Mouse drag = Rotate camera around submarine
     - SPACE = Ascend (depth decreases)
     - SHIFT = Descend (depth increases)
     - E = Collect samples / interact with ship
   - [ ] Tutorial messages appear

3. **Test gameplay loop**:
   - [ ] Dive and collect a sample (E key)
   - [ ] Surface and approach orange ship
   - [ ] Press E near ship to open UI
   - [ ] See quests and upgrades

## Expected Behavior

### Third-Person Camera
- Camera orbits around submarine when you drag mouse
- Submarine is always visible
- Camera follows submarine smoothly

### Improved Visuals
- **Submarine**: Yellow cylinder with fins, conning tower, glowing headlight
- **Samples**:
  - Kelp: Tall green cylinder
  - Shell: Sphere with torus spiral
  - Coral: Branching structure
  - Fish: Ellipsoid body with tail
  - Starfish: Five-armed star shape
- **Research Ship**: Orange boxy ship with yellow beacon on top
- **Labels**: Dark rectangles with white text appear above samples when close

### Console Output
You should see these console messages:
```
Submarine 3D model not found, using fallback primitive shape
[Sample Name] 3D model not found, using fallback shape
Research Ship 3D model not found, using fallback shape
```

This is **expected** - we don't have actual GLB files yet, so fallback shapes are used.

## If You Find Bugs

Document with:
1. Screenshot or video
2. Steps to reproduce
3. Browser console errors (F12 → Console tab)
4. Expected vs actual behavior

## Full Smoke Test Checklist

For complete smoke test, see: `/docs/TESTING_PLAN.md` (Section 1)

That checklist has 15 items with evidence requirements (screenshots).

## What to Check For

**CRITICAL** issues (must fix before UAT):
- Game doesn't load (404, errors)
- Camera doesn't work (can't see submarine)
- Controls inverted or broken
- Samples invisible or indistinguishable
- Cannot collect samples
- Cannot open research ship UI

**MAJOR** issues (should fix soon):
- Performance < 20 FPS
- Labels don't appear
- Tutorial unclear
- Visuals too dark

**MINOR** issues (can defer):
- Sample shapes could be better
- Lighting could be improved
- UI polish

## Next Steps

After smoke test:
1. If all critical items pass → Ready for full UAT
2. If critical bugs found → I'll fix them before UAT
3. Document results in `docs/testing/smoke_test_[DATE]/`

---

**Note**: The dev server should still be running. If not, run:
```bash
npm run dev
```

Then open http://localhost:3000/ in your browser.

Happy testing! :)
