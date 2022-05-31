export class Chance {
    private static shakeVectorOffset: number[] = [-1, -1, 0, 1, 1];   

    public static ShakeVector(): godot.Vector2 {
        return new godot.Vector2(this.Choose(this.shakeVectorOffset), this.Choose(this.shakeVectorOffset));
    }

    public static Choose<T>(choices: T[]): T {
        return choices[this.getRandomInt(choices.length)];
    }

    private static getRandomInt(max: number): number {
        return Math.floor(Math.random() * max);
    }
}