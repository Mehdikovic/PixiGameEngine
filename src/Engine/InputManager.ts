import { InteractionEvent, InteractionManager, Point } from "pixi.js";

class KeyCode {
    static BACKSPACE = 8;
    static TAB = 9;
    static ENTER = 13;
    static SHIFT = 16;
    static CTRL = 17;
    static ALT = 18;
    static PAUSE = 19;
    static CAPSLOCK = 20;
    static ESCAPE = 27;
    static SPACE = 32;

    static PAGEUP = 33;
    static PAGEDOWN = 34;
    static END = 35;
    static HOME = 36;
    static LEFT = 37;
    static UP = 38;
    static RIGHT = 39;
    static DOWN = 40;
    static INSERT = 45;
    static DELETE = 46;

    // numbers
    static KEY_0 = 48;
    static KEY_1 = 49;
    static KEY_2 = 50;
    static KEY_3 = 51;
    static KEY_4 = 52;
    static KEY_5 = 53;
    static KEY_6 = 54;
    static KEY_7 = 55;
    static KEY_8 = 56;
    static KEY_9 = 57;

    // alphabet
    static A = 65;
    static B = 66;
    static C = 67;
    static D = 68;
    static E = 69;
    static F = 70;
    static G = 71;
    static H = 72;
    static I = 73;
    static J = 74;
    static K = 75;
    static L = 76;
    static M = 77;
    static N = 78;
    static O = 79;
    static P = 80;
    static Q = 81;
    static R = 82;
    static S = 83;
    static T = 84;
    static U = 85;
    static V = 86;
    static W = 87;
    static X = 88;
    static Y = 89;
    static Z = 90;

    static SELECT = 93;

    static NUMPAD_0 = 96;
    static NUMPAD_1 = 97;
    static NUMPAD_2 = 98;
    static NUMPAD_3 = 99;
    static NUMPAD_4 = 100;
    static NUMPAD_5 = 101;
    static NUMPAD_6 = 102;
    static NUMPAD_7 = 103;
    static NUMPAD_8 = 104;
    static NUMPAD_9 = 105;

    static MULTIPLY = 106;
    static ADD = 107;
    static SUBTRACT = 109;
    static DECIMALPOINT = 110;
    static DIVIDE = 111;

    // F1~F2
    static F1 = 112;
    static F2 = 113;
    static F3 = 114;
    static F4 = 115;
    static F5 = 116;
    static F6 = 117;
    static F7 = 118;
    static F8 = 119;
    static F9 = 120;
    static F10 = 121;
    static F11 = 122;
    static F12 = 123;

    // etc / accents
    static NUMLOCK = 144;
    static SCROLLLOCK = 145;
    static SEMICOLON = 186;
    static EQUALSIGN = 187;
    static COMMA = 188;
    static DASH = 189;
    static PERIOD = 190;
    static FORWARDSLASH = 191;
    static GRAVEACCENT = 192;
    static OPENBRACKET = 219;
    static BACKSLASH = 220;
    static CLOSEBRAKET = 221;
    static SINGLEQUOTE = 222;
}

class MouseButtonCode {
    static LEFT = 0;
    static MIDDLE = 1;
    static RIGHT = 2;
}

class MouseWheel {
    static MOUSE_MIDDLE_UP = 3;
    static MOUSE_MIDDLE_DOWN = 4;
}

class Key {
    key: number;
    isKeyDown: boolean = false;
    isKeyUp: boolean = true;
    isKeyPressed: boolean = false;

    constructor(keycode) {
        this.key = keycode;
    }

    processAfterLoop() {
        if (this.isKeyDown && !this.isKeyUp) {
            this.isKeyDown = false;
        }
    }
}

export class InputManager {
    KEY = { ...KeyCode }
    MOUSE = { ...MouseButtonCode, ...MouseWheel }

    private keyMaps = new Map<number, Key>();
    private dirtyKeyMaps = new Map<number, Key>();

    private mouseButtonMaps = new Map<number, Key>();
    private dirtyMouseButtonMaps = new Map<number, Key>();

    private mousePositionOfCanvas: Point;
    private wheelMouseButton = 0;

    constructor(app, interactionManager: InteractionManager) {
        this.constructKeys();
        this.mousePositionOfCanvas = interactionManager.mouse.global;

        window.addEventListener("keydown", (event) => {
            let code = event.keyCode;
            if (this.keyMaps.has(code)) {
                let key = this.keyMaps.get(code);
                if (!key.isKeyUp) return;
                key.isKeyDown = true;
                key.isKeyPressed = true;
                key.isKeyUp = false;
                this.dirtyKeyMaps.set(code, key);
            }
        });

        window.addEventListener("keyup", (event) => {
            let code = event.keyCode;
            if (this.keyMaps.has(code)) {
                let key = this.keyMaps.get(code);
                key.isKeyDown = false;
                key.isKeyPressed = false;
                key.isKeyUp = true;
            }
        });

        app.pixi.view.addEventListener("mousewheel", (e: Event) => {
            this.wheelMouseButton = (e as WheelEvent).deltaY > 0 ? this.MOUSE.MOUSE_MIDDLE_DOWN : this.MOUSE.MOUSE_MIDDLE_UP;
        }, false);

        interactionManager.on("pointerdown", (event) => {
            let e = event as InteractionEvent;
            if (this.mouseButtonMaps.has(e.data.button)) {
                let mouseButton = this.mouseButtonMaps.get(e.data.button);
                if (!mouseButton.isKeyUp) return;
                mouseButton.isKeyDown = true;
                mouseButton.isKeyPressed = true;
                mouseButton.isKeyUp = false;
                this.dirtyMouseButtonMaps.set(e.data.button, mouseButton);
            }
        });

        interactionManager.on("pointerupoutside", (event) => this.onMouseUp(event));
        interactionManager.on("pointerup", (event) => this.onMouseUp(event));
    }

    get mousePosition(): Point {
        return this.mousePositionOfCanvas;
    }

    get mouseWheelButton(): number {
        return this.wheelMouseButton;
    }

    isMouseButtonDown(mouseButton: number) {
        return this.mouseButtonMaps.get(mouseButton).isKeyDown;
    }

    isMouseButtonPressed(mouseButton: number) {
        return this.mouseButtonMaps.get(mouseButton).isKeyPressed;
    }

    isMouseButtonUp(mouseButton: number) {
        return this.mouseButtonMaps.get(mouseButton).isKeyUp;
    }

    isKeyDown(keyCode: number) {
        return this.keyMaps.get(keyCode).isKeyDown;
    }

    isKeyUp(keyCode: number) {
        return this.keyMaps.get(keyCode).isKeyUp;
    }

    isKeyPressed(keyCode: number) {
        return this.keyMaps.get(keyCode).isKeyPressed;
    }

    processAfterLoop() {
        this.updateKeyboard();
        this.updateMouse();
    }

    private onMouseUp(event) {
        let e = event as InteractionEvent;
        if (this.mouseButtonMaps.has(e.data.button)) {
            let mouseButton = this.mouseButtonMaps.get(e.data.button);
            mouseButton.isKeyDown = false;
            mouseButton.isKeyPressed = false;
            mouseButton.isKeyUp = true;
        }
    }

    private updateMouse() {
        this.wheelMouseButton = 0;

        if (this.dirtyMouseButtonMaps.size <= 0) return;
        this.dirtyMouseButtonMaps.forEach(key => {
            key.processAfterLoop();
        });
        this.dirtyMouseButtonMaps.clear();
    }

    private updateKeyboard() {
        if (this.dirtyKeyMaps.size <= 0) return;
        this.dirtyKeyMaps.forEach(key => {
            key.processAfterLoop();
        });
        this.dirtyKeyMaps.clear();
    }

    private constructKeys() {
        Object.keys(KeyCode).forEach(keyName => {
            this.keyMaps.set(KeyCode[keyName], new Key(KeyCode[keyName]));
        });

        Object.keys(MouseButtonCode).forEach(mouseButton => {
            this.mouseButtonMaps.set(MouseButtonCode[mouseButton], new Key(MouseButtonCode[mouseButton]));
        });
    }
}