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
      this.head
    );
    this.droneOpportunities.setController();
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
    return camera;
  }

  private createHead(): Mesh {
    const head = MeshBuilder.CreateSphere("head", {
      diameter: 0.2,
    });
    head.position.y = 0.4;
    head.isPickable = false;
    head.metadata = { isTool: false };
    this.camera.parent = head;
    return head;
  }

  private setBody(camera: UniversalCamera, scene: Scene) {

    const InnerMesh = SceneLoader.ImportMesh(
      "",
      "./models/",
      "DRONE_Vint.glb",
      this.scene
    );
    this.head.parent = this.drone;
    InnerMesh.billboardMode = 2;
    this.drone = new AbstractMesh("playerWrapper");
    InnerMesh.parent = this.drone;
    this.drone.metadata = { isTool: false };
    InnerMesh.metadata = { isTool: false };
    InnerMesh.position.y = -0.35;
    // InnerMesh.isVisible = false;
    this.drone.position.y = 20;
    // this.body.position.z = -7;
  }
}
