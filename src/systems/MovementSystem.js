/**
 * Movement system - handles submarine movement based on input
 * NOTE: With third-person camera, mouse controls camera orbit (handled by ArcRotateCamera)
 */
export class MovementSystem {
  constructor(input) {
    this.input = input;
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

    // Apply movement - WASD moves in submarine's local axes (tank controls)
    submarine.move(direction, deltaTime);

    // Note: Submarine rotation can be controlled by Q (turn left) if needed in future
    // For now, submarine maintains orientation, player uses strafing (A/D) to navigate
    // Mouse controls camera orbit around submarine (handled by ArcRotateCamera)
  }
}
