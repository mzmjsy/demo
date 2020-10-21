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
        if (9 == result.split("@").length) {
          var data = '?attribute1='+result.split("@")[1]+'&equipmentCode='+result.split("@")[2]+'&equipmentName='+result.split("@")[3]+'&attributeType='+result.split("@")[4]+'&attribute2='+result.split("@")[5]+'&attribute3='+result.split("@")[6]+'&attribute4='+result.split("@")[7]+'&attribute5='+result.split("@")[8];
          var equipment = new Object();
          equipment.attribute1 = result.split("@")[1];
          equipment.equipmentCode = result.split("@")[2];
          equipment.equipmentName = result.split("@")[3];
          equipment.attributeType = result.split("@")[4];
          equipment.attribute2 = result.split("@")[5];
          equipment.attribute3 = result.split("@")[6];
          equipment.attribute4 = result.split("@")[7];
          equipment.attribute5 = result.split("@")[8];
        
          if ('attribute' == type) {
            wx.navigateTo({
              url: '../../../attribute/pages/attributeAdd/attributeAdd?equipment='+JSON.stringify(equipment)
            });
          } else if ('check' == type) {
            wx.navigateTo({
              url: '../../../check/pages/checkAdd/checkAdd'+data
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

  onUnload: function () {
    
  },
})