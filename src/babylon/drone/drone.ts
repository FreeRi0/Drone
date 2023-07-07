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
  ShadowGenerator,
  FollowCamera,
} from "@babylonjs/core";
import "@babylonjs/loaders";

import droneController from "./droneController";

export default class Drone {
  camera: UniversalCamera;
  camera2: FollowCamera;
  drone: AbstractMesh;
  head: Mesh;
  // vint: AbstractMesh;
  droneOpportunities: droneController;

  constructor(private scene: Scene, private engine: Engine) {
    this.camera = this.createController(this.scene, this.engine);
    // this.createVint();
    this.head = this.createHead();
    this.setBody(this.camera, this.scene);

    this.droneOpportunities = new droneController(
      this.drone,
      this.scene,
      this.engine,
      this.head
      // this.vint
    );
    this.droneOpportunities.setController();
    console.log(this.drone);
  }

  private createController(scene: Scene, engine: Engine): UniversalCamera {
    const camera = new UniversalCamera(
      "camera",
      new Vector3(0, 2, 10),
      this.scene
    );

    camera.minZ = 0;
    camera.inertia = 0;
    camera.angularSensibility = 600;
    return camera;
  }

  private followCam(scene: Scene, engine: Engine): FollowCamera {
    const camera2 = new FollowCamera(
      "camera2",
      new Vector3(10, 0, 10),
      this.scene
    );

    camera2.heightOffset = 2;
    camera2.rotationOffset = 180;
    camera2.cameraAcceleration = 0.1;
    camera2.maxCameraSpeed = 1;
    return camera2;
  }

  private createHead(): Mesh {
    const head = MeshBuilder.CreateSphere("head", {
      diameter: 0.2,
    });
    head.isVisible = true;
    head.position.y = 0.4;
    this.camera.parent = head;
    return head;
  }

  private setBody(camera: UniversalCamera, scene: Scene) {
    this.drone = new AbstractMesh("droneWrapper");
    SceneLoader.ImportMeshAsync("", "./models/", "DRONE_Vint.glb").then(
      (meshes) => {
        const InnerMesh = meshes.meshes[0];
        InnerMesh.billboardMode = 2;
        this.head.parent = this.drone;
        InnerMesh.parent = this.drone;
        this.drone.position.y = 15;

        // shadowGenerator.addShadowCaster(this.drone);
      }
    );

    // console.log(this.drone);
  }

  // private createVint() {
  //   this.vint = new AbstractMesh("droneWrapper");
  //   SceneLoader.ImportMeshAsync("", "./models/", "DRONE_Vint.glb").then(
  //     (meshes) => {
  //       const InnerMesh = meshes.meshes[1];
  //       InnerMesh.billboardMode = 2;
  //       this.drone.parent = this.vint;
  //       InnerMesh.parent = this.vint;
  //       this.vint.position.y = 1.5;
  //     }
  //   );
  // }
}
