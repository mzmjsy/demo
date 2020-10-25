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
    this.getLoadingList('');
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
	getLoadingList: function (endDate) {
		wx.showLoading({
			title: '数据正在请求中',
			mask: true
		})
    var that = this;
    var criteria = new Object();
    criteria._entity = 'com.sie.crm.pub.dataset.pubAttachmentConfig.PubAttachment';

    var expr = new Array();
    var expr1 = new Object();
    expr1.uploadDate = that.data.date;
    expr1._op = ">=";
    expr.push(expr1);

    if (null != endDate && '' != endDate) {
      var expr2 = new Object();
      expr2.uploadDate = endDate;
      expr2._op = "<=";
      expr.push(expr2);
    }

    var expr3 = new Object();
    expr3.savedPath = 'https://www.vapp.meide-casting.com';
    expr3._op = "like";
    expr.push(expr3);
    criteria._expr = expr;

    var page = new Object();
    page.isCount = true;
    page.length = 50000;

		var orderby = new Object();
		var orderbyArr = new Array();
		orderby._sort = "";
		orderby._property = "attachmentId";
		orderbyArr.push(orderby);
    criteria._orderby = orderbyArr;

    common.httpP('com.sie.crm.pub.baseconfig.pubAttanchment.getPubAttachment.biz.ext', {
      criteria: criteria,
      page: page
		}, function (data) {
      var pubAttachment = data.data;
			if (0 != pubAttachment.length) {
        wx.hideLoading();

        that.setData({
          deliverys: data.data
        });
			} else {
				wx.showModal({
					title: '当前没有监装数据',
					image: '../../../../img/fail.jpg'
				})
			}
		});
  },

  // 按实际发货日期段查询
  bindSearchData () {
    var that = this;
    that.getLoadingList(that.data.date2);
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