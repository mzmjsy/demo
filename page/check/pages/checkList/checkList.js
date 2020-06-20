const common = require('../../../../utils/util.js');
const sessionId = wx.getStorageSync('sessionId');

Page({
  data: {
    config:{
      content: [],
      titles: ['ID', '设备编码', '设备名称', '点检部位内容', '结果', '时间', '是否故障', '是否维修'],
      props : ['checkId', 'equipmentCode', 'equipmentName', 'attributeName', 'checkResult', 'checkDate', 'isFault', 'isRepair'],
      columnWidths: ['0rpx', '0rpx', '0rpx', '300rpx', '130rpx','200rpx', '100rpx', '0rpx'],
      hides: ['none', 'none', 'none','block','block','block','block','none'],
      border: true,
      stripe: true,
      type: 'check',
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

    this.getCheckResult(options);
  },

	//根据设备编码，获取该设备点检的属性
	getCheckResult: function (options) {
		wx.showLoading({
			title: '数据正在请求中',
			mask: true
    })

    var that = this;
    var equipmentCode = options.equipmentCode;
		var criteria = new Object();
    criteria._entity = 'com.md.djxmZs.djxmZs.AppCheckRepairV';

    var expr = new Array();
    var expr1 = new Object();
    expr1.checkResult = ' ';
    expr1._op = "<>";
    expr.push(expr1);

    if ('null' != equipmentCode && '' != equipmentCode && null != equipmentCode) {
      var expr2 = new Object();
      expr2.equipmentCode = equipmentCode;
      expr2._op = "=";
      expr.push(expr2);
      var expr3 = new Object();
      expr3.isFault = 'Y';
      expr3._op = "=";
      expr.push(expr3);
    }
    criteria._expr = expr;

		var orderby = new Object();
		var orderbyArr = new Array();
		orderby._sort = "desc";
		orderby._property = "checkDate";
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
					title: '当前没有点检数据',
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