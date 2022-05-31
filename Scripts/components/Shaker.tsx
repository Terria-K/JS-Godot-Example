import { Chance } from "../Chances";
import Component from "../ecs/Component";

export default class Shaker extends Component {
    private value: godot.Vector2 = godot.Vector2.ZERO;
    private timer: number;
    private intensity: number;
    private onShake: Action<godot.Vector2>;
    private shaking: boolean;

    public constructor(intensity: number, time: number = 0, shakeAtStart: boolean = false, onShake: Action<godot.Vector2> = null) {
        super();
        this.shaking = shakeAtStart;
        this.OnShake = onShake;
        this.Timer = time;
        this.Intensity = intensity;
    }

    public doShake(seconds: number): void {
        this.shaking = true;
        this.Timer = seconds;
    }

    public override process(delta: number): void {
        if (this.shaking && this.Timer > 0) {
            this.Timer -= delta;
            if (this.Timer <= 0) {
                this.processShake();
                return;
            }
        }
        if (!this.shaking) {
            return;
        }
        this.Value = Chance.ShakeVector();
        if (this.OnShake != null) {
            this.OnShake(this.Value);
        }
    }

    private processShake(): void {
        this.shaking = false;
        this.Value = godot.Vector2.ZERO;
        if (this.OnShake != null) {
            this.OnShake(godot.Vector2.ZERO);
        }
    }

    public get Shaking() {
        return this.shaking;
    }

    public set Shaking(value) {
        this.shaking = value;
        if (this.shaking) 
            return;
        this.Timer = 0;
        if (this.Value == godot.Vector2.ZERO) 
            return;
        this.Value = godot.Vector2.ZERO;
        if (this.OnShake != null)
            this.OnShake(godot.Vector2.ZERO);
    }


    public get OnShake() {
        return this.onShake;
    }

    public set OnShake(value) {
        this.onShake = value;
    }

    public get Value() {
        return this.value = new godot.Vector2(this.value.x * this.intensity, this.value.y * this.intensity);
    }
    private set Value(val) {
        this.value = val;
    }

    public get Intensity() {
        return this.intensity;
    }
    private set Intensity(value) {
        this.intensity = value;
    }

    public get Timer() {
        return this.timer;
    }
    private set Timer(value) {
        this.timer = value;
    }
}