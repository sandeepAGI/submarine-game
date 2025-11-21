# 3D Model Assets Guide

This directory contains 3D models for the submarine game.

## Required Models

### 1. Submarine Model
**File name:** `submarine.glb` (place in `src/assets/models/`)

**Recommended Sources:**
- **Kenney Watercraft Kit** (CC0, free): https://kenney.nl/assets/watercraft-kit
  - Download ZIP, extract, look for submarine model, rename to `submarine.glb`

- **Sketchfab - Submarine by IrisProcess** (CC-BY): https://sketchfab.com/3d-models/submarine-e55fa485c92949818b1f10adf1fc3c73
  - Click "Download 3D Model" → Select GLB format
  - Rename downloaded file to `submarine.glb`

### 2. Research Ship Model
**File name:** `research-ship.glb` (place in `src/assets/models/`)

**Recommended Sources:**
- **Kenney Watercraft Kit** (CC0, free): https://kenney.nl/assets/watercraft-kit
  - Look for larger ship/vessel, rename to `research-ship.glb`

- **Sketchfab - Search "research vessel"**: https://sketchfab.com/search?q=research+vessel&type=models
  - Filter by "Downloadable" and "Free"
  - Download as GLB, rename to `research-ship.glb`

### 3. Sample Models (Optional)
**Location:** `src/assets/models/samples/`

Sample collection items like coral, kelp, rocks, etc. The game will use procedural models if these aren't provided.

---

## Download Instructions

### Method 1: Kenney Watercraft Kit (EASIEST - All-in-one)

1. Visit: https://kenney.nl/assets/watercraft-kit
2. Click the download button (no account needed)
3. Extract the ZIP file
4. Look in the folder for:
   - A submarine or underwater vessel → rename to `submarine.glb`
   - A larger ship/vessel → rename to `research-ship.glb`
5. Copy both files to `src/assets/models/`

**File structure should be:**
```
src/assets/models/
├── submarine.glb
├── research-ship.glb
└── samples/ (optional)
```

### Method 2: Sketchfab (Higher Quality)

1. Create free Sketchfab account: https://sketchfab.com/signup
2. Download submarine:
   - Go to: https://sketchfab.com/3d-models/submarine-e55fa485c92949818b1f10adf1fc3c73
   - Click "Download 3D Model"
   - Select "Autoconverted format (glTF)" → "glTF Binary (.glb)"
   - Rename to `submarine.glb`
3. Download research ship:
   - Search: https://sketchfab.com/search?q=research+ship&type=models&features=downloadable&sort_by=-likeCount
   - Find a ship you like with "Free Download"
   - Download as GLB
   - Rename to `research-ship.glb`
4. Copy both to `src/assets/models/`

---

## Verification

After downloading models, verify they work:

```bash
ls -lh src/assets/models/
# Should show:
# submarine.glb (should be > 100 KB)
# research-ship.glb (should be > 100 KB)
```

Then run the game:
```bash
npm run dev
```

The game will automatically load GLB models if they exist, otherwise it falls back to procedural geometry.

---

## License Compliance

### CC0 (Kenney)
- No attribution required
- Can use commercially
- Can modify freely

### CC-BY (Sketchfab)
- **MUST credit the original artist**
- Add to your game's credits or README
- Example: "Submarine model by [Artist Name] (https://sketchfab.com/...) - CC-BY 4.0"

---

## Alternative: I Can Download For You

If you have trouble downloading, you can:
1. Download the models yourself to your local machine
2. Upload them to the repository root (I can then move them to the correct location)

**Or** provide me with direct .glb file URLs if you find any, and I can download them programmatically.

---

## Current Status

The game code already supports loading GLB models:
- `src/entities/Submarine.js` - Tries to load `submarine.glb`
- `src/entities/ResearchShip.js` - Tries to load `research-ship.glb`
- `src/entities/Sample.js` - Tries to load from `samples/` directory

If models are not found, the game uses procedural fallback geometry (which you've noted is too crude).
