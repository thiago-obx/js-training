"use strict";
function addClickEvent(color, event) {
    engine.notifyClick(color, event.clientY, event.clientY);
}
function removeClickEvent() {
    engine.removeSelectionCallback(selectNormal);
}
function removeClickEventWithPrefix() {
    engine.removeSelectionCallback(selectWithPrefix);
}
class Engine {
    constructor() {
        this.frameUpdatedCallbacks = [];
        this.selectionCallbacks = [];
    }
    addFrameUpdatedCallback(callback) {
        this.frameUpdatedCallbacks.push(callback);
    }
    removeFrameUpdatedCallback(callback) {
        const index = this.frameUpdatedCallbacks.indexOf(callback);
        if (index > -1) {
            this.frameUpdatedCallbacks.splice(index, 1);
            console.log('Removed Frame Updated Callback');
        }
        else {
            console.error('Removing Callback Failed');
        }
    }
    addSelecionCallback(callback) {
        this.selectionCallbacks.push(callback);
    }
    removeSelectionCallback(callback) {
        const index = this.selectionCallbacks.indexOf(callback);
        if (index > -1) {
            this.selectionCallbacks.splice(index, 1);
            console.log('Removed Selection Callback');
        }
        else {
            console.error('Removing Callback Failed');
        }
    }
    notifyClick(color, posX, posY) {
        if (this.selectionCallbacks.length === 0)
            return;
        const data = {
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
const selectNormal = (data) => {
    console.log(data.objectColor);
};
engine.addSelecionCallback(selectNormal);
const selectWithPrefix = (data) => {
    console.log('You have selected color ' + data.objectColor);
};
engine.addSelecionCallback(selectWithPrefix);
