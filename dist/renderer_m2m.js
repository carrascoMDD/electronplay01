"use strict";
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
console.log("loading renderer_m2m.ts");
electron_1.ipcRenderer.on('DbReToMendix_CREATEPRJ', (event, arg) => {
    console.log("DbReToMendix_CREATEPRJ " + arg);
    // event.sender.send('another-message', 'Hello World!');
});
electron_1.ipcRenderer.on('DbReToMendix_CREATEWKCOPY', (event, arg) => {
    console.log("DbReToMendix_CREATEWKCOPY " + arg);
    // event.sender.send('another-message', 'Hello World!');
});
electron_1.ipcRenderer.on('DbReToMendix_START', (event, arg) => {
    console.log("DbReToMendix_START " + arg);
    // event.sender.send('another-message', 'Hello World!');
});
electron_1.ipcRenderer.on('DbReToMendix_FAILED', (event, arg) => {
    console.log("DbReToMendix_FAILED " + arg);
    // event.sender.send('another-message', 'Hello World!');
});
electron_1.ipcRenderer.on('DbReToMendix_SUCCESS', (event, arg) => {
    console.log("DbReToMendix_SUCCESS " + arg);
    // event.sender.send('another-message', 'Hello World!');
});
electron_1.ipcRenderer.on('DbReToMendix_CREATEENTITY', (event, arg) => {
    console.log("DbReToMendix_CREATEENTITY " + arg);
    // event.sender.send('another-message', 'Hello World!');
});
electron_1.ipcRenderer.on('DbReToMendix_CREATEATTRIBUTE', (event, arg) => {
    console.log("DbReToMendix_CREATEATTRIBUTE " + arg);
    // event.sender.send('another-message', 'Hello World!');
});
electron_1.ipcRenderer.on('DbReToMendix_CREATEASSOCIATION', (event, arg) => {
    console.log("DbReToMendix_CREATEASSOCIATION " + arg);
    // event.sender.send('another-message', 'Hello World!');
});
//# sourceMappingURL=renderer_m2m.js.map