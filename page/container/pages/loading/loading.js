const common = require('../../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: wx.getSystemInfoSync().windowHeight,
    currentTab: 0,
    uhide: 0,
    visual: false,
    animation: '',
    loadings: [],
    summaryId: '',
    containerSeq: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLoading(options.deliveryHeadId);
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

	//根据发货ID获取分柜信息
	getLoading: function (deliveryHeadId) {
		wx.showLoading({
			title: '数据正在请求中',
			mask: true
		})
    var that = this;
    var criteria = new Object();
    criteria._entity = 'com.sie.crm.pub.dataset.ExportLg.CrmLgContainerSummaryV';

    var expr = new Array();
    var expr1 = new Object();
    expr1.deliveryHeadId = deliveryHeadId;
    expr1._op = "=";
    expr.push(expr1);
    criteria._expr = expr;

    var page = new Object();
    page.isCount = true;
    page.length = 500;

		var orderby = new Object();
		var orderbyArr = new Array();
		orderby._sort = "";
		orderby._property = "containerSeq";
		orderbyArr.push(orderby);
    criteria._orderby = orderbyArr;

    common.httpP('com.sie.crm.pub.util.pubDatas.queryDataObjectsWithPage.biz.ext', {
      criteria: criteria,
      page: page
		}, function (data) {
			if (null != data.page && 0 != data.page.size) {
        wx.hideLoading();

        that.setData({
          loadings: data.dataobjs
        });
			} else {
				wx.showModal({
					title: '当前没有发货单数据',
					image: '../../../../img/fail.jpg'
				})
			}
		});
  },

  getContainerSeq: function(e) {
    var data = e.currentTarget.dataset;
    var summaryId = data.id.split('@')[0];
    var containerSeq = data.id.split('@')[1];

    let pages = getCurrentPages();//获取所有页面
    let prevPage = null;          //上一个页面

    if (pages.length >= 2) {
      prevPage = pages[pages.length - 2]; //获取上一个页面，将其赋值
    }
    if (prevPage) {
      prevPage.setData({
        summaryId: summaryId,
        containerSeq: containerSeq
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