# javascript-godot
 This is an example implementation of ECMAScript bindings in Godot. Although it is buggy, but it is very usable for simple and small projects. I don't recommend this module yet, but if you wanted to try, go into this repository and download the prebuilt binaries or compile it by your own: https://github.com/GodotExplorer/ECMAScript
 

**Issues that I had**
 There is an issue regarding on the custom signals, or even a normal signals where it can't be connected into the function or can't be emitted. I had tried so many workarounds regarding on this issues, but the issue still persisted: https://github.com/GodotExplorer/ECMAScript/issues/127.
 
 
**How about TypeScript Support**
 It is great and usable. This project uses TypeScript, and converts into JavaScript. There is a declaration file for all classes, methods, and variables that you could've used too. There is also a decorators aswell to make your life easier.
 

**Trying out the project**
 You need to have the modules first, you can download it in the main repository of this module. Before you enter to the project, you need to compile the TypeScript files first by entering it in command line `tsc -w -p` or `npm watch`, `yarn watch`, or `pnpm watch`.
 Then enter to the project and you can try and test the project out.
 
**The Keys**
 `C`: Jump
 `Z`: Roll
 `A`: Left
 `D`: Right
 
