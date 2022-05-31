import CameraControl from "../actors/CameraControl";
import Player from "../actors/Player";
import Entity from "../ecs/Entity";
import Scene from "../ecs/Scene";
import UIPause from "../ui/UIPause";

export default class World extends Scene {

	private player: Player;
	private camera: CameraControl;
	private pauseLayer: UIPause;
	private hazard: godot.Node;

	constructor() {
		super();
	}


	public override initialize(): void {
		this.hazard = this.get_node('Hazards');
		(this.hazard.get_children() as Entity[]).forEach(child => {
			this.add(child);
		});
		this.pauseLayer = this.get_node<UIPause>("CanvasLayer/UIPause");
		this.player = this.get_node<Player>("Player");
		this.add(this.player);
		this.camera = this.get_node<CameraControl>("CameraControl");
		this.add(this.camera);
	}

	public override ready(): void {
		this.camera.setTarget(this.player.Body);
		
		this.pauseLayer.connect('OnContinue', this, this.onContinuePlaying);
		this.pauseLayer.connect('OnExit', this, this.onExitMe);
	}

	public override _input(event: godot.InputEvent): void {
		if (event.is_action_pressed('pause')) {
			this.player.active = false;
			this.pauseLayer.visible = true;
		}
	}

	public onContinuePlaying(): void {
		this.player.active = true;
		this.pauseLayer.visible = false;
	}
	
	public onExitMe(): void {
		this.get_tree().quit();
	}
}