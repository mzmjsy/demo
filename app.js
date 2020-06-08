//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    var _this = this;
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取登录态信息
    this.getLoginInfo().then(function(res) {
      if ((typeof res !== 'undefined') && res.token) {
        //获取用户全部的授权信息
        wxapi('getSetting').then(function(setting) {
          _this.gData.logined = true;
          _this.gData.userinfo = res;
          _this.gData.authsetting = setting.authSetting;

          //执行页面定义的回调方法
          (_this.loginedCb && typeof(_this.loginedCb) === 'function') && _this.loginedCb();
        }, function(error) {
          return Promise.reject(error);
        });
      } else {
        return Promise.reject({
          errMsg: 'LoginInfo miss token!',
        });
      }
    }).catch(function(error) {
      wx.showModal({
        title: 'Error',
        content: error.errMsg,
      });
      return false;
    });
  
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
   * [getLoginInfo 获得自定义登录态信息]
   * @param  {[string]]} loginKey [缓存的key值]
   * @return {[Promise]}          返回一个Promise对象
   */
  getLoginInfo: function(loginKey = 'loginInfo') {
    var _this = this;
    return new Promise((resolve, reject) => {
      wxapi('checkSession').then(function() {
        //登录态有效，从缓存中读取
        return wxapi('getStorage', {
          'key': loginKey
        }).then(function(res) {
          //获取loginKey缓存成功
          if (res.data) {
            //缓存获取成功，并且值有效
            return Promise.resolve(res.data);
          } else {
            //缓存获取成功，但值无效，重新登录
            return _this.exeLogin(loginKey, 3000);
          }
        }, function() {
          //获取loginKey缓存失败，重新登录
          return _this.exeLogin(loginKey, 3000);
        });
      }, function() {
        //登录态失效，重新调用登录
        return _this.exeLogin(loginKey, 3000);
      }).then(function(res) {
        resolve(res);
      }).catch(function(error) {
        reject(error);
      });
    });
  },

  /**
   * [exeLogin 执行登录流程]
   * @param  {[string]} timeout   调用wx.login的超时时间
   * @param  {[string]} loginKey  自定义登录态信息缓存的key
   * @return {[Promise]}          返回一个Promise对象
   */
  exeLogin: function(loginKey, timeout = 3000) {
    var _this = this;
    return new Promise((resolve, reject) => {
      wxapi('login', {
        'timeout': timeout
      }).then(function(res) {
        return wxapi('request', {
          'method': 'POST',
          'url': _this.gData.api.request + '/api/User/third',
          'header': {
            'Content-type': 'application/x-www-form-urlencoded',
          },
          'data': {
            'code': res.code,
            'platform': 'miniwechat',
          }
        })
      }).then(function(res) {
        //当服务器内部错误500(或者其它目前我未知的情况)时，wx.request还是会执行success回调，所以这里还增加一层服务器返回的状态码的判断
        if (res.statusCode === 200 && res.data.code === 1) {
          //获取到自定义登录态信息后存入缓存，由于我们无需在意缓存是否成功(前面代码有相应的处理逻辑)，所以这里设置缓存可以由它异步执行即可
          wxapi('setStorage', {
            'key': loginKey,
            'data': res.data.data.userinfo
          });
          //userinfo里面包含有用户昵称、头像、性别等信息，以及自定义登录态的token
          resolve(res.data.data.userinfo);
        } else {
          return Promise.reject({
            'errMsg': (res.data.msg ? 'ServerApi error:' + res.data.msg : 'Fail to network request!') + ' Please feedback to manager and close the miniprogram manually.'
          });
        }
      }).catch(function(error) {
        reject(error);
      });
    });
  },

  /**
   * [exeAuth 执行用户授权流程]
   * @param  {[string]} loginKey  自定义登录态信息缓存的key
   * @param  {[Object]} data      wx.getUserInfo接口返回的数据结构一致
   * @return {[Promise]}          返回一个Promise对象
   */
  exeAuth: function(loginKey, data) {
    var _this = this;

    return new Promise((resolve, reject) => {
      wxapi('request', {
        'method': 'POST',
        'url': _this.gData.api.request + '/api/User/thirdauth',
        'header': {
          'Content-type': 'application/x-www-form-urlencoded',
        },
        'data': {
          'platform': 'miniwechat',
          'token': _this.gData.userinfo.token,
          'encryptedData': data.encryptedData,
          'iv': data.iv,
        }
      }).then(function(res) {
        //当服务器内部错误500(或者其它目前我未知的情况)时，wx.request还是会执行success回调，所以这里还增加一层服务器返回的状态码的判断
        if (res.statusCode === 200 && res.data.code === 1) {
          //更新app.gData中的数据
          _this.gData.authsetting['scope.userInfo'] = true;
          _this.gData.userinfo = res.data.data.userinfo;

          //更新自定义登录态的缓存数据，防止再次进入小程序时读取到旧的缓存数据，这里让它异步执行即可，
          //倘若异步执行的结果失败，直接清除自定义登录态缓存，再次进入小程序时系统会自动重新登录生成新的
          wxapi('setStorage', {
            'key': loginKey,
            'data': res.data.data.userinfo
          }).catch(function(error) {
            console.warn(error.errMsg);
            wxapi('removeStorage', {
              'key': loginKey
            });
          });

          resolve(res.data.data.userinfo);
        } else {
          return Promise.reject({
            'errMsg': res.data.msg ? 'ServerApi error:' + res.data.msg : 'Fail to network request!'
          });
        }
      }).catch(function(error) {
        reject(error);
      });
    });
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

  /**
   * 封装小程序页面的公共方法
   * 在小程序页面onLoad里调用
   * @param {Object}  pageObj   小程序页面对象Page
   * @param {Boolean} needAuth  是否检验用户授权(scope.userInfo)
   * @return {Object}           返回Promise对象，resolve方法执行验证登录成功后且不检验授权(特指scope.userInfo)的回调函数，reject方法是验证登录失败后的回调
   */
  pageOnLoadInit: function(pageObj, needAuth = false) {
    var _this = this;
    return new Promise((resolve, reject) => {
      _this.pageGetLoginInfo(pageObj).then(function(res) {
        // console.log(_this.gData.logined);
        if (res.logined === true) {
          //登录成功、无需授权
          resolve(res);

          if (needAuth) {
            if (res.authsetting['scope.userInfo'] === false || typeof res.authsetting['scope.userInfo'] === 'undefined') {
              common.navigateTo('/pages/auth/auth');
            }
          }

        } else {
          reject({
            'errMsg': 'Fail to login.Please feedback to manager.'
          });
        }
      });
    });
  },

  /**
   * 获取小程序注册时返回的自定义登录态信息（小程序页面中调用）
   * 主要是解决pageObj.onLoad 之后app.onLaunch()才返回数据的问题
   */
  pageGetLoginInfo: function(pageObj) {
    var _this = this;
    return new Promise((resolve, reject) => {
      // console.log(_this.gData.logined);
      if (_this.gData.logined == true) {
        wxsetData(pageObj, {
          'logined': _this.gData.logined,
          'authsetting': _this.gData.authsetting,
          'userinfo': _this.gData.userinfo
        }).then(function(data) {
          //执行pageObj.onShow的回调方法
          (pageObj.authorizedCb && typeof(pageObj.authorizedCb) === 'function') && pageObj.authorizedCb(data);
          resolve(data);
        });

      } else {
        /**
         * 小程序注册时，登录并发起网络请求，请求可能会在 pageObj.onLoad 之后才返回数据
         * 这里加入loginedCb回调函数来预防，回调方法会在接收到请求后台返回的数据后执行，详看app.onLaunch()
         */
        _this.loginedCb = () => {
          wxsetData(pageObj, {
            'logined': _this.gData.logined,
            'authsetting': _this.gData.authsetting,
            'userinfo': _this.gData.userinfo
          }).then(function(data) {
            //执行pageObj.onShow的回调方法
            (pageObj.authorizedCb && typeof(pageObj.authorizedCb) === 'function') && pageObj.authorizedCb(data);
            resolve(data);
          });
        }
      }
    });
  },

  'gData': {
    'logined': false, //用户是否登录
    'authsetting': null, //用户授权结果
    'userinfo': null, //用户信息(包含自定义登录态token)

    'api': {
      'request': 'http://logindemo',
      'socket': '',
      'uploadfile': '',
      'downloadfile': ''
    },
  },

  globalData: {
    wxUrl: 'http://10.0.1.37/mdapp/'
    //wxUrl: 'http://10.10.5.132:8080/vapp/'
  }
})