

export default class droneStatus {
  //настроки камеры тут//
  // protected Cam: Vector3;
  protected walkAcceleration: number;
  protected runAcceleration: number;
  protected walkMaxSpeed: number;
  protected runMaxSpeed: number;
  protected mass: number;
  //коэффицент трения
  protected slowdownK: number;
  protected jumpSpeed: number;
  protected descentSpeed: number;
  protected descentHeight: number
  protected gravity: number;
  protected airResistance: number;
  protected jumpHeight: number;
  constructor() {
    this.walkAcceleration = 0.3;
    this.runAcceleration = 0.7;
    this.mass = 2;
    this.walkMaxSpeed = 0.2;
    this.runMaxSpeed = 0.8;
    //коэф замедления
    this.slowdownK = 0.1;
    this.jumpSpeed = 0.5;
    this.descentSpeed = 0.5;
    this.jumpHeight = 1;
    this.descentHeight = 1;
    this.gravity = 9.81;
    this.airResistance = 0.1;
  }
}
