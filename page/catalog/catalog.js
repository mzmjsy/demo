const admin = wx.getStorageSync('admin');
const check = wx.getStorageSync('check');
const repair = wx.getStorageSync('repair');

Page({
  data: {
    result: '',
    admin: '',
    check: '',
    repair: ''
  },

  onLoad: function(options) {

  },

  getScancode: function(event) {
    var type = event.currentTarget.dataset.index;
    // 只允许用相机扫码
    wx.scanCode({
      onlyFromCamera:true,
      success: (res) => {
        var result = res.result;
        if (4 == result.split("@").length) {
          var data = '?equipmentCode='+result.split("@")[1]+'&equipmentName='+result.split("@")[2]+'&attributeType='+result.split("@")[3];
        
          if ('attribute' == type) {
            wx.navigateTo({
              url: '../attribute/pages/attributeAdd/attributeAdd'+data
            });
          } else if ('check' == type) {
            wx.navigateTo({
              url: '../check/pages/checkAdd/checkAdd'+data
            });
          } else if ('repair' == type) {
            wx.navigateTo({
              url: '../check/pages/checkList/checkList'+data
            });
          }
        } else {
          wx.showModal({
            title: '获取失败',
            content: '二维码数据不正确',
            confirmColor: '#b02923',
            showCancel: false
          })
        }
      }
    })
  },
  
  //跳转到设备属性查询页面
  getAttributeList: function() {
    wx.redirectTo({
      url: '../attribute/pages/attributeList/attributeList'
    })
  },

  //跳转到点检结果查询页面
  getCheckList: function() {
    wx.navigateTo({
      url: '../check/pages/checkList/checkList?equipmentCode=null'
    })
  },

  getRepairList: function() {
    wx.navigateTo({
      url: '../repair/pages/repairList/repairList'
    })
  },
  
  //跳转到故障设备信息显示页面
  getRepairAdd: function() {
    wx.navigateTo({
      url: '../repair/pages/repairAdd/repairAdd'
    })
  },
  onUnload: function () {
    
  },
})