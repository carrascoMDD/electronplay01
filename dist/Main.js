"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const url = require("url");
const DbReToMendix_1 = require("./DbReToMendix");
class Main {
    static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }
    static onCloseMain() {
        // Dereference the window object.
        Main.mainWindow = null;
    }
    static onCloseM2M() {
        // Dereference the window object.
        Main.m2mWindow = null;
    }
    static onReady() {
        Main.openWindow_Main();
        Main.openWindow_M2M();
    }
    static openWindow_Main() {
        Main.mainWindow = new electron_1.BrowserWindow({ width: 800, height: 600 });
        Main.mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, "../index.html"),
            protocol: "file:",
            slashes: true,
        }));
        Main.mainWindow.on('closed', Main.onCloseMain);
        Main.mainWindow.webContents.openDevTools();
    }
    static openWindow_M2M() {
        Main.m2mWindow = new electron_1.BrowserWindow({ width: 800, height: 600 });
        Main.m2mWindow.loadURL(url.format({
            pathname: path.join(__dirname, "../m2m.html"),
            protocol: "file:",
            slashes: true,
        }));
        Main.m2mWindow.on('closed', Main.onCloseM2M);
        Main.m2mWindow.webContents.openDevTools();
        DbReToMendix_1.default.dbreToMendix(Main.m2mWindow);
    }
    static main(app) {
        // we pass the Electron.App object and the
        // Electron.BrowserWindow into this function
        // so this class has no dependencies. This
        // makes the code easier to write tests for
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
    }
}
exports.default = Main;
//# sourceMappingURL=Main.js.map