const common = require('../../../../utils/util.js');
const userName = wx.getStorageSync('userName');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: wx.getSystemInfoSync().windowHeight,
    currentTab: 0,
    uhide: 0,
    inspectionList: [],
    visual: false,
    animation: '',
    allList: [],
    compList: [],
    notCompList: []
  },

  goTop() {
    this.setData({
      scrollTop: 0
    })
  },
  scroll(e) {
    console.log();
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

  //页签切换
  switchNav(e) {
    var that = this;
    var tab = e.target.dataset.current;
    if (that.data.currentTab === tab) {
      return false
    } else {
      that.setData({
        currentTab: tab
      })
    }

    if (0 == tab) {
      that.setData({
        inspectionList: that.data.allList
      })
    } else if (1 == tab) {
      that.setData({
        inspectionList: that.data.compList
      })
    } else if (2 == tab) {
      that.setData({
        inspectionList: that.data.notCompList
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPlanDetail();
  },

	//根据日期、登录人，获取该设备的巡检计划
	getPlanDetail: function () {
    wx.showLoading({
			title: '数据正在请求中',
			mask: true
		})
    var that = this;
		var criteria = new Object();
    criteria._entity = 'com.md.ims.mdso.inspection.CrmInspectionInfo';

    // var expr = new Array();
    // var expr1 = new Object();
    // expr1.inspectionCode = userName;
    // expr1._op = "=";
    // expr.push(expr1);
    // criteria._expr = expr;

		var orderby = new Object();
		var orderbyArr = new Array();
		orderby._sort = "desc";
		orderby._property = "inspectionInfoId";
		orderbyArr.push(orderby);
    criteria._orderby = orderbyArr;

    common.httpP('com.md.ims.mdso.crmsoordertipbiz.getCrmInspectionInfo.biz.ext', {
      criteria: criteria,
      pageSize: 5000
		}, function (data) {
      var crmInspectionInfo = data.data;
			if (0 != crmInspectionInfo.length) {
        wx.hideLoading();
        that.setData({
          allList: crmInspectionInfo
        });

        that.handleData(that.data.allList);
			} else {
				wx.showModal({
					title: '当前没有验货数据',
					image: '../../../../img/fail.jpg'
				})
			}
		});
	},

  handleData: function(allList) {
    var that = this;
    var comp = new Array();
    var notComp = new Array();
    for (var i in allList) {
      var inspectionResult = allList[i].inspectionResult;
      if (0 == inspectionResult) {
        comp.push(allList[i]);
      } else {
        notComp.push(allList[i]);
      }
    }
    that.setData({
      inspectionList: allList,
      compList: comp,
      notCompList: notComp
    })
  },

  //根据设备编码及设备点检部位，获取点检内容信息
  getDetail: function (event) {
    var inspectionInfo = event.currentTarget.dataset.name;
    var inspectionInfoId = inspectionInfo.split('@@')[0];
    var inspectionResult = inspectionInfo.split('@@')[1];

    if (0 != inspectionResult) {
      wx.navigateTo({
        url: '../inspection/inspection?inspectionInfoId=' + inspectionInfoId
      })
    } else {
      wx.showToast({
				title: '验货数据已合格',
				icon: "none"
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