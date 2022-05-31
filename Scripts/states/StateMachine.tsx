import Component from "../ecs/Component";

type TargetOnly = {
    (): void;
}

type TargetCoroutine = {
    (): Promise<void>;
}

type TargetAndTransition = {
    (): number;
}

interface StateInterface {
    process?: TargetAndTransition;
    end?: TargetOnly;
    start?: TargetOnly;
    coroutine?: TargetCoroutine;
}


export default class StateMachine extends Component {
    private readonly starts: TargetOnly[] = []
    private readonly processes: TargetAndTransition[] = []
    private readonly ends: TargetOnly[] = []
    private readonly coroutine: TargetCoroutine[] = []
    private state: number;
    private previousState: number;
    private locked: boolean;

    public get State() {
        return this.state;
    }

    public set State(value: number) {
        if (this.locked || this.state == value) {
            return;
        }

        this.previousState = this.state;
        this.state = value;
        if (this.previousState != -1 && this.ends[this.state] != null) {
            this.ends[this.previousState]?.call(undefined);
        }
        if (this.starts[this.state] != null) {
            this.starts[this.state]?.call(undefined);
        }
        if (this.coroutine[this.state] != null) {
            this.coroutine[this.state]?.call(undefined);
        }
    }

    public get Locked() {
        return this.locked;
    }

    public set Locked(value: boolean) {
        this.locked = value;
    }

    constructor() {
        super();
        this.state = 0;
        this.previousState = -1;
    }

    public addState(stateID: number, state: StateInterface) {
        this.starts[stateID] = state.start;
        this.ends[stateID] = state.end;
        this.processes[stateID] = state.process;
        this.coroutine[stateID] = state.coroutine;
    }

    public override process(): void {
        if (this.state == -1) {
            return;
        }
        this.State = this.processes[this.state]?.call(undefined);
    }
}
