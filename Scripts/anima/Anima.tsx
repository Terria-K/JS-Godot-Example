interface Sequences {
    node: godot.Node;
    property: string;
    from?: any;
    to?: any;
    duration: number
}


export declare class AnimaNode {
    public then(map: Sequences) : void;
    public play(): void;
}

export declare class Anima {
    public static begin(node: godot.Node, animation: string) : AnimaNode
}

export default class AnimaJS extends godot.Node {
    private node: AnimaNode;

    _ready() {
        // this.node = Anima.begin(this);
        // this.node.then({
        //     node: this,
        //     property: "position",
        //     from: 10,
        //     duration: 4
        // })
    }
}