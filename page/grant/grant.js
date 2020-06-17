//获取应用实例
const app = getApp()

Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isHide: false
    },

    onLoad: function () {
        var that = this;
        // 查看是否授权
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function (res) {
                            wx.checkSession({
                                success() {
                                    //session_key 未过期，并且在本生命周期一直有效
                                    wx.reLaunch({
                                        url: '../login/login'
                                    })
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
                    that.setData({
                        isHide: true
                    });
                }
            }
        });
    },
    bindGetUserInfo: function (e) {
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            var that = this;
            wx.reLaunch({
                url: '../login/login'
            })
            //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
            that.setData({
                isHide: false
            });
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '返回授权'
            });
        }
    }
})