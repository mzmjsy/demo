const common = require('../../../../utils/util.js');
const sessionId = wx.getStorageSync('sessionId');

Page({
  data: {
    date: common.formatDate(new Date()),
    date2: common.formatDate(new Date()),
    scrollHeight: wx.getSystemInfoSync().windowHeight,
    currentTab: 0,
    uhide: 0,
    visual: false,
    animation: '',
    equipmentCode: '',
    details: [],
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 此处模拟网络请求
    this.setData({
      equipmentCode: options.equipmentCode,
      type: options.title
    })

    this.getCheckResult(options);
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
    var expr2 = new Object();
    expr2.equipmentCode = equipmentCode;
    expr2._op = "=";
    expr.push(expr2);
    var expr3 = new Object();
    expr3.checkDate = common.formatDate(new Date()) + ' 00:00:00';
    expr3._op = ">=";
    expr.push(expr3);
    var expr4 = new Object();
    expr4.checkDate = common.formatDate(new Date()) + ' 23:59:59';
    expr4._op = "<=";
    expr.push(expr4);
    if ('scan' == options.title) {
      var expr5 = new Object();
      expr5.isFault = 'Y';
      expr5._op = "=";
      expr.push(expr5);
      var expr6 = new Object();
      expr6.isRepair = 'N';
      expr6._op = "=";
      expr.push(expr6);
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
          details: data.appCheckRepairVs
        });
			} else {
				wx.showToast({
					title: '当前没有点检数据',
					icon: "none"
				})
			}
		});
  },
  
  bindSearchData(e) {
    var that = this;
    var type = that.data.type;
    var equipmentCode = that.data.equipmentCode;
    let date = that.data.date;
    let date2 = that.data.date2;
    wx.showLoading({
      title: '数据正在请求中',
      mask: true
    })

    var criteria = new Object();
    criteria._entity = 'com.md.djxmZs.djxmZs.AppCheckRepairV';

    var expr = new Array();
    var expr1 = new Object();
    expr1.checkResult = ' ';
    expr1._op = "<>";
    expr.push(expr1);
    var expr2 = new Object();
    expr2.equipmentCode = equipmentCode;
    expr2._op = "=";
    expr.push(expr2);

    if ("repair" == type) {
      var expr3 = new Object();
      expr3.repairDate = date + ' 00:00:00';
      expr3._op = ">=";
      expr.push(expr3);
      var expr4 = new Object();
      expr4.repairDate = date2 + ' 23:59:59';
      expr4._op = "<=";
      expr.push(expr4);
      var expr5 = new Object();
      expr5.isFault = 'Y';
      expr5._op = "=";
      expr.push(expr5);
    } else {
      var expr3 = new Object();
      expr3.checkDate = date + ' 00:00:00';
      expr3._op = ">=";
      expr.push(expr3);
      var expr4 = new Object();
      expr4.checkDate = date2 + ' 23:59:59';
      expr4._op = "<=";
      expr.push(expr4);

      if ('scan' == type) {
        var expr5 = new Object();
        expr5.isFault = 'Y';
        expr5._op = "=";
        expr.push(expr5);
        var expr6 = new Object();
        expr6.isRepair = 'N';
        expr6._op = "=";
        expr.push(expr6);
      }
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
          details: data.appCheckRepairVs
        });
			} else {
				wx.showToast({
					title: '当前没有点检数据',
					icon: "none"
				})
			}
		});
  },

  //根据设备编码及设备点检部位，获取点检内容信息
  getDetail: function (event) {
    var names = event.currentTarget.dataset.name.split('@@');
    var checkId = names[0];
    var isFault = names[1];
    var isRepair = names[2];

    if ("Y" == isFault && 'Y' != isRepair) {
      wx.navigateTo({
        url: '/page/repair/pages/repairAdd/repairAdd?checkId='+checkId
      })
    } else if ("N" == isFault) {
      wx.showToast({
        title: '点检结果无故障，不需修改',
        icon: "none"
      })
    } else if ("Y" == isFault && 'Y' == isRepair) {
      wx.showToast({
        title: '设备有故障但已维修，不需维修',
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