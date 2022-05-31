import Entity from "../ecs/Entity";

export default class EntityList {
    private entities: Entity[] = [];
    
    public ready(): void {
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].ready();
        }
    }

    public process(delta: number): void {
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].active) {
                this.entities[i].process(delta);
            }
        }
    }

    public processComponent(delta: number): void {
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].active) {
                this.entities[i].processComponent(delta);
            }
        }
    }

    public fixedProcess(delta: number): void {
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].active) {
                this.entities[i].fixedProcess(delta);
            }
        }
    }

    public exit(): void {
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].active)
                this.entities[i].exit();
        }
    }

    public exitComponent(): void {
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].active)
                this.entities[i].exitComponent();
        }
    }

    public add(entity: Entity): void {
        this.entities.push(entity);
    }
}