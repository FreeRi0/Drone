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
  KeyboardEventTypes,
  StandardMaterial,
  DualShockButton,
  DualShockDpad,
  DualShockPad,
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
  buttonsText: any;

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
    // this.buttonsText = new GUI.TextBlock("buttons", "");
    // this.buttonsText.height = "30px";
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
    camera.pinchDeltaPercentage = 0.00060;
    camera.wheelPrecision = 20;

    const hemiLight = new HemisphericLight(
      "hemiLight",
      new Vector3(0, 1, 0),
      this.scene
    );

    hemiLight.intensity = 0.7;

    this.scene.debugLayer.show();

    this.CreateDron();

    this.CreateEnvironment();

    this.CreateMap();

    const envTex = CubeTexture.CreateFromPrefilteredData(
      "./enviroments/city.env",
      this.scene
    );

    this.scene.createDefaultSkybox(envTex, true);

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
    return this.scene;
  }

  async CreateDron(): Promise<void> {

    const res = await SceneLoader.ImportMeshAsync(
      "",
      "./models/",
      "DRONE_Vint.glb", this.scene)

      this.drone = res.meshes[0];
        console.log("dron");
        console.log(this.drone);
        this.drone.position.y = 0.5;

        // this.drone.scaling.scaleInPlace(0.25);
        this.prop1 = this.scene.getMeshByName('mesh_588');

        // Bake transform to plane
        this.drone.rotate(new Vector3(0, 1, 0), Math.PI / 2, Space.WORLD);
        this.drone.bakeCurrentTransformIntoVertices();

        var dummyPhysicsRoot = MeshBuilder.CreateBox("dummyPhysicsRoot", { size: 1, height: 0.4, width: 1 }, this.scene);
        dummyPhysicsRoot.addChild(this.drone);
        // DummyPhysicsRoot Visibility Change to 0 to Hide
        dummyPhysicsRoot.visibility = 0.2;
        dummyPhysicsRoot.position.y = 1;

        var dummyAggregate = new PhysicsAggregate(dummyPhysicsRoot, PhysicsShapeType.BOX, { mass: 1, restitution: 0.1 }, this.scene);
        dummyAggregate.body.setMotionType(PhysicsMotionType.DYNAMIC);

        this.MoveDron(dummyAggregate);
        // this.MoveKeyBoard(dummyAggregate);

        dummyAggregate.body.setMassProperties({
            inertia: new Vector3(1, 0, 1),
            centerOfMass: new Vector3(0, -1, 0)
        });

      console.log(res);

  }

   CreateMap(): void {
   SceneLoader.ImportMeshAsync("",
    "./models/",
    "Buildingg.glb", this.scene).then((models) =>{
    models.meshes[0].position.x = 10;
    models.meshes[0].position.y = -0.2;
    })
  }

 CreateEnvironment(): void {
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 2000, height: 2000 },
      this.scene
    );

    ground.position.y = -2;
    ground.material = this.CreateAsphalt();
    var groundAggregate = new PhysicsAggregate(
      ground,
      PhysicsShapeType.BOX,
      { mass: 0 },
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

    return pbr;
  }

  MoveDron(player: any): void {
    this.gamepadManager.onGamepadConnectedObservable.add(
      (gamepad: any, state: any) => {
        //connectionText.text = "Connected: " + gamepad.id;
         if (gamepad instanceof DualShockPad) {
          // Generic button down/up events
          gamepad.onButtonDownObservable.add((button, state)=>{
            if(gamepad.buttonL1){
              this.drone.position.y-=1
            }
        })

        gamepad.onButtonUpObservable.add((button, state)=>{
          if(gamepad.buttonR1){
            this.drone.position.y+=1
          }
        })
          // Stick events
          gamepad.onleftstickchanged((values) => {
            // Roll
            if (this.flightMode == 'acro') {
                this.drone.rotate(new Vector3(0, 0, 1), values.y.toFixed(1), Space.LOCAL);
            };

            if (this.flightMode == "angle") {
              // this.drone.rotationQuaternion = Quaternion.RotationAxis(new Vector3(0, 0, 1), values.y.toFixed(1));
              this.roll = values.y.toFixed(3);
              this.yprQuaternion = Quaternion.RotationYawPitchRoll(
                this.yaw,
                this.pitch,
                this.roll
              );
              player.rotationQuaternion = this.yprQuaternion;
            }
            // Pitch
            if (this.flightMode == 'acro') {
                this.drone.rotate(new Vector3(1, 0, 0), values.x.toFixed(1), Space.LOCAL);
            };

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
            this.drone.position.y = values.x;
            player.physicsBody.applyForce (new Vector3(0, this.throttle, 0), 0);

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

    this.scene.onKeyboardObservable.add((kbInfo) => {
      switch (kbInfo.type) {
        case KeyboardEventTypes.KEYDOWN:
          switch (kbInfo.event.key) {
                      case "a":
                      case "A":
                          this.drone.position.x -= 0.1;
                      break
                      case "d":
                      case "D":
                        this.drone.position.x += 0.1;
                      break
                      case "w":
                      case "W":
                        this.drone.position.y += 0.1;
                      break
                      case "s":
                      case "S":
                        this.drone.position.y -= 0.1;
                      break
                  }
        break;
      }
    });
  }

}
