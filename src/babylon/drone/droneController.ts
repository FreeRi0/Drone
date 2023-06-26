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
    private body: AbstractMesh,
    private scene: Scene,
    private engine: Engine,
    private head: Mesh,
  ) {
    this.fly = new Fly(this.body, this.scene, this.engine, this.head);
  }
  setController(): void {
    this.fly.setMovementEvents();
  }
}
