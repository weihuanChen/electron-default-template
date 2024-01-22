
import { BrowserWindow, ipcMain, app } from "electron";
export class CommonWindowEvent {
  private static getWin(event: any) {
    return BrowserWindow.fromWebContents(event.sender);
  }
  public static listen() {
    ipcMain.handle("minimizeWindow", (e) => {
      this.getWin(e)?.minimize();
    });

    ipcMain.handle("maxmizeWindow", (e) => {
      this.getWin(e)?.maximize();
    });
    ipcMain.handle("windowUnmaximize", (event) => {
      this.getWin(event)?.unmaximize();
    });
    ipcMain.handle("hideWindow", (e) => {
      this.getWin(e)?.hide();
    });

    ipcMain.handle("showWindow", (e) => {
      this.getWin(e)?.show();
    });

    ipcMain.handle("closeWindow", (e) => {
      this.getWin(e)?.close();
    });
    ipcMain.handle("resizable", (e) => {
      return this.getWin(e)?.isResizable();
    });
    ipcMain.handle("getPath", (e, name: any) => {
      return app.getPath(name);
    });
  }
  public static regWinEvent(win: BrowserWindow) {
    win.on("maximize", () => {
      win.webContents.send("windowMaximize");
    });
    win.on("unmaximize", () => {
      win.webContents.send("windowUnmaximize");
    });
    //注册打开子窗口的回调函数
    win.webContents.setWindowOpenHandler((param) => {
      //基础窗口配置对象
      // todo:需要补充类型
      let config:any = {
        frame: false,
        show: true,
        modal:false,
        webPreferences: {
          nodeIntegration: true,
          webSecurity: false,
          allowRunningInsecureContent: true,
          contextIsolation: false,
          webviewTag: true,
          spellcheck: false,
          disableHtmlFullscreenWindowResize: true,
          nativeWindowOpen: true,
        },
      };
      //开发者自定义窗口配置对象
      let features = JSON.parse(param.features);
      for (let p in features) {
        if (p === "webPreferences") {
          for (let p2 in features.webPreferences) {
            config.webPreferences[p2] = features.webPreferences[p2] as any;
          }
        } else {
          config[p] = features[p];
        }
      }
      if (config["modal"] === true) config.parent = win;
      //允许打开窗口，并传递窗口配置对象
      return { action: "allow", overrideBrowserWindowOptions: config };
    });
  }
}
