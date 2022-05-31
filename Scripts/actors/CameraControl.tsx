import Shaker from "../components/Shaker";
import Entity from "../ecs/Entity";

export default class CameraControl extends Entity {
	private actualCamPos: godot.Vector2;
    private toZoom: godot.Vector2;
    private elapsedTime: number;
    private tweenDuration: number;
    private target: godot.Node2D;
    private camera: godot.Camera2D;
    private shaker: Shaker;

	public override ready() {
        this.camera = this.get_node<godot.Camera2D>("BaseCamera");
        this.shaker = this.$add(new Shaker(1, 1, false, (vec2): void => {
            this.camera.offset = this.shaker.Value;
        }));
        this.actualCamPos = this.global_position;
        super.ready();
    }

    public override process(delta: number) {
        if (this.target == null)
            return;
        this.global_position = this.following(delta);
    }

    private following(delta: number): godot.Vector2 {
        let pos1: godot.Vector2 = this.target.global_position;
        let camPos: godot.Vector2 = this.target.global_position.linear_interpolate(pos1, 0.7);
        this.actualCamPos = this.actualCamPos.linear_interpolate(camPos, delta * 4);
        return this.actualCamPos.round()
    }

    public setTarget(node: godot.Node2D): void {
        this.target = node;
    }

    public ShakeFor(duration: number): void {
        this.shaker.doShake(duration);
    }
}
