import {
  Scene,
  Engine,
  Vector3,
  MeshBuilder,
  UniversalCamera,
  StandardMaterial,
  Color3,
  Mesh,
  TransformNode,
  SceneLoader,
  AbstractMesh,
  Axis,
  Space,
  ActionManager,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import droneController from "./droneController";


export default class Drone {
  camera: UniversalCamera;
  drone: AbstractMesh;
  head: Mesh;
  droneOpportunities: droneController;

  constructor(private scene: Scene, private engine: Engine) {
    this.camera = this.createController(this.scene, this.engine);
    this.setBody(this.camera, this.scene);
    this.head = this.createHead();

    this.droneOpportunities = new droneController(
      this.drone,
      this.scene,
      this.engine,
      this.head,
    );
    this.characterOpportunities.setController();
  }

  private createController(scene: Scene, engine: Engine): UniversalCamera {
    const camera = new UniversalCamera(
      "camera",
      new Vector3(0, 0, 0),
      this.scene
    );

    camera.minZ = 0;
    camera.inertia = 0;
    camera.angularSensibility = 600;

    // this.gunSight = this.addGunSight(scene);

    return camera;
  }

  private createHead(): Mesh {
    const head = MeshBuilder.CreateSphere("head", {
      diameter: 0.2,
    });
    head.parent = this.drone;
    head.position.y = 0.4;
    head.isPickable = false;
    head.metadata = { isTool: false };
    this.camera.parent = head;
    return head;
  }


}