Page({
  data: {
    scanResult: '暂无结果', // 扫描结果默认值
    scanTime: '',           // 扫描时间
    isScanning: false,      // 是否处于扫描状态
    scanInterval: null,     // 定时器用于自动扫描
    cameraContext: null,    // 相机上下文
    photoPath: '',          // 截图保存路径
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
    wx.scanCode({
      onlyFromCamera: true, // 只允许相机扫描
      scanType: ['barCode'], // 只扫描条形码，避免多选
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
        }, 300); // 延时300ms后拍照（需要测试，因为调用完摄像头需要跳转回界面进行拍照有延迟）
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
takePhoto () {
    const cameraContext = this.data.cameraContext;
    cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log('照片路径:', res.tempImagePath);
        // 保存照片路径到页面中，展示照片
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

    // 设置定时器，每隔3秒扫描一次
    const intervalId = setInterval(() => {
      if (this.data.isScanning) {
        this.scanCode();
      }
    }, 3000); // 每3秒进行一次扫描

    // 保存定时器ID
    this.setData({
      scanInterval: intervalId
    });
  },

  // 停止扫描
  stopScan() {
    this.setData({ isScanning: false });

    // 清除定时器
    clearInterval(this.data.scanInterval);
    this.setData({
      scanInterval: null
    });
  }
});
