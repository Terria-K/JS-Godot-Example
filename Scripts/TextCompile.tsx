import { AllowUnsafe } from "./Unsafe";

export default class TextCompile implements AllowUnsafe {
    private file: godot.File;
    private fileStr: string;
    public unsafe: boolean;

    private constructor(file: godot.File) {
        if (file === null) {
            file = new godot.File;
            return;
        }
        this.file = file;
    }
    makeSafe(): void {
        this.unsafe = false;
    }

    static unsafe(): TextCompile {
        if (!this.unsafe) {
            godot.print("Unsafe function is only allowed in Unsafe block!");
            return;
        }
        return new TextCompile(null);
    }

    static openFile(path: string): TextCompile {
        let file = new godot.File;
        file.open(path, godot.File.ModeFlags.READ);
        if (file.get_error() != godot.Error.OK) {
            godot.print('File not found! ', path);
        }
        let compiler = new TextCompile(file);
        compiler.fileStr = file.get_as_text();
        file.close();
        return compiler;
    }

    public openFileUnsafe(path: string): void {
        if (!this.unsafe) {
            godot.print("Unsafe function is only allowed in Unsafe block!");
            return;
        }
        let file = new godot.File;
        this.file = file;
        file.open(path, godot.File.ModeFlags.READ);
        if (file.get_error() != godot.Error.OK) {
            godot.print('File not found! ', path);
        }
        this.fileStr = file.get_as_text();
    }

    public getFileSystem(): godot.File {
        return this.file;
    }

    public getJSON<T>(): T {
        return godot.JSON.parse(this.fileStr).result as T;
    }

    public getFile(): string {
        return this.fileStr;
    }

    public close(): void {
        if (!this.unsafe) {
            godot.print("Unsafe function is only allowed in Unsafe block!");
            return;
        }
        this.file.close();
    }
}