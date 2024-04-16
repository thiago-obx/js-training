function addClickEvent(color: string, event: MouseEvent) {
    engine.notifyClick(color, event.clientY, event.clientY);
}

function removeClickEvent() {
    engine.removeSelectionCallback(selectNormal);
}

function removeClickEventWithPrefix() {
    engine.removeSelectionCallback(selectWithPrefix);
}

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

    constructor() {

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

    notifyClick(color: string, posX: number, posY: number) {
        
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
}


const engine = new Engine();

const selectNormal = (data: SelectionData) => {
    console.log(data.objectColor);
};

engine.addSelecionCallback(selectNormal);


const selectWithPrefix = (data: SelectionData) => {
    console.log('You have selected color ' + data.objectColor);
};

engine.addSelecionCallback(selectWithPrefix);




