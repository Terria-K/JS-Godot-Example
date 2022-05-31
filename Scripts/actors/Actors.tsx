import Entity from "../ecs/Entity";

export class Actors extends Entity {
  public die(): void {
    this.queue_free();
  }
}