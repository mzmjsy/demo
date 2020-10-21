const common = require('../../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: common.formatDate(new Date()),
    date2: common.formatDate(new Date()),
    scrollHeight: wx.getSystemInfoSync().windowHeight,
    currentTab: 0,
    uhide: 0,
    visual: false,
    animation: '',
    deliverys: [],
    deliveryHeadId: '',
    deliveryCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrders('');
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

  bindDateChange(e) {
    let that = this;
    that.setData({
      date: e.detail.value,
    })
  },

  bindDateChange2(e) {
    let that = this;
    that.setData({
      date2: e.detail.value,
    })
  },

	//根据实际发货日期获取发货单
	getOrders: function (endDate) {
		wx.showLoading({
			title: '数据正在请求中',
			mask: true
		})
    var that = this;
    var criteria = new Object();
    criteria._entity = 'com.sie.crm.pub.dataset.deliveryEntity.CrmLgDeliveryHeaderV';

    var expr = new Array();
    var expr1 = new Object();
    expr1.realConfirmDate = that.data.date + ' 00:00:00';
    expr1._op = ">=";
    expr.push(expr1);

    if (null != endDate && '' != endDate) {
      var expr2 = new Object();
      expr2.realConfirmDate = endDate + ' 23:59:59';
      expr2._op = "<=";
      expr.push(expr2);
    }
    criteria._expr = expr;

    var page = new Object();
    page.isCount = true;
    page.length = 500;

		var orderby = new Object();
		var orderbyArr = new Array();
		orderby._sort = "";
		orderby._property = "realConfirmDate";
		orderbyArr.push(orderby);
    criteria._orderby = orderbyArr;

    common.httpP('com.sie.crm.pub.util.pubDatas.queryDataObjectsWithPage.biz.ext', {
      criteria: criteria,
      page: page
		}, function (data) {
			if (null != data.page && 0 != data.page.size) {
        wx.hideLoading();

        that.setData({
          deliverys: data.dataobjs
        });
			} else {
				wx.showModal({
					title: '当前没有发货单数据',
					image: '../../../../img/fail.jpg'
				})
			}
		});
  },

  // 按实际发货日期段查询
  bindSearchData () {
    var that = this;
    that.getOrders(that.data.date2);
  },

  getDelivery: function(e) {
    var data = e.currentTarget.dataset;
    var deliveryHeadId = data.id.split('@')[0];
    var deliveryCode = data.id.split('@')[1];

    let pages = getCurrentPages();//获取所有页面
    let prevPage = null;          //上一个页面

    if (pages.length >= 2) {
      prevPage = pages[pages.length - 2]; //获取上一个页面，将其赋值
    }
    if (prevPage) {
      prevPage.setData({
        deliveryHeadId: deliveryHeadId,
        deliveryCode: deliveryCode
      })
      wx: wx.navigateBack({     //返回上一个页面
        delta: 1,
      })
    }
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