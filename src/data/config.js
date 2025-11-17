// Game Configuration and Constants

export const GAME_CONFIG = {
  // Oxygen System
  BASE_OXYGEN_CAPACITY: 60, // seconds
  OXYGEN_DEPLETION_RATE: 1, // per second
  OXYGEN_REFILL_RATE: 10, // per second at surface

  // Depth Zones (Phase 1: only shallow zone)
  SURFACE_LEVEL: 0,
  SHALLOW_ZONE_MAX: 50,

  // Submarine Movement
  BASE_MOVE_SPEED: 5,
  BASE_ROTATION_SPEED: 1,
  SURFACE_THRESHOLD: 2, // meters - considered at surface if above this

  // Collection
  COLLECTION_RANGE: 3, // meters
  BASE_INVENTORY_CAPACITY: 5,

  // Research Ship
  RESEARCH_SHIP_POSITION: { x: 0, y: 0, z: 0 },
  UI_INTERACTION_RANGE: 5,

  // Visual
  OCEAN_SIZE: 200, // width and depth of ocean floor
  FOG_DENSITY: 0.01,
  WATER_COLOR: { r: 0, g: 0.2, b: 0.4 },
};

export const INITIAL_STATE = {
  oxygen: GAME_CONFIG.BASE_OXYGEN_CAPACITY,
  maxOxygen: GAME_CONFIG.BASE_OXYGEN_CAPACITY,
  depth: 0,
  credits: 0,
  inventory: [],
  inventoryCapacity: GAME_CONFIG.BASE_INVENTORY_CAPACITY,
  moveSpeed: GAME_CONFIG.BASE_MOVE_SPEED,
  activeQuest: null,
  upgrades: {
    oxygen: 1,
    speed: 1,
  },
};
