import { signal } from "../../decorators";
import StateMachine from "../states/StateMachine";
import { Actors } from "./Actors";

const StNormal = 0;
const StRoll = 1;
const StDash = 2;
const StDied = 3;

enum LastFacing { Left = -1, Right = 1, Up = -1, Down = 1 }

export default class Player extends Actors {

    @signal
    public static readonly OnJump: string;

    private gravity: number = 60;
    private maxFallSpeed: number = 700;
    private maxSpeed: number = 660;
    private jumpForce: number = 800;
    private rollSpeed: number = 1000;
    private dashSpeed: number = 1100;
    private stamina: number = 1;
    private canJump: boolean = false;
    private roll: boolean = false;
    private dashing: boolean = false;
    private died: boolean = false;
    private startPoint: godot.Vector2 = godot.Vector2.ZERO;
    private lastFacing: LastFacing = LastFacing.Left;
    
    private body: godot.KinematicBody2D;
    private particle: godot.CPUParticles2D;
    private groundCheck: godot.RayCast2D;
    private accel: number = 1500;
    private motion: godot.Vector2 = godot.Vector2.ZERO;
    private stateMachine: StateMachine;
    private delta: number;
    private sprite: godot.Sprite;

    public get Body() {
        return this.body;
    }

    public override ready(): void {
        this.body = this.$<godot.KinematicBody2D>("Body");
        this.groundCheck = this.$<godot.RayCast2D>("Body/CheckGround");
        this.particle = this.$<godot.CPUParticles2D>('Body/PlayerParticle');
        this.sprite = this.$<godot.Sprite>('Body/Sprite');
        this.stateMachine = this.$add(new StateMachine());
        this.assignState();
        this.startPoint = this.body.global_position;
        super.ready();
    }

    public override fixedProcess(delta: number): void {
        this.delta = delta;

        if (this.body.is_on_floor()) {
            this.canJump = true;        
            this.resetAll();
        }

        if (!this.body.is_on_floor()) {
            this.falling();
        }


        this.motion = this.body.move_and_slide(this.motion, godot.Vector2.UP);
    }

    private async falling(): Promise<void> {
        await godot.yield(this.get_tree().create_timer(0.5), "timeout");
        this.canJump = false;
    }

    private doFall(): void {
        this.motion = new godot.Vector2(this.motion.x, this.motion.y + this.gravity);
        if (this.motion.y > this.maxFallSpeed) {
            this.motion = new godot.Vector2(this.motion.x, this.maxFallSpeed);
        }
    }

    private calculateJump(): number {
        const jump = (godot.Input.is_action_pressed('jump') && this.canJump);
        const hasReachLimit = this.motion.y >= this.jumpForce;

        if (jump && !hasReachLimit) {
            this.canJump = false;
            this.emit_signal(Player.OnJump);
            return -this.jumpForce;
        }
        return this.motion.y;
    }

    private moveInput(delta: number): void {
        let axis = this.getAxisInput('right', 'left');
        this.lastFacing = axis;
        if (axis == 0) {
            this.motion = new godot.Vector2(godot.lerp(this.motion.x, 0, 0.3), this.motion.y);
        }

        this.motion.x = this.motion.x + (this.accel * axis) * delta;
    }

    private getAxisInput(inputA: string, inputB: string): number {
        return godot.Input.get_action_raw_strength(inputA) - godot.Input.get_action_raw_strength(inputB);
    }

    private resetAll() {
        this.stamina = 1;
    }

    private rollInput(): number {
        const speed = this.lastFacing * this.rollSpeed;
        return speed;
    }

    private async waitForSeconds(seconds: number): Promise<void> {
        await godot.yield(this.get_tree().create_timer(seconds), 'timeout');
    }

    public override die(): void {
        this.died = true;
    }

    private assignState(): void {
        // Normal State
        this.stateMachine.addState(StNormal, {
            process: () => {
                if (this.died) {
                    return StDied;
                }
                this.doFall();
        
                this.motion.x = godot.clamp(this.motion.x, -this.maxSpeed, this.maxSpeed);
                this.motion.y = this.calculateJump();
                this.moveInput(this.delta);

                if (this.stamina === 0) {
                    return StNormal;
                }
                
                if (godot.Input.is_action_just_pressed('roll') && this.lastFacing) {
                    this.stamina--;
                    return StRoll;
                }
                if (godot.Input.is_action_just_pressed('dash') && this.motion != godot.Vector2.ZERO) {
                    this.stamina--;
                    return StDash;
                } 

                return StNormal;
            }
        });
        // Roll State
        this.stateMachine.addState(StRoll, {
            start: () => {
                this.roll = true;
                this.particle.emitting = true;
            },
            process: () => {
                this.doFall();
                this.motion.y = this.calculateJump();
                if (this.roll) {
                    this.motion.x = this.rollInput();
                    this.sprite.rotation_degrees += 40 * this.lastFacing;
                    return StRoll;
                }
                this.sprite.rotation_degrees = 0;
                return StNormal;
            },            
            coroutine: async () => {
                await godot.yield(this.get_tree().create_timer(0.9), 'timeout');
                this.roll = false;
                this.particle.emitting = false;
            }
        });
        // Dash State
        this.stateMachine.addState(StDash, {
            start: () => {
                if (!this.lastFacing) {
                    return;
                }
                this.dashing = true;
                this.particle.emitting = true;
            },
            process: () => {
                // this.jump();
                if (this.dashing) {
                    this.motion.x = this.lastFacing * this.dashSpeed;
                    this.motion.y = 0;
                    return StDash;
                }
                this.canJump = true;

                return StNormal;
            },
            coroutine: async () => {
                await godot.yield(this.get_tree().create_timer(0.15), 'timeout');
                this.dashing = false;
                this.particle.emitting = false;
            }
        });
        this.stateMachine.addState(StDied, {
            start: () => {
                this.sprite.visible = false;
            },
            coroutine: async () => {
                await this.waitForSeconds(2);
                this.died = false;
                this.sprite.visible = true;
                this.body.global_position = this.startPoint;
            }
        });
    }
}