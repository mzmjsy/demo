App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    var _this = this;
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  /**
   * 封装小程序页面的公共方法
   * 在小程序页面onShow里调用
   * @param {Object}  pageObj   小程序页面对象Page
   * @return {Object}           返回Promise对象，resolve方法执行验证授权(特指scope.userInfo)成功后的回调函数，reject方法是验证授权失败后的回调
   */
  pageOnShowInit: function(pageObj) {
    var _this = this;
    return new Promise((resolve, reject) => {
      /**
       * 这里通过pageObj.data.authsetting == (null || undefined)
       * 来区分pageObj.onLoad方法中是否已经执行完成设置页面授权列表(pageObj.data.authsetting)的方法，
       * 
       * 因为如果已经执行完成设置页面授权列表(pageObj.data.authsetting)的方法，并且获取到的授权列表为空的话，会把pageObj.data.authsetting赋值为
       * 空对象 pageObj.data.authsetting = {} ，所以pageObj.data.authsetting倘若要初始化时，请务必初始化为 null ，不能初始化为 {}，切记！
       */
      if (pageObj.data.authsetting === null || typeof pageObj.data.authsetting === 'undefined') {
        /**
         * pageObj.onLoad是异步获取用户授权信息的，很大可能会在 pageObj.onShow 之后才返回数据
         * 这里加入authorizedCb回调函数预防，回调方法会在pageObj.onLoad拿到用户授权状态列表后调用，详看app.pageOnLoadInit()
         */
        pageObj.authorizedCb = (res) => {
          if (res.authsetting['scope.userInfo'] === true) {
            //授权成功执行resolve
            resolve();
          } else {
            reject();
          }
        }
      } else {
        if (res.authsetting['scope.userInfo'] === true) {
          //授权成功执行resolve
          resolve();
        } else {
          reject();
        }
      }
    });
  },

  globalData: {
    wxUrl: 'https://www.vapp.meide-casting.com/mdapp/'
    //wxUrl: 'http://10.10.5.132:8080/vapp/'
  }
})