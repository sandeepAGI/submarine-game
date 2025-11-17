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

    // Get movement input
    const direction = {
      forward: this.input.isKeyPressed('w'),
      backward: this.input.isKeyPressed('s'),
      left: this.input.isKeyPressed('a'),
      right: this.input.isKeyPressed('d'),
      up: this.input.isKeyPressed(' '), // Spacebar
      down: this.input.isKeyPressed('shift'),
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
