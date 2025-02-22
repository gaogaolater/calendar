const { app, BrowserWindow, Tray, nativeImage, screen } = require("electron");
const path = require("path");

let blurTimer = null;
const createWindow = () => {
  // 获取主显示器的尺寸
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const x = width - 350; // 设置窗口的 x 坐标为屏幕宽度减去窗口宽度
  const y = height - 358; // 设置窗口的 y 坐标为屏幕高度减去窗口高度

  const win = new BrowserWindow({
    width: 350,
    height: 358,
    x: x,
    y: y,
    resizable: false, // 禁止窗口大小调整
    frame: false, // 无边框窗口
  });

  win.loadFile("one.html");

  // 监听窗口失去焦点事件
  win.on("blur", () => {
    if (win.isVisible()) {
      clearTimeout(blurTimer); // 清除之前的定时器
      blurTimer = setTimeout(() => {
        win.hide(); // 关闭窗口
      }, 200);
    }
  });

  const iconPath = path.join(__dirname, "material", "calendar.png"); // 托盘图标路径
  const icon = nativeImage.createFromPath(iconPath);
  const tray = new Tray(icon);
  // 监听托盘图标的点击事件
  tray.on("click", () => {
    if (win.isVisible()) {
      win.hide(); // 如果窗口可见，则隐藏
    } else {
      win.show(); // 如果窗口隐藏，则显示
    }
  });
};

app.whenReady().then(() => {
  createWindow();
});
