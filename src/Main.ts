import { BrowserWindow } from 'electron';
import * as path from "path";
import * as url from "url";

import DbReToMendix from './DbReToMendix';


export default class Main {
    static mainWindow: BrowserWindow;
    static m2mWindow:  BrowserWindow;
    static application: Electron.App;

    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }

    private static onCloseMain() {
        // Dereference the window object.
        Main.mainWindow = null;
    }

    private static onCloseM2M() {
        // Dereference the window object.
        Main.m2mWindow = null;
    }


    private static onReady() {
        Main.openWindow_Main();
        Main.openWindow_M2M();

    }

    private static openWindow_Main() {
        Main.mainWindow = new BrowserWindow({ width: 800, height: 600 });
        Main.mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, "../index.html"),
            protocol: "file:",
            slashes: true,
        }));

        Main.mainWindow.on('closed', Main.onCloseMain);

        Main.mainWindow.webContents.openDevTools();
    }

    private static openWindow_M2M() {
        Main.m2mWindow = new BrowserWindow({ width: 800, height: 600 });
        Main.m2mWindow.loadURL(url.format({
            pathname: path.join(__dirname, "../m2m.html"),
            protocol: "file:",
            slashes: true,
        }));

        Main.m2mWindow.on('closed', Main.onCloseM2M);



        /*Main.m2mWindow.webContents.once('did-finish-load', () => {
            DbReToMendix.dbreToMendix( Main.m2mWindow);
        })*/
        Main.m2mWindow.webContents.once('did-finish-load', () => {
            Main.m2mWindow.webContents.openDevTools();
            Main.m2mWindow.webContents.once('devtools-opened', () => {
                DbReToMendix.dbreToMendix( Main.m2mWindow);
            });
        });

    }

    static main(app: Electron.App) {
        // we pass the Electron.App object and the
        // Electron.BrowserWindow into this function
        // so this class has no dependencies. This
        // makes the code easier to write tests for
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
    }
}
