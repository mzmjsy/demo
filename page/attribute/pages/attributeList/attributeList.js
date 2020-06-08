const common = require('../../../../utils/util.js');

Page({
  data: {
    config:{
      content: [],
      titles: ['设备名称', '点检部位', '点检内容', '点检标准'],
      props : ['equipmentName', 'attributeType', 'attributeName', 'equipmentStandard'],
      columnWidths: ['160rpx', '160rpx','200rpx','200rpx'],
      hides: ['block','block','block','block'],
      border: true,
      stripe: true,
      type: 'attribute',
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
    this.getAttributes();
  },

	//根据设备编码，获取该设备点检的属性
	getAttributes: function () {
    wx.showLoading({
			title: '数据正在请求中',
			mask: true
		})
    var that = this;
		var criteria = new Object();
		criteria._entity = 'com.md.djxmZs.djxmZs.AppPropertiesInfo';
		var orderby = new Object();
		var orderbyArr = new Array();
		orderby._sort = "desc";
		orderby._property = "equipmentCode";
		orderbyArr.push(orderby);
		criteria._orderby = orderbyArr;
    common.httpPost('com.md.djxmZs.apppropertiesinfobiz.queryAppPropertiesInfos.biz.ext', {
			criteria: criteria
		}, function (data) {
			console.log(data);
			if (0 != data.total) {
				wx.hideLoading();
        that.setData({
          'config.content': data.apppropertiesinfos
        });
			} else {
				wx.showModal({
					title: '当前没有设备属性数据',
					image: '../../../../img/fail.jpg'
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