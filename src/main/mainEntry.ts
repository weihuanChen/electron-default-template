import { app, BrowserWindow, Menu } from "electron";
import { CustomScheme } from "./CustomScheme";
import { CommonWindowEvent } from "./CommonWindowRegister";
// 渲染进程开发者调试工具的警告
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
/** 主进程入口 */
// 创建窗口
let mainWindow: BrowserWindow;
// 窗口创建完毕加载window窗口
app.on("browser-window-created", (e, win) => {
  console.log("event: browser-window-created", JSON.stringify(e));
  CommonWindowEvent.regWinEvent(win);
});
// app ready之后加载
app.whenReady().then(() => {
  // 页面窗口配置
  let webConfig = {
    webPreferences: {
      nodeIntegration: true, // node 环境集成到渲染进程里
      webSecurity: false, // 禁用同源策略
      allowRunningInsecureContent: true, // 允许加载不安全的资源
      contextIsolation: false, // 在相同的js上下文中允许使用electron api
      webviewTag: true, // 允许使用webview标签
      spellcheck: false, // 禁用拼写检查
      disableHtmlFullscreenWindowResize: true, // 禁用html全屏窗口调整大小
    },
    frame: true, // 用于控制默认的系统放大缩小框
  };
  // 加载窗口
  mainWindow = new BrowserWindow(webConfig);

  // 开发环境下加载url
  if (process.argv.length >= 3) {
    // 开发
    // 通过命令行的方式加载url
    mainWindow.loadURL(process.argv[2]);
    //打开调试工具
    mainWindow.webContents.openDevTools({ mode: "undocked" });
  } else {
    // 生产
    CustomScheme.registerScheme();
    mainWindow.loadURL(`app://index.html`);
    //打开调试工具
    // mainWindow.webContents.openDevTools({ mode: "undocked" });
  }
  // 菜单控制
  const menu = Menu.buildFromTemplate([]);
  Menu.setApplicationMenu(menu);
  // 监听窗口事件
  CommonWindowEvent.listen();
});
