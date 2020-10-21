const common = require("../../utils/util");
const log = require('../../utils/log');

Page({
  data:{
    userName: '',
    userPassword: '',
    admin: '',
    check: '',
    repair: ''
  },
  onLoad:function(options){
    this.setData({
      userName: wx.getStorageSync('userName'),
      userPassword: wx.getStorageSync('passWord')
    })
  },
  login:function(params){
    wx.showLoading({
      title: '登录中'
    })

    wx.setStorageSync('userName', params.userName);
    wx.setStorageSync('passWord', params.passWord);
    var mpUser = {};
    mpUser.user_code = params.userName;
    mpUser.password = params.passWord;
    common.httpPost('com.md.executivesLog.denglu.login.biz.ext', {
			mpUser: mpUser
		}, function (data) {
      var retCode = data.retCode;
      var roleIds = '';
      var url = '../catalog/pages/catalog/catalog';

			if ("0" == retCode) {
        wx.setStorageSync('sessionId', data.date.sessionId);

        if (data.roles.length > 0) {
          wx.setStorageSync('name', data.roles[0]['userName']);
        }

        for (var i in data.roles) {
          var roleId = data.roles[i]['roleId'];
          roleIds = roleIds + roleId + ',';

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
        roleIds = roleIds.substr(0,roleIds.length - 1);

        log.info('登录用户名：' + params.userName + '登录权限：【' + wx.getStorageSync('admin') + '，' + wx.getStorageSync('check') + '，' + wx.getStorageSync('repair') + '】' + '，登录时间：' + common.formatTime(new Date()));

        if (roleIds.indexOf(601) >= 0) {
          url = '../inspection/pages/mulu/mulu';
        }

        wx.showToast({
          title: '登录成功',
          icon: 'success',
          success () {
            wx.reLaunch({
              url: url,
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