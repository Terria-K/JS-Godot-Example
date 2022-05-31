import { Actors } from "../actors/Actors";
import Entity from "../ecs/Entity";


export default class Spikes extends Entity {
  private area: godot.Area2D;

  public override ready(): void {
    /** This one is also broken, probably bindings limitation */

    // this.area = this.get_node<godot.Area2D>('Area2D');
    // this.area.connect('body_entered', this.onBodyEntered);
  }

  private onBodyEntered(actors: Actors): void {
    actors.die();
  }
}