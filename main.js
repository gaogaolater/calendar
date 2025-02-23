const {
  app,
  BrowserWindow,
  Tray,
  nativeImage,
  screen,
  Menu,
} = require("electron");
const path = require("path");

let blurTimer = null;
const createWindow = () => {
  // 获取主显示器的尺寸
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const x = width - 350; // 设置窗口的 x 坐标为屏幕宽度减去窗口宽度
  const y = height - 358; // 设置窗口的 y 坐标为屏幕高度减去窗口高度

  const iconPath = path.join(__dirname, "material", "calendar.png"); // 托盘图标路径
  const icon = nativeImage.createFromPath(iconPath);

  const win = new BrowserWindow({
    width: 350,
    height: 358,
    x: x,
    y: y,
    resizable: false, // 禁止窗口大小调整
    frame: false, // 无边框窗口
    icon: icon,
    show: false,
  });

  win.loadFile("one.html");
  // 隐藏任务栏图标
  win.setSkipTaskbar(true);

  // 监听窗口失去焦点事件
  win.on("blur", () => {
    if (win.isVisible()) {
      clearTimeout(blurTimer); // 清除之前的定时器
      blurTimer = setTimeout(() => {
        win.hide(); // 关闭窗口
      }, 200);
    }
  });

  const tray = new Tray(icon);
  tray.setImage(icon);

  // 监听托盘图标的点击事件
  tray.on("click", () => {
    if (win.isVisible()) {
      win.hide(); // 如果窗口可见，则隐藏
    } else {
      showWindowUnderTray(tray, win);
    }
  });
};

function showWindowUnderTray(tray, mainWindow) {
  if (!mainWindow) return;

  // 获取 Tray 图标的位置
  const trayBounds = tray.getBounds();

  // 获取主窗口的大小
  const windowBounds = mainWindow.getBounds();

  // 获取当前屏幕的尺寸
  const screenSize = screen.getPrimaryDisplay().workAreaSize;
  
  // 计算窗口的位置
  let x = Math.round(
    trayBounds.x - (windowBounds.width - trayBounds.width) / 2
  );
  let y = trayBounds.y + trayBounds.height;

  // 确保窗口不会超出屏幕
  if (x + windowBounds.width > screenSize.width) {
    x = screenSize.width - windowBounds.width;
  }
  if (y + windowBounds.height > screenSize.height) {
    y = trayBounds.y - windowBounds.height;
  }

  // 设置窗口位置并显示窗口
  mainWindow.setPosition(x, y);
  mainWindow.show();
}

app.whenReady().then(() => {
  if (process.platform === "darwin") {
    //macos
    app.dock.hide();
  }
  createWindow();
});
