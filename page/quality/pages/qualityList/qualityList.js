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
    qualityInfos: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getQualityInfo();
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

	//获取信息
	getQualityInfo: function () {
		wx.showLoading({
			title: '数据正在请求中',
			mask: true
		})
		var that = this;
    var criteria = new Object();
    criteria._entity = 'com.md.ims.mdso.tip.CrmQualityInfoV';

    var expr = new Array();
    var expr1 = new Object();
    expr1.createDate = that.data.date;
    expr1._op = ">=";
    expr.push(expr1);

		var expr2 = new Object();
		expr2.createDate = that.data.date2;
		expr2._op = "<=";
		expr.push(expr2);
    criteria._expr = expr;
    
    var page = new Object();
    page.isCount = true;
    page.length = 50000;

		var orderby = new Object();
		var orderbyArr = new Array();
		orderby._sort = "";
		orderby._property = "qualityInfoId";
		orderbyArr.push(orderby);
    criteria._orderby = orderbyArr;

    common.httpP('com.md.ims.mdso.quality.getCrmQualityInfo.biz.ext', {
      criteria: criteria,
      page: page
		}, function (data) {
			var crmQualityInfos = data.data;

			if (0 != crmQualityInfos.length) {
        for (var key in crmQualityInfos) {
					var srcUrl = crmQualityInfos[key].attribute1.split(',');
					crmQualityInfos[key].srcUrl = srcUrl;
				}
        that.setData({
          qualityInfos: crmQualityInfos
        });
        wx.hideLoading();
			} else {
				wx.showModal({
					title: '当前没有数据',
					image: '../../../../img/fail.jpg'
				})
			}
		});
  },

  // 按上传日期段查询
  bindSearchData () {
    var that = this;
    that.getQualityInfo();
  },

  //点击小图预览大图
	previewImage: (e) => {console.log(e)
    var index = e.currentTarget.dataset.index;
		var urls = e.currentTarget.dataset.url;

    wx.previewImage({  
      //当前显示下表
      current: urls[index],
      //数据源   
      urls: urls 
    }) 
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