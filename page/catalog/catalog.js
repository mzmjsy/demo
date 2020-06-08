Page({
  data: {
    result: ''
  },

  getScancode: function(event) {
    var type = event.currentTarget.dataset.index;
    // 只允许用相机扫码
    wx.scanCode({
      onlyFromCamera:true,
      success: (res) => {
        var result = res.result;
        var data = '?equipmentCode='+result.split("@")[0]+'&equipmentName='+result.split("@")[1]+'&attributeType='+result.split("@")[2];
        
        switch(type) {
          case 'attribute':
            wx.redirectTo({
              url: '../attribute/pages/attributeAdd/attributeAdd'+data
            })
          case 'check':
            wx.redirectTo({
              url: '../check/pages/checkAdd/checkAdd'+data
            })
          case 'repair':
            wx.redirectTo({
              url: '../check/pages/checkList/checkList'+data
            })
        }
      }
    })
  },
  
  onLoad: function() {

  },

  //跳转到设备属性查询页面
  getAttributeList: function() {
    wx.redirectTo({
      url: '../attribute/pages/attributeList/attributeList'
    })
  },

  //跳转到点检结果查询页面
  getCheckList: function() {
    wx.redirectTo({
      url: '../check/pages/checkList/checkList?equipmentCode=null'
    })
  },

  getRepairList: function() {
    wx.redirectTo({
      url: '../repair/pages/repairList/repairList'
    })
  },
  
  //跳转到故障设备信息显示页面
  getRepairAdd: function() {
    wx.redirectTo({
      url: '../repair/pages/repairAdd/repairAdd'
    })
  },
})