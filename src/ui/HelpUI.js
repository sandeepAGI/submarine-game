/**
 * Help UI - Shows controls and instructions (toggle with H key)
 */
export class HelpUI {
  constructor() {
    this.visible = false;
    this.panel = null;
    this.createHelpPanel();
    this.setupHelpToggle();
  }

  createHelpPanel() {
    // Create help panel container
    this.panel = document.createElement('div');
    this.panel.id = 'helpPanel';
    this.panel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 20, 40, 0.95);
      border: 3px solid #00ffff;
      border-radius: 10px;
      padding: 30px;
      color: #00ffff;
      font-family: 'Courier New', monospace;
      font-size: 16px;
      line-height: 1.8;
      z-index: 1000;
      min-width: 600px;
      max-width: 700px;
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
      display: none;
    `;

    this.panel.innerHTML = `
      <h2 style="color: #ffff00; text-align: center; margin: 0 0 20px 0; font-size: 24px;">
        🌊 SUBMARINE CONTROLS & GUIDE 🌊
      </h2>

      <div style="margin-bottom: 20px;">
        <h3 style="color: #00ff88; margin: 10px 0 5px 0; font-size: 18px;">MOVEMENT</h3>
        <div style="padding-left: 20px;">
          <strong>W</strong> - Move Forward<br>
          <strong>S</strong> - Move Backward<br>
          <strong>A</strong> - Strafe Left<br>
          <strong>D</strong> - Strafe Right<br>
          <strong>SPACE</strong> - Rise (Decrease Depth)<br>
          <strong>SHIFT</strong> - Sink (Increase Depth)<br>
          <strong>Mouse Drag</strong> - Rotate Camera
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="color: #00ff88; margin: 10px 0 5px 0; font-size: 18px;">ACTIONS</h3>
        <div style="padding-left: 20px;">
          <strong>E</strong> - Collect Sample / Interact with Research Ship<br>
          <strong>H</strong> - Toggle This Help Panel
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="color: #00ff88; margin: 10px 0 5px 0; font-size: 18px;">GAMEPLAY</h3>
        <div style="padding-left: 20px;">
          1. <strong style="color: #ffaa00;">Surface at the Research Ship</strong> (orange ship at 0m depth) and press <strong>E</strong> to accept quests<br>
          2. <strong style="color: #ffaa00;">Dive and collect samples</strong> - Look for glowing colored objects<br>
          3. <strong style="color: #ffaa00;">Sample labels appear</strong> when you get within 8 units<br>
          4. <strong style="color: #ffaa00;">Press E near samples</strong> to collect them<br>
          5. <strong style="color: #ffaa00;">Return to surface</strong> to complete quests and earn credits<br>
          6. <strong style="color: #ffaa00;">Buy upgrades</strong> at the Research Ship to dive deeper
        </div>
      </div>

      <div style="margin-bottom: 15px;">
        <h3 style="color: #00ff88; margin: 10px 0 5px 0; font-size: 18px;">HUD INDICATORS</h3>
        <div style="padding-left: 20px;">
          <strong style="color: #00ff00;">Oxygen</strong> - Refills when at surface (0m depth)<br>
          <strong style="color: #00ffff;">Depth</strong> - Your current depth in meters<br>
          <strong style="color: #ffaa00;">Credits</strong> - Currency for upgrades<br>
          <strong style="color: #ffffff;">Inventory</strong> - Samples collected (max 5)
        </div>
      </div>

      <div style="text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #00ffff;">
        <em style="color: #aaaaaa;">Press <strong style="color: #ffff00;">H</strong> or <strong style="color: #ffff00;">ESC</strong> to close this panel</em>
      </div>
    `;

    document.body.appendChild(this.panel);
  }

  setupHelpToggle() {
    // Listen for H key (toggle) and ESC key (close only)
    window.addEventListener('keydown', (evt) => {
      if (evt.key === 'h' || evt.key === 'H') {
        // H key always toggles
        this.toggle();
        evt.preventDefault();
      } else if (evt.key === 'Escape' && this.visible) {
        // ESC only closes if help is visible
        this.hide();
        evt.preventDefault();
      }
    });
  }

  toggle() {
    this.visible = !this.visible;
    this.panel.style.display = this.visible ? 'block' : 'none';
  }

  show() {
    this.visible = true;
    this.panel.style.display = 'block';
  }

  hide() {
    this.visible = false;
    this.panel.style.display = 'none';
  }
}
