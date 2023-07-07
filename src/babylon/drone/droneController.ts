import {
  UniversalCamera,
  Scene,
  Mesh,
  AbstractMesh,
  Engine,
} from "@babylonjs/core";

import Fly from "./fly";

export default class playerController {
  private fly: Fly;

  constructor(
    private drone: AbstractMesh,
    private scene: Scene,
    private engine: Engine,
    private head: Mesh,
    // private vint: AbstractMesh
  ) {
    this.fly = new Fly(this.drone, this.scene, this.engine, this.head);
  }
  setController(): void {
    this.fly.setMovementEvents();
  }
}
