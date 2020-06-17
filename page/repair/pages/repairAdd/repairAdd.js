const common = require('../../../../utils/util.js');
var dateTimePicker = require('../../../../utils/dateTimePicker.js');
const userName = wx.getStorageSync('userName');
const sessionId = wx.getStorageSync('sessionId');

Page({
  data: {
		checkEntry: [],
		content: [],
		dateTimeArray1: null,
		dateTime1: null,
		startYear: null,
		endYear: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var that = this;
		var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    this.setData({
      checkEntry: [],
			dateTimeArray1: obj1.dateTimeArray,
			dateTime1: obj1.dateTime
		})
		this.getCheckResult(options.checkId);
  },
	// 选择日期时间
	changeDateTime1(e) {
	  	this.setData({
				dateTime1: e.detail.value
	  	});
	},
	changeDateTimeColumn1(e) {
	  var arr = this.data.dateTime1,
		dateArr = this.data.dateTimeArray1;
  
	  arr[e.detail.column] = e.detail.value;
	  dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
  
		this.setData({
			dateTimeArray1: dateArr,
			dateTime1: arr
		});
	},

	//根据设备编码，获取该设备点检的属性
	getCheckResult: function (checkId) {
		wx.showLoading({
			title: '数据请求中'
	  });
		var that = this;
		var criteria = new Object();

		criteria.checkId = checkId;
		common.httpPost('executivesLog/djxmZs/com.md.djxmZs.appcheckentrybiz.getAppCheckEntry.biz.ext', {
			appcheckentry: criteria,
			sessionId: sessionId
		}, function (data) {
			console.log(data);
			wx.hideLoading();
			that.setData({
				checkEntry: data.appcheckentry
			});
		});
	},

	//提交点检数据
	formSubmit: function (e) {
		var that = this;
		var data = e.detail.value;
    let repairDesc = data.repairDesc;
    if(repairDesc == '' ){
			wx.showToast({
				title: '维修情况不可为空',
				icon: "none"
			})
      return false;
    }

	 	wx.showLoading({
			title: '数据保存中'
	  });
		
		data.isRepair = 'Y';
		data.repairOperator = userName;
    //提交
		common.httpPost('executivesLog/djxmZs/com.md.djxmZs.apprepairentrybiz.addAppRepairEntry.biz.ext', {
			apprepairentry: data,
			sessionId: sessionId
		}, function (data) {
			if ("1" == data.retCode) {
				wx.showToast({
					title: '保存成功',
					icon: 'success',
				})
				that.setData({
					attributeName: '',
					equipmentStandard: ''
				})
			} else {
				wx.showModal({
					title: '保存失败',
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
      url: '/page/check/pages/checkList/checkList'
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