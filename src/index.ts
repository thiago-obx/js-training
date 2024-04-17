//#region Engine Implementation

interface FrameData {
    guid: string;
    name: string;
    timeStamp: number;
}

interface SelectionData {
    objectColor: string;
    positionX: number;
    positionY: number;
}

class Engine {
    private frameUpdatedCallbacks: ((data: FrameData) => void)[] = [];
    private selectionCallbacks: ((data: SelectionData) => void)[] = [];
    private intervalId: number = -1;
    private engineFrame = 0;
    private framerate = 2; // 2 per second

    constructor() {
        // Simulate the wait for the DOM to be ready
        setTimeout(() => {

            this.createScene();

           // Simulate the engine generating frames
            this.intervalId = setInterval(() => {
                if (this.frameUpdatedCallbacks.length === 0) return;

                for (const callback of this.frameUpdatedCallbacks) {
                    callback({
                        guid: 'ABC-12345',
                        name: 'Frame Updated',
                        timeStamp: ++this.engineFrame,
                    })
                }
            }, 1000 / this.framerate);

        }, 100);
    }

    private createScene() {
        document.getElementById('canvas')!.innerHTML = `
        <div>Open up your dev tools to see frame update events</div>
        <div>Click on the rectangles below to see the engine handling selection and events</div>
        <svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">
            <rect width="500" height="500" x="0" y="0" fill="white" onclick="engine.clicked(null, event.clientX, event.clientY)"/>
        
            <rect width="200" height="100" x="10" y="10" fill="blue" onclick="engine.clicked('blue', event.clientX, event.clientY)" />
            <g id="sel-blue" style="display: none;">
                <rect width="200" height="100" x="10" y="10" stroke="cyan" fill="cyan" fill-opacity="0.4" stroke-width="2"></rect>
            </g>

            <rect width="200" height="100" x="290" y="10" fill="red" onclick="engine.clicked('red', event.clientX, event.clientY)"/>
            <g id="sel-red" style="display: none;">
                <rect width="200" height="100" x="290" y="10" fill="cyan" fill-opacity="0.4" stroke="cyan" stroke-width="2"></rect>
            </g>
        
            <rect width="200" height="100" x="150" y="150" fill="green" onclick="engine.clicked('green', event.clientX, event.clientY)"/>
            <g id="sel-green" style="display: none;">
                <rect width="200" height="100" x="150" y="150" stroke="cyan" fill="cyan" fill-opacity="0.4" stroke-width="2"></rect>
            </g>
        </svg>`;
    }

    addFrameUpdatedCallback(callback: (data: FrameData) => void) {
        this.frameUpdatedCallbacks.push(callback);
    }

    removeFrameUpdatedCallback(callback: (data: FrameData) => void) {
        const index = this.frameUpdatedCallbacks.indexOf(callback);
        if (index > -1) {
            this.frameUpdatedCallbacks.splice(index, 1);
            console.log('Removed Frame Updated Callback');
        } else {
            console.error('Removing Callback Failed');
        }
    }

    addSelecionCallback(callback: (data: SelectionData) => void) {
        this.selectionCallbacks.push(callback);
    }

    removeSelectionCallback(callback: (data: SelectionData) => void) {
        const index = this.selectionCallbacks.indexOf(callback);
        if (index > -1) {
            this.selectionCallbacks.splice(index, 1);
            console.log('Removed Selection Callback');
        } else {
            console.error('Removing Callback Failed');
        }
    }

    clicked(color: string, posX: number, posY: number) {

        document.getElementById('sel-green')!.style.display = 'none';
        document.getElementById('sel-red')!.style.display = 'none';
        document.getElementById('sel-blue')!.style.display = 'none';
        
        if (color) {
            document.getElementById('sel-' + color)!.style.display = 'block'
        }

        if (this.selectionCallbacks.length === 0) return;

        const data: SelectionData = {
            objectColor: color,
            positionX: posX,
            positionY: posY
        };

        for (const callback of this.selectionCallbacks) {
            callback(data);
        }
    }

    dispose() {
        document.getElementById('canvas')!.innerHTML = "";
        this.selectionCallbacks = [];
        this.frameUpdatedCallbacks = [];
        clearInterval(this.intervalId);
    }
}

//#endregion

const frameCallback = function (data: FrameData) {
    console.log('Frame Updated: ' + data.timeStamp);
};

const selectNormal = function (data: SelectionData) {
    if (data.objectColor) {
        console.log(data.objectColor);
    } else {
        console.log('Unselected');
    }
};

const selectWithPrefix = function (data: SelectionData) {
    if (!data.objectColor) return;
    console.log('You have selected color ' + data.objectColor);
};


let engine: Engine | null = null;

function createEngine() {
    engine = new Engine();

    document.getElementById('engine-creation')!.style.display = 'none';
    document.getElementById('event-buttons')!.style.display = 'flex';

    engine.addSelecionCallback(selectNormal);
    engine.addSelecionCallback(selectWithPrefix);
    engine.addFrameUpdatedCallback(frameCallback);
}

function removeClickEvent() {
    engine!.removeSelectionCallback(selectNormal);
}

function removeClickEventWithPrefix() {
    engine!.removeSelectionCallback(selectWithPrefix);
}

function removeFrameCallback() {
    engine!.removeFrameUpdatedCallback(frameCallback);
}

function disposeEngine() {
    document.getElementById('engine-creation')!.style.display = 'flex';
    document.getElementById('event-buttons')!.style.display = 'none';
    engine!.dispose();
    engine = null;
}