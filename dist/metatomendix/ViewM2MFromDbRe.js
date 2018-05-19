"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const url = require("url");
const DbReToMendix_1 = require("./DbReToMendix");
class ViewM2MFromDbRe {
    static onClose() {
        // Dereference the window object.
        Main.mainWindow = null;
    }
    static onReady() {
        Main.mainWindow = new electron_1.BrowserWindow({ width: 800, height: 600 });
        Main.mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, "../index2.html"),
            protocol: "file:",
            slashes: true,
        }));
        Main.mainWindow.on('closed', Main.onClose);
    }
    static main(app) {
        // we pass the Electron.App object and the
        // Electron.BrowserWindow into this function
        // so this class has no dependencies. This
        // makes the code easier to write tests for
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
        DbReToMendix_1.default.dbreToMendix();
    }
}
exports.default = ViewM2MFromDbRe;
//# sourceMappingURL=ViewM2MFromDbRe.js.map