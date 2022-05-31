import Component from "./Component";

export default class Entity extends godot.Node2D {
    private components: Component[] = [];
    public active: boolean = false;

    public $add<T extends Component>(component: Component): T {
        return this.addComponent(component);
    }

    public addComponent<T extends Component>(component: Component): T {
        if (component == null) {
            godot.printerr("[Adding Component] Component is Null!")
            return null;
        }
        component.added(this);
        this.components.push(component);
        return component as T;
    }

    public ready(): void {
        this.active = true;
    }

    public processComponent(delta: number): void {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].process(delta);
        }
    }

    public process(delta: number): void {

    }

    public fixedProcess(delta: number): void {

    }

    public exitComponent(): void {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].removed();
        }
    }

    public exit(): void {

    }
}