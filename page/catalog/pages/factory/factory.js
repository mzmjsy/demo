const admin = wx.getStorageSync('admin');
const check = wx.getStorageSync('check');
const repair = wx.getStorageSync('repair');

Page({
  data: {
    result: '',
    admin: '',
    check: '',
    repair: '',
    action: ''
  },

  onLoad: function(options) {
    var title = options.title;
    var url = '/page/catalog/pages/equipment/equipment';
    if ('analyCheck' == title) {
      url = '/page/report/pages/analyCheck/analyCheck'
    } else if ('analyRepair' == title) {
      url = '/page/report/pages/analyRepair/analyRepair'
    }

    this.setData({
      action: url + '?title='+title
    })
  },

  onUnload: function () {

  },
})