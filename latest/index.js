Page({
  data: {
    scanResult: '暂无结果',
    scanTime: '',
    isScanning: false,
    cameraContext: null,
    photoPath: '',
    scanTimeoutId: null, // 保存 setTimeout 的 ID
  },

  // 格式化时间函数
  formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  },

  // 扫描条码函数
  scanCode() {
    if (!this.data.isScanning) {
      return; // 如果扫描状态被停止，直接退出
    }

    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode'],
      success: (res) => {
        const currentTime = this.formatTime(new Date());
        console.log('扫描成功:', res);

        // 更新扫描结果和扫描时间
        this.setData({
          scanResult: res.result,
          scanTime: currentTime
        });

        // 延时拍照，确保 scanCode 完成后调用
        setTimeout(() => {
          this.takePhoto();
        }, 300);

        // 使用 setTimeout 进行下一次扫描
        const timeoutId = setTimeout(() => {
          this.scanCode(); // 继续扫描
        }, 2000);

        // 保存定时器 ID
        this.setData({
          scanTimeoutId: timeoutId
        });
      },
      fail: (err) => {
        console.log('扫描失败:', err);
        this.setData({
          scanResult: '扫描失败，请重试',
          scanTime: ''
        });
      }
    });
  },

  // 拍照保存函数
  takePhoto() {
    const cameraContext = this.data.cameraContext;
    cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log('照片路径:', res.tempImagePath);
        this.setData({
          photoPath: res.tempImagePath
        });
      },
      fail: (err) => {
        console.log('拍照失败:', err);
      }
    });
  },

  // 开始扫描
  startScan() {
    this.setData({ isScanning: true });

    // 创建相机上下文
    const cameraContext = wx.createCameraContext();
    this.setData({ cameraContext });

    // 立即触发第一次扫描
    this.scanCode();
  },

  // 停止扫描
  stopScan() {
    this.setData({ isScanning: false });

    // 清除定时任务
    const timeoutId = this.data.scanTimeoutId;
    if (timeoutId) {
      clearTimeout(timeoutId); // 清除正在等待的 setTimeout
      this.setData({ scanTimeoutId: null });
    }

    console.log("扫描已停止");
  }
});

