import Entity from "./Entity";

export default class Component extends godot.Object {
    private entity: Entity;

    public added(entity: Entity) {
        this.entity = entity;
    }

    public removed() {
        this.free();
    }

    public process(delta: number) {

    }
}