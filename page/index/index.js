Page({
    data: {
   
    },
   
    //预览图片
    previewImg: function (e) {
      var currentUrl = e.currentTarget.dataset.currenturl
      var previewUrls = e.currentTarget.dataset.previewurl
      wx.previewImage({
        current: currentUrl, //必须是http图片，本地图片无效
        urls: previewUrls, //必须是http图片，本地图片无效
      })
    },
   
    onLoad: function() {
      var that = this
      var picList = []
      picList.push("../../img/equipment1.jpg")
      picList.push("../../img/equipment2.jpg")
      picList.push("../../img/equipment3.jpg")
      picList.push("../../img/equipment4.jpg")
      that.setData({
        picList: picList,
      })
    }
})