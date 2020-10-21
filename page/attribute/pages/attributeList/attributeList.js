const common = require('../../../../utils/util.js');
const sessionId = wx.getStorageSync('sessionId');

Page({
  data: {
    scrollHeight: wx.getSystemInfoSync().windowHeight,
    attributeList: [],
    visual: false,
    animation: ''
  },

  goTop() {
    this.setData({
      scrollTop: 0
    })
  },
  scroll(e) {
    let scrollTop = e.detail.scrollTop
    // 如果超过半屏
    if (scrollTop > this.data.scrollHeight / 2) {
      this.setData({
        visual: true,
        animation: 'fadeIn'
      })
    } else {
      this.setData({
        animation: 'fadeOut'
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 此处模拟网络请求
    this.setData({
      attributeList: []
    })
    this.getAttributes(options.equipmentCode);
  },

	//根据设备编码，获取该设备点检的属性
	getAttributes: function (equipmentCode) {
    wx.showLoading({
			title: '数据正在请求中',
			mask: true
		})
    var that = this;
		var criteria = new Object();
    criteria._entity = 'com.md.djxmZs.djxmZs.AppPropertiesInfo';

    var expr = new Array();
    var expr1 = new Object();
    expr1.equipmentCode = equipmentCode;
    expr1._op = "=";
    expr.push(expr1);
    criteria._expr = expr;

		var orderby = new Object();
		var orderbyArr = new Array();
		orderby._sort = "desc";
		orderby._property = "attributeId";
		orderbyArr.push(orderby);
    criteria._orderby = orderbyArr;
    
    common.httpPost('com.md.djxmZs.apppropertiesinfobiz.queryAppPropertiesInfos.biz.ext', {
      criteria: criteria,
      pageSize: 5000,
      sessionId: sessionId
		}, function (data) {
			if (0 != data.total) {
				wx.hideLoading();
        that.setData({
          attributeList: data.apppropertiesinfos
        });
			} else {
				wx.showModal({
					title: '当前没有设备属性数据',
					image: '../../../../img/fail.jpg'
				})
			}
		});
	},
  
  //执行编辑或删除
  edit: function (e) {
    console.log(e)
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../attributeAdd/attributeAdd?equipment='+JSON.stringify(name),
    })

    // wx.showModal({
    //   title: '提示',
    //   content: '请选择操作',
    //   cancelText: '修改',
    //   confirmText: '删除',
    //   success (res) {
    //     if (res.confirm) {
    //       console.log('删除操作')
    //     } else if (res.cancel) {
    //       console.log('修改操作')
    //     }
    //   }
    // })
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