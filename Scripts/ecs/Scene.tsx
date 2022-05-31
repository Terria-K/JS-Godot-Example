import EntityList from "../collections/EntitiesList";
import Entity from "./Entity";

export default class Scene extends godot.Node {
    private entityList: EntityList;

    public initialize(): void {}
    public ready(): void {}
    public process(): void {}
    public exit(): void {}

    public override _ready(): void {
        this.entityList = new EntityList();
        this.initialize();
        this.entityList.ready();
        this.ready();
    }

    public override _process(delta: number): void {
        this.entityList.process(delta);
        this.entityList.processComponent(delta);
        this.process();
    }

    public override _physics_process(delta: number): void {
        this.entityList.fixedProcess(delta);
    }

    public override _exit_tree(): void {
        this.entityList.exit();
        this.entityList.exitComponent();
        this.exit();
    }

    public add(entity: Entity): void {
        this.entityList.add(entity);
    }
}