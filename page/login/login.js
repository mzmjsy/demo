const common = require("../../utils/util");

Page({
  data:{
    userName: false,
    userPassword: false,
    admin: '',
    check: '',
    repair: ''
  },
  onLoad:function(options){

  },
  login:function(params){
    var that = this;
    wx.showLoading({
      title: '登录中'
    })

    wx.setStorageSync('userName', params.userName);
    var mpUser = {};
    mpUser.user_code = params.userName;
    mpUser.password = params.passWord;
    common.httpPost('com.md.executivesLog.denglu.login.biz.ext', {
			mpUser: mpUser
		}, function (data) {
      var retCode = data.retCode;
			if ("0" == retCode) {
        wx.setStorageSync('sessionId', data.date.sessionId);

        for (var i in data.roles) {
          var roleId = data.roles[i]['roleId'];

          if (581 == roleId) {
            wx.setStorageSync('admin', 581);
          }

          if (582 == roleId) {
            wx.setStorageSync('check', 582);
          }

          if (583 == roleId) {
            wx.setStorageSync('repair', 583);
          }
        }

				wx.showToast({
					title: '登录成功',
          icon: 'success',
          success () {
            wx.reLaunch({
              url: '../catalog/catalog',
            })
          }
				})
			} else {
				wx.showModal({
					title: '-1' == retCode ? '用户名不存在' : '密码错误',
					icon: 'none'
				})
			}
		});
  },
  formSubmit: function(e) {
    let that = this;
    let userName = e.detail.value.userName;
    let userPassword = e.detail.value.userPassword;
    that.grant();

    if(userName == '' ){
        this.setData({
          userName: true,
        })
        return false;
    }else{
        this.setData({
          userName: false,
        })
    }
    if(userPassword == ''){
        this.setData({
          userPassword: true,
        })
        return false;
    }else{
        this.setData({
          userPassword: false,
        })
    }

    let params = {
      'userName': userName,
      'passWord': userPassword
    }
    that.login(params);
  },
  grant:function(){
    var that = this;
    
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
              success: function (res) {
                wx.checkSession({
                  success() {
                      
                  },
                  fail() {
                    // session_key 已经失效，需要重新执行登录流程
                    wx.login({
                      success: res => {
                        wx.request({
                          url: 'https://api.weixin.qq.com/sns/jscode2session',
                          data: {
                            appid: 'wxcafc4d24962823ba',
                            secret: '09aed08ba915e777d5ce5f89884860aa',
                            js_code: res.code,
                            grant_type: 'authorization_code'
                          },
                          success: res => {
                            console.log(res.data.openid);
                            wx.setStorageSync('openid', res.data.openid);
                            wx.setStorageSync('session_key', res.data.session_key);
                          }
                        });
                      }
                    });
                  }
                })
              }
          });
        } else {
          wx.reLaunch({
            url: '../grant/grant'
          })
        }
      }
    });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
})