import {
  Scene,
  Engine,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  CubeTexture,
  PBRMaterial,
  Texture,
  SceneLoader,
  Quaternion,
  GenericPad,
  Xbox360Button,
  Xbox360Pad,
  PhysicsAggregate,
  PhysicsMotionType,
  PhysicsShapeType,
  ArcRotateCamera,
  GamepadManager,
  Space,
  AbstractMesh,
} from "@babylonjs/core";
import "@babylonjs/materials";
import "@babylonjs/loaders";
import { throttle } from "quasar";
import { PhysicsEngine, HavokPlugin } from "@babylonjs/core/Physics";
import HavokPhysics from "@babylonjs/havok";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";

export class BasicScene {
  gamepadManager: any;
  scene: Scene;
  engine: Engine;
  drone: any;
  canvas: HTMLCanvasElement;
  flightMode: string = "";
  roll: any;
  yaw: any;
  pitch: any;
  yprQuaternion: any;
  throttle: any;
  angularDamping: any;
  prop1: any;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    // console.log(this.canvas);
    this.engine = new Engine(this.canvas, true);
    // console.log(this.engine);
    this.scene = new Scene(this.engine);
    this.gamepadManager = new GamepadManager();
  }

  async CreateScene(): Promise<Scene> {
    const havokInstance = await HavokPhysics();
    // pass the engine to the plugin
    const hk = new HavokPlugin(true, havokInstance);

    // enable physics in the scene with a gravity
    this.scene.enablePhysics(new Vector3(0, -9.8, 0), hk);

    const camera = new ArcRotateCamera(
      "ArcRotateCamera",
      0.3,
      1.2,
      5,
      new Vector3(0, 0, 0),
      this.scene
    );

    this.flightMode = "angle";
    this.throttle = 0;
    this.yaw = 0;
    this.pitch = 0;
    this.roll = 0;
    this.yprQuaternion = Quaternion.RotationYawPitchRoll(
      this.yaw,
      this.pitch,
      this.roll
    );
    this.prop1 = AbstractMesh;
    this.drone = AbstractMesh;

    this.angularDamping = 10;

    camera.setTarget(Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(this.canvas, true);
    camera.allowUpsideDown = false;
    camera.panningSensibility = 0;
    camera.panningSensibility = 0;
    (camera as any).cameraAcceleration = 0.1; // how fast to move
    (camera as any).maxCameraSpeed = 2; // speed limit
    camera.pinchDeltaPercentage = 0.0006;
    camera.wheelPrecision = 20;

    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      this.scene
    );

    hemiLight.intensity = 0.7;

    this.CreateDron();

    this.scene.debugLayer.show();

    // const { meshes } = await SceneLoader.ImportMeshAsync(
    //   "",
    //   "./models/",
    //   "Drone3.glb",
    //   this.scene,
    //   (newMeshes) => {
    //     console.log(meshes);

    //     this.drone = newMeshes[0];

    //   }
    // );


    // // drone.scaling.scaleInPlace(0.25);
    // this.prop1 = this.scene.getMeshByName("mesh_588");

    // Bake transform to plane

    this.drone = MeshBuilder.CreateBox("box");
    this.drone.position.y = 0.3;
    this.drone.rotate(new Vector3(0, 1, 0), Math.PI / 2, Space.WORLD);
    this.drone.bakeCurrentTransformIntoVertices();

    // Create a sphere shape and the associated body. Size will be determined automatically.
    var dummyPhysicsRoot = MeshBuilder.CreateBox(
      "dummyPhysicsRoot",
      { size: 1, height: 0.4, width: 1 },
      this.scene
    );
    dummyPhysicsRoot.addChild(this.drone);
    // DummyPhysicsRoot Visibility Change to 0 to Hide
    dummyPhysicsRoot.visibility = 0.2;
    dummyPhysicsRoot.position.y = 1;

    var dummyAggregate = new PhysicsAggregate(
      dummyPhysicsRoot,
      PhysicsShapeType.BOX,
      { mass: 1, restitution: 0.1 },
      this.scene
    );
    dummyAggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);

    this.MoveDron(dummyAggregate);

    dummyAggregate.body.setMassProperties({
      inertia: new Vector3(1, 0, 1),
      centerOfMass: new Vector3(0, -1, 0),
    });

    // this.drone.position.y = -0.2;
    // this.drone.scaling.scaleInPlace(0.25);
    // this.prop1 = this.scene.getMeshByName("mesh_588");
    // var dummyPhysicsRoot = MeshBuilder.CreateBox(
    //   "dummyPhysicsRoot",
    //   { size: 1, height: 0.4, width: 1 },
    //   this.scene
    // );
    // dummyPhysicsRoot.addChild(this.drone);
    // dummyPhysicsRoot.visibility = 0.2;
    // dummyPhysicsRoot.position.y = 1;

    // var dummyAggregate = new PhysicsAggregate(
    //   dummyPhysicsRoot,
    //   PhysicsShapeType.BOX,
    //   { mass: 1, restitution: 0.1 },
    //   this.scene
    // );
    // dummyAggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);

    // this.MoveDron(dummyAggregate);

    // dummyAggregate.body.setMassProperties({
    //   inertia: new Vector3(1, 0, 1),
    //   centerOfMass: new Vector3(0, -1, 0),
    // });

    //  this.drone.rotate(new Vector3(0, 1, 0), Math.PI / 2, Space.WORLD);
    // this.drone.bakeCurrentTransformIntoVertices();

    this.CreateEnvironment();

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "./enviroments/desert.env",
      this.scene
    );

    this.scene.createDefaultSkybox(envTex, true);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
    return this.scene;
  }

  async CreateDron(): Promise<void> {
    const { meshes } = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "Drone3.glb"
    );

    console.log(meshes);
  }

  CreateEnvironment(): void {
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 50, height: 50 },
      this.scene
    );

    ground.position.y = -2;
    ground.material = this.CreateAsphalt();

    var groundAggregate = new PhysicsAggregate(
      ground,
      PhysicsShapeType.BOX,
      { mass: 0, restitution: 0.1 },
      this.scene
    );
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

    // pbr.roughness = 1;

    return pbr;
  }

  MoveDron(player: any): void {
    this.gamepadManager.onGamepadConnectedObservable.add(
      (gamepad: any, state: any) => {
        //connectionText.text = "Connected: " + gamepad.id;

        // Handle gamepad types
        if (gamepad instanceof Xbox360Pad) {
          // // Xbox button down/up events
          gamepad.onButtonDownObservable.add((button, state) => {
            console.log(Xbox360Button[button] + " pressed");
          });
          gamepad.onButtonUpObservable.add((button, state) => {
            console.log(Xbox360Button[button] + " released");
          });

          // Stick events
          gamepad.onleftstickchanged((values) => {
            console.log(
              "RightStick: x: " +
                values.x.toFixed(3) +
                " y:" +
                values.y.toFixed(3)
            );
          });
          gamepad.onrightstickchanged((values) => {
            console.log(
              "LeftStick: x: " +
                values.x.toFixed(3) +
                " y:" +
                values.y.toFixed(3)
            );
          });
        } else if (gamepad instanceof GenericPad) {
          // Generic button down/up events
          gamepad.onButtonDownObservable.add((button, state) => {
            console.log(button + " pressed");
          });
          gamepad.onButtonUpObservable.add((button, state) => {
            console.log(button + " released");
          });
          // Stick events
          gamepad.onleftstickchanged((values) => {
            // Roll
            // if (flightMode == 'acro') {
            //     drone.rotate(new Vector3(0, 0, 1), values.y.toFixed(1), Space.LOCAL);
            // };

            if (this.flightMode == "angle") {
              //drone.rotationQuaternion = new Quaternion.RotationAxis(new Vector3(0, 0, 1), values.y.toFixed(1));
              this.roll = values.y.toFixed(3);
              this.yprQuaternion = Quaternion.RotationYawPitchRoll(
                this.yaw,
                this.pitch,
                this.roll
              );
              player.rotationQuaternion = this.yprQuaternion;
            }
            // Pitch
            // if (flightMode == 'acro') {
            //     drone.rotate(new Vector3(1, 0, 0), values.x.toFixed(1), Space.LOCAL);
            // };

            if (this.flightMode == "angle") {
              //drone.rotationQuaternion = new Quaternion.RotationAxis(new Vector3(1, 0, 0), values.x.toFixed(1));
              this.pitch = values.x.toFixed(3);
              this.yprQuaternion = Quaternion.RotationYawPitchRoll(
                this.yaw,
                this.pitch,
                this.roll
              );
              player.rotationQuaternion = this.yprQuaternion;
            }
          });

          gamepad.onrightstickchanged((values) => {
            // Throttle
            this.throttle = values.x.toFixed(3);
            // drone.position.y = values.x;
            // player.physicsBody.applyForce(forceValue, new Vector3(0, throttle, 0), 0);

            // Yaw
            if (this.flightMode == "angle") {
              this.yaw = values.y.toFixed(3);
              var rotationAxis = new Vector3(0, 1, 0); // el eje de rotación
              player.body.setAngularDamping(this.angularDamping);
              player.body.setAngularVelocity(rotationAxis.scale(this.yaw));
            }
          });
        }
      }
    );

    // gamepadManager.onGamepadDisconnectedObservable.add((gamepad, state) => {
    //     connectionText.text = "Disconnected: " + gamepad.id;
    // })
  }
}
