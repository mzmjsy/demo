const common = require('../../utils/util.js');

Page({
  data: {
  
  },
  
  //预览图片
  previewImg: function (e) {
    var currentUrl = e.currentTarget.dataset.currenturl;
    var previewUrls = e.currentTarget.dataset.previewurl;
    wx.previewImage({
      current: currentUrl,  //必须是http图片，本地图片无效
      urls: previewUrls,    //必须是http图片，本地图片无效
    })
  },
  
  onLoad: function() {
    var that = this
    var url = common.wxUrl() + 'image/';
    var picList = []
    picList.push(url + "equipment1.jpg")
    picList.push(url + "equipment2.jpg")
    picList.push(url + "equipment3.jpg")
    picList.push(url + "equipment4.jpg")
    that.setData({
      picList: picList,
    })
  }
})