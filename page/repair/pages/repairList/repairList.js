const common = require('../../../../utils/util.js');
const sessionId = wx.getStorageSync('sessionId');
const userName = wx.getStorageSync('userName');
const role = wx.getStorageSync('role');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: wx.getSystemInfoSync().windowHeight,
    currentTab: 0,
    uhide: 0,
    repairFormLists: [],
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
        repairFormLists: that.data.allList
      })
    } else if (1 == tab) {
      that.setData({
        repairFormLists: that.data.compList
      })
    } else if (2 == tab) {
      that.setData({
        repairFormLists: that.data.notCompList
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPlanDetail();
  },

	//查询所有报修单
	getPlanDetail: function () {
    wx.showLoading({
			title: '数据正在请求中',
			mask: true
		})
    var that = this;
		var criteria = new Object();
    criteria._entity = 'com.md.djxmZs.djxmZs.AppCheckRepairV';

    var expr = new Array();
    var expr1 = new Object();
    expr1.checkResult = 'Y';
    expr1._op = "=";
    expr.push(expr1);
    criteria._expr = expr;

    common.httpPost('executivesLog/djxmZs/com.md.djxmZs.appCheckRepairV.queryappCheckRepairVS.biz.ext', {
      criteria: criteria,
      pageSize: 5000,
      sessionId: sessionId
		}, function (data) {
			if (0 != data.total) {
        wx.hideLoading();
        that.setData({
          allList: data.appCheckRepairVs
        });

        that.handleData(that.data.allList);
			} else {
				wx.showModal({
					title: '当前没有巡检计划',
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
      var repairStatus = allList[i].repairStatus;
      if ('Y' == repairStatus) {
        comp.push(allList[i]);
      } else {
        notComp.push(allList[i]);
      }
    }
    that.setData({
      repairFormLists: allList,
      compList: comp,
      notCompList: notComp
    })
  },

  //根据设备编码及设备点检部位，获取点检内容信息
  getDetail: function (event) {
    var names = event.currentTarget.dataset.name.split('@@');
    var value = '?repairFormId='+133+'&equipmentCode='+names[1]+'&attributeType='+names[2]+'&faultDesc='+names[4];
    var currentUrl = event.target.dataset.currenturl;

    if ('' == currentUrl || 'undefined' == typeof(currentUrl)) {
      if (1 == names[3]) {
        wx.navigateTo({
          url: '../repairResult/repairResult' + value
        })
      } else {
        wx.navigateTo({
          url: '../repairAdd/repairAdd' + value
        })
      }
    }
  },
  
  //预览图片
  previewImg: function (e) {
    var currentUrl = e.target.dataset.currenturl;
    var previewUrls = new Array();
    previewUrls.push(currentUrl);

    wx.previewImage({
      current: currentUrl,  //必须是http图片，本地图片无效
      urls: previewUrls,    //必须是http图片，本地图片无效
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