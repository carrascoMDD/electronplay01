// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import { ipcRenderer} from 'electron';

console.log( "loading renderer_m2m.ts");


ipcRenderer.on('DbReToMendix_CREATEPRJ', (event: Electron.Event, arg: any) => {
    console.log("DbReToMendix_CREATEPRJ " + arg);
    // event.sender.send('another-message', 'Hello World!');
});

ipcRenderer.on('DbReToMendix_CREATEWKCOPY', (event: Electron.Event, arg: any) => {
    console.log("DbReToMendix_CREATEWKCOPY " + arg);
    // event.sender.send('another-message', 'Hello World!');
});

ipcRenderer.on('DbReToMendix_START', (event: Electron.Event, arg: any) => {
    console.log("DbReToMendix_START " + arg);
    // event.sender.send('another-message', 'Hello World!');
});

ipcRenderer.on('DbReToMendix_FAILED', (event: Electron.Event, arg: any) => {
    console.log("DbReToMendix_FAILED " + arg);
    // event.sender.send('another-message', 'Hello World!');
});

ipcRenderer.on('DbReToMendix_SUCCESS', (event: Electron.Event, arg: any) => {
    console.log("DbReToMendix_SUCCESS " + arg);
    // event.sender.send('another-message', 'Hello World!');
});




ipcRenderer.on('DbReToMendix_CREATEENTITY', (event: Electron.Event, arg: any) => {
    console.log("DbReToMendix_CREATEENTITY " + arg);
    // event.sender.send('another-message', 'Hello World!');
});

ipcRenderer.on('DbReToMendix_CREATEATTRIBUTE', (event: Electron.Event, arg: any) => {
    console.log("DbReToMendix_CREATEATTRIBUTE " + arg);
    // event.sender.send('another-message', 'Hello World!');
});

ipcRenderer.on('DbReToMendix_CREATEASSOCIATION', (event: Electron.Event, arg: any) => {
    console.log("DbReToMendix_CREATEASSOCIATION " + arg);
    // event.sender.send('another-message', 'Hello World!');
});