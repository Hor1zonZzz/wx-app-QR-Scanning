# wx-app-QR-Scanning
WeChat Mini Program Real-time QR Code Scanning

## Version2 注意事项
### 微信小程序`CameraContext.takePhoto(Object object)`不能在 `wx.scanCode`成功调用后立即执行会导致失败，因为当时的页面是相机页面还未返回到带有`camera`组建的页面，要设置延时进行拍照
### 开梯子会导致延迟产生拍照错误和后续隔 3 秒循环的拍照错误加剧