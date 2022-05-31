import { signal } from "../../decorators";

export default class UIPause extends godot.Control {
    @signal static readonly OnContinue: string = 'OnContinue';
    @signal static readonly OnExit: string = 'OnExit';
    
    private continueButton: godot.Button;
    private exitButton: godot.Button;

    public override _ready(): void {
        /** This one is broken, probably bindings limitations */

        // this.continueButton = this.get_node<godot.Button>('ButtonContainer/Continue');
        // this.exitButton = this.get_node<godot.Button>('ButtonContainer/Exit');
        // this.continueButton.connect('pressed', this.onContinuePressed);
        // this.exitButton.connect('pressed', this.onExitPressed);
    }

    private onContinuePressed(): void {
        this.emit_signal("OnContinue");
    }

    private onExitPressed(): void {
        this.emit_signal("OnExit");
    }
}