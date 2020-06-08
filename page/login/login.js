// pages/login/login.js
const app = getApp();
const common = require("../../utils/util");
const wxurl = app.globalData.wxUrl;
Page({
  data:{
    userName: false,
    userPassword: false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  login:function(params){
    wx.showLoading({
      title: '登录中'
    })

    common.httpPost('com.vplus.login.weblogin.flow.biz.ext', {
			userId:params.userName,
      password:params.passWord
		}, function (data) {
      console.log(data);
      setTimeout(function(){
        wx.reLaunch({
          url: '../catalog/catalog',
        },5000)
      })
			// if ("1" == data.retCode) {
			// 	wx.showToast({
			// 		title: '保存成功',
			// 		icon: 'success'
			// 	})
			// } else {
			// 	wx.showModal({
			// 		title: '保存失败',
			// 		image: '../../img/fail.jpg'
			// 	})
			// }
		});

    // wx.request({
    //   url: 'http://10.0.1.37/mdapp/com.vplus.login.weblogin.flow.biz.ext',
    //   data:{
    //     userId:params.userName,
    //     password:params.passWord
    //   },
    //   method: 'POST',
    //   dataType: 'json',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    //   },
    //   success:function(res){
    //     console.log(res);
    //     if(res.statusCode ==200){
    //       if(res.data.retFalg == 'F'){
    //         wx.hideLoading({
    //           complete(){
    //             wx.showModal({
    //               title: '登录失败',
    //               content: res.data.retMsg,
    //               confirmColor: '#b02923',
    //               showCancel: false
    //             })
    //           }
    //         });
    //       } else {
    //         wx.setStorageSync('cookies', res.cookies),
    //         wx.hideLoading();
    //         wx.showToast({
    //           title:"登录成功",
    //           icon:"Yes",
    //           success:function(){
    //             setTimeout(function(){
    //               wx.redirectTo({
    //                 url: '../catalog/catalog',
    //               },5000)
    //             })
    //           }
    //         })
    //       }
    //     }
    //   },
    //   fail: function(res){
    //     wx.hideLoading();
    //     wx.showModal({
    //       title: '登录失败',
    //       content: '链接不正确',
    //       confirmColor: '#b02923',
    //       showCancel: false
    //     })
    //     return false;
    //   }
    // })
  },
  formSubmit: function(e) {
    let that = this;
    let userName = e.detail.value.userName;
    let userPassword = e.detail.value.userPassword;
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