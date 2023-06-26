export default class droneStatus {
  protected walkAcceleration: number;
  protected runAcceleration: number;
  protected walkMaxSpeed: number;
  protected runMaxSpeed: number;
  protected mass: number;
  //коэффицент трения
  protected slowdownK: number;
  protected jumpSpeed: number;
  protected gravity: number;
  protected airResistance: number;
  protected jumpHeight: number;
  constructor() {
    this.walkAcceleration = 0.1;
    this.runAcceleration = 0.3;
    this.mass = 60;
    this.walkMaxSpeed = 0.08;
    this.runMaxSpeed = 0.18;
    //коэф замедления
    this.slowdownK = 0.1;
    this.jumpSpeed = 0.5;
    this.jumpHeight = 1;
    this.gravity = 9.81;
    this.airResistance = 0.1;
  }
}
