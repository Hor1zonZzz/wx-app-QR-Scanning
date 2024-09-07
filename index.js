Page({
  data: {
    scanResult: '暂无结果',  // 扫描结果默认值
    scanTime: '',            // 扫描时间
    resetTimer: null,        // 定时器ID
    resetDuration: 3000      // 设置扫描结果恢复默认的时长 (毫秒)
  },

  // 格式化时间函数
  formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  },

  // 处理扫描成功的事件
  handleScanCode(e) {
    const scanResult = e.detail.result;  // 获取扫描结果
    const currentTime = this.formatTime(new Date());  // 获取当前时间
    console.log('扫描结果:', scanResult);

    // 更新扫码结果和时间
    this.setData({
      scanResult: scanResult,
      scanTime: currentTime
    });

    // 每次成功扫描时，重置定时器
    this.resetScanResult();
  },

  // 重置扫描结果的函数
  resetScanResult() {
    // 清除之前的定时器
    if (this.data.resetTimer) {
      clearTimeout(this.data.resetTimer);
    }

    // 设置新的定时器，过一段时间后恢复到默认状态
    const timerId = setTimeout(() => {
      this.setData({
        scanResult: '暂无结果',
        scanTime: ''
      });
    }, this.data.resetDuration);  // 5秒后恢复默认状态

    // 保存定时器ID
    this.setData({
      resetTimer: timerId
    });
  },

  onUnload() {
    // 页面卸载时清除定时器，避免内存泄漏
    if (this.data.resetTimer) {
      clearTimeout(this.data.resetTimer);
    }
  }
});
