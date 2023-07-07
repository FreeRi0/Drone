import {
  Scene,
  Engine,
  Vector3,
  MeshBuilder,
  PBRMaterial,
  Texture,
  SceneLoader,
  Space,
  AbstractMesh,
  StandardMaterial,
  DirectionalLight,
  UniversalCamera,
  CannonJSPlugin,
  PhysicsImpostor,
  HDRCubeTexture,
  FollowCamera,
  ShadowGenerator,

} from "@babylonjs/core";
import "@babylonjs/materials";
import "@babylonjs/loaders";
import { Inspector } from "@babylonjs/inspector";
import Drone from './drone/drone';
import * as CANNON from "cannon";

export default class BasicScene {
  scene: Scene;
  engine: Engine;
  controller: Drone;
  // canvas: HTMLCanvasElement;
  camera: UniversalCamera;
  light: DirectionalLight;

  constructor(private canvas: HTMLCanvasElement) {
    this.engine = new Engine(this.canvas, true, { stencil: true });
    this.scene = this.CreateScene();
    this.CreateEnvironment();
    this.controller = new Drone(this.scene, this.engine);
    this.camera = this.controller.camera;
    this.createInspector();
    this.createSkyBox();
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

   CreateScene(): Scene {

    const scene = new Scene(this.engine);

    this.light = new DirectionalLight(
      "directionalLight",
      new Vector3(0.947, -0.319, -0.04),
      this.scene
    );

    this.light.position = new Vector3(-10, -0.319, -0.04);

    this.light.intensity = 0.9;

    const framesPerSecond = 60;
    const shadowGenerator = new ShadowGenerator(1024, this.light);
    const gravity = -9.81;
    scene.gravity = new Vector3(0, gravity / framesPerSecond, 0);
    scene.collisionsEnabled = true;
    // this.scene.debugLayer.show();

    return scene;
  }

  async enablePhysic(): Promise<void> {
    this.scene.enablePhysics(
      new Vector3(0, -9.81, 0),
      new CannonJSPlugin(true, 10, CANNON)
    );
  }

 async CreateEnvironment(): Promise<void> {
  this.enablePhysic();
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 1000, height: 1000 },
      this.scene
    );

    ground.physicsImpostor = new PhysicsImpostor(
      ground,
      PhysicsImpostor.PlaneImpostor,
      { mass: 0 }
    );

    ground.checkCollisions = true;
    ground.position.y = 4.359;
    ground.material = this.CreateAsphalt();

    // const homeMeshes = await SceneLoader.ImportMeshAsync(
    //   "",
    //   "./models/",
    //   "Buildingg.glb"
    // );
    // const home = homeMeshes.meshes[1];
    // home.physicsImpostor = new PhysicsImpostor(
    //   home,
    //   PhysicsImpostor.BoxImpostor,
    //   { mass: 100 }
    // );

    // home.position.y = home.position.y - home.position.y / 2;
    // home.checkCollisions = true;

    // const homeBox = MeshBuilder.CreateBox("homeBox", {
    //   width: 5,
    //   height: 5,
    //   depth: 5,
    // });
    // homeBox.position.set(-0.001, 6.513, -5.405);
    // homeBox.scaling.set(0.838, 0.864, 1.235);

    // homeBox.physicsImpostor = new PhysicsImpostor(
    //   homeBox,
    //   PhysicsImpostor.BoxImpostor,
    //   { mass: 0 }
    // );
    // homeBox.checkCollisions = true;
    // homeBox.isVisible = false;
  }

  CreateAsphalt(): PBRMaterial {
    const pbr = new PBRMaterial("pbr", this.scene);
    pbr.albedoTexture = new Texture(
      "./textures/asphalt/asphalt_diffuse.jpg",
      this.scene
    );

    pbr.bumpTexture = new Texture(
      "./textures/asphalt/asphalt_normal.jpg",
      this.scene
    );

    pbr.invertNormalMapX = true;
    pbr.invertNormalMapY = true;

    pbr.useAmbientOcclusionFromMetallicTextureRed = true;

    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;

    pbr.metallicTexture = new Texture(
      "./textures/asphalt/asphalt_ao_rough_metal.jpg",
      this.scene
    );

    return pbr;
  }

  createSkyBox(): void {
    const skyboxMaterial = new HDRCubeTexture(
      "./enviroments/towns.hdr",
        this.scene,
      1000
    );
    this.scene.createDefaultSkybox(skyboxMaterial, true);
  }

  createInspector(): void {
    const secondCamera = new UniversalCamera(
      "secondCamera",
      new Vector3(0, 3, 0),
      this.scene
    );
    secondCamera.minZ = 0;

    secondCamera.speed = 0.3;

    secondCamera.keysUp.push(87);
    secondCamera.keysLeft.push(65);
    secondCamera.keysDown.push(83);
    secondCamera.keysRight.push(68);

    this.scene.onKeyboardObservable.add((evt) => {
      if (evt.type === 2 && evt.event.code === "KeyU") {
        secondCamera.attachControl();
        this.camera.detachControl();
        Inspector.Show(this.scene, {});
        this.engine.exitPointerlock;
        this.scene.activeCameras = [];
        this.scene.activeCameras.push(secondCamera);
      } else if (evt.type === 2 && evt.event.code === "KeyO") {
        if (!this.engine.isPointerLock) this.engine.enterPointerlock();
        secondCamera.detachControl();
        this.camera.attachControl();
        Inspector.Hide();
        this.scene.activeCameras = [];
        this.scene.activeCameras.push(this.camera);
      }
    });
  }

  // MoveDron(player: any): void {
  //   this.gamepadManager.onGamepadConnectedObservable.add(
  //     (gamepad: any, state: any) => {
  //       //connectionText.text = "Connected: " + gamepad.id;
  //        if (gamepad instanceof DualShockPad) {
  //         // Generic button down/up events
  //         gamepad.onButtonDownObservable.add((button, state)=>{
  //           if(gamepad.buttonL1){
  //             this.drone.position.y-=1
  //           }
  //       })

  //       gamepad.onButtonUpObservable.add((button, state)=>{
  //         if(gamepad.buttonR1){
  //           this.drone.position.y+=1
  //         }
  //       })
  //         // Stick events
  //         gamepad.onleftstickchanged((values) => {
  //           // Roll
  //           if (this.flightMode == 'acro') {
  //               this.drone.rotate(new Vector3(0, 0, 1), values.y.toFixed(1), Space.LOCAL);
  //           };

  //           if (this.flightMode == "angle") {
  //             // this.drone.rotationQuaternion = Quaternion.RotationAxis(new Vector3(0, 0, 1), values.y.toFixed(1));
  //             this.roll = values.y.toFixed(3);
  //             this.yprQuaternion = Quaternion.RotationYawPitchRoll(
  //               this.yaw,
  //               this.pitch,
  //               this.roll
  //             );
  //             player.rotationQuaternion = this.yprQuaternion;
  //           }
  //           // Pitch
  //           if (this.flightMode == 'acro') {
  //               this.drone.rotate(new Vector3(1, 0, 0), values.x.toFixed(1), Space.LOCAL);
  //           };

  //           if (this.flightMode == "angle") {
  //             //drone.rotationQuaternion = new Quaternion.RotationAxis(new Vector3(1, 0, 0), values.x.toFixed(1));
  //             this.pitch = values.x.toFixed(3);
  //             this.yprQuaternion = Quaternion.RotationYawPitchRoll(
  //               this.yaw,
  //               this.pitch,
  //               this.roll
  //             );
  //             player.rotationQuaternion = this.yprQuaternion;
  //           }
  //         });

  //         gamepad.onrightstickchanged((values) => {
  //           // Throttle
  //           this.throttle = values.x.toFixed(3);
  //           this.drone.position.y = values.x;
  //           player.physicsBody.applyForce (new Vector3(0, this.throttle, 0), 0);

  //           // Yaw
  //           if (this.flightMode == "angle") {
  //             this.yaw = values.y.toFixed(3);
  //             var rotationAxis = new Vector3(0, 1, 0); // el eje de rotación
  //             player.body.setAngularDamping(this.angularDamping);
  //             player.body.setAngularVelocity(rotationAxis.scale(this.yaw));
  //           }
  //         });
  //       }
  //     }
  //   );
  // }
}
