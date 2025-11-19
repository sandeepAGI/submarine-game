/**
 * Movement system - handles submarine movement based on input
 */
export class MovementSystem {
  constructor(input) {
    this.input = input;
    this.mouseSensitivity = 0.002;
  }

  update(deltaTime, entities) {
    const submarine = entities.submarine;
    if (!submarine) return;

    // Get movement input (check both key names and codes for reliability)
    const direction = {
      forward: this.input.isKeyPressed('w') || this.input.isKeyPressed('keyw'),
      backward: this.input.isKeyPressed('s') || this.input.isKeyPressed('keys'),
      left: this.input.isKeyPressed('a') || this.input.isKeyPressed('keya'),
      right: this.input.isKeyPressed('d') || this.input.isKeyPressed('keyd'),
      up: this.input.isKeyPressed(' ') || this.input.isKeyPressed('space'),
      down: this.input.isKeyPressed('shift') || this.input.isKeyPressed('shiftleft') || this.input.isKeyPressed('shiftright'),
    };

    // Apply movement
    submarine.move(direction, deltaTime);

    // Get mouse movement for rotation
    if (this.input.pointerLocked) {
      const mouse = this.input.getMouseMovement();
      const rotation = {
        yaw: -mouse.x * this.mouseSensitivity,
        pitch: -mouse.y * this.mouseSensitivity,
      };

      submarine.rotate(rotation, deltaTime);
    }
  }
}
