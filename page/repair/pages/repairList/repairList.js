const common = require('../../../../utils/util.js');
const sessionId = wx.getStorageSync('sessionId');

Page({
  data: {
    config:{
      content: [],
      titles: ['点检内容', '维修情况', '维修时间'],
      props : ['attributeName', 'repairDesc', 'repairDate'],
      columnWidths: ['250rpx', '300rpx','180rpx'],
      hides: ['block','block','block'],
      border: true,
      stripe: true,
      type: 'repair',
      headbgcolor: 'gray'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 此处模拟网络请求
    this.setData({
      'config.content': []
    })
    this.getRepair();
  },

	//获取故障设备维修情况
	getRepair: function () {
		var that = this;
		wx.showLoading({
			title: '数据正在请求中',
			mask: true
		})
    var that = this;
		var criteria = new Object();
    criteria._entity = 'com.md.djxmZs.djxmZs.AppCheckRepairV';
    var expr = new Array();
    var expr1 = new Object();
    expr1.isFault = 'Y';
    expr1._op = "=";
    expr.push(expr1);
    criteria._expr = expr;
		var orderby = new Object();
		var orderbyArr = new Array();
		orderby._sort = "desc";
		orderby._property = "repairDate";
		orderbyArr.push(orderby);
		criteria._orderby = orderbyArr;
    common.httpPost('executivesLog/djxmZs/com.md.djxmZs.appCheckRepairV.queryappCheckRepairVS.biz.ext', {
      criteria: criteria,
      pageSize: 5000,
      sessionId: sessionId
		}, function (data) {
			if (0 != data.total) {
				wx.hideLoading();
        that.setData({
          'config.content': data.appCheckRepairVs
        });
			} else {
				wx.showToast({
					title: '当前没有维修数据',
					icon: "none"
				})
			}
		});
	},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.reLaunch({
      url: '../catalog/catalog'
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})