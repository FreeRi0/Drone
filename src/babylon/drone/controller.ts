import { KeyboardInfo } from "@babylonjs/core";

export default class ControllEvents {
  public forward = false;
  public right = false;
  public back = false;
  public left = false;
  public run = false;
  public jump = false;
  // public pickInHand = false;
  // public pickInInventar = false;
  // public drop = false;
  // public takeApart = false;
  public number: number;

  public handleControlEvents(event: KeyboardInfo) {
    if (event.event.code === "KeyW") this.forward = event.type === 1;
    if (event.event.code === "KeyS") this.back = event.type === 1;
    if (event.event.code === "KeyD") this.right = event.type === 1;
    if (event.event.code === "KeyA") this.left = event.type === 1;
    if (event.event.code === "ShiftLeft") this.run = event.type === 1;
    if (event.event.code === "Space") this.jump = event.type === 1;
    // // if (event.event.code === "KeyT") this.drop = event.type === 1;
    // if (event.event.code === "KeyF") this.takeApart = event.type === 1;
    if (
      event.event.inputIndex >= 49 &&
      event.event.inputIndex <= 56 &&
      event.type === 1
    ) {
      this.number = +event.event.key;
    } else this.number = 0;
  }
}
