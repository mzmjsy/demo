const dateTimePicker = require('../../../../utils/dateTimePicker.js');
const common = require('../../../../utils/util.js');
const log = require('../../../../utils/log.js');
const userName = wx.getStorageSync('userName');
const sessionId = wx.getStorageSync('sessionId');

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		attribute6: '',
		equipmentcode: '',
		equipmentname: '',
		attributetype: '',
		list: '',
		attributes: '',
		currentDate: '',
		dateTimeArray1: null,
		dateTime1: null,
		startYear: null,
		endYear: null,
		data: '',
		id: '',
		src: '',
		imgUrl: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
		this.setData({
			attribute6: options.attribute1,
			equipmentCode: options.equipmentCode,
			equipmentName: options.equipmentName,
			attributeType: options.attributeType,
			attributes: [],
			dateTimeArray1: obj1.dateTimeArray,
			dateTime1: obj1.dateTime
		});
    this.ctx = wx.createCameraContext();
		this.getAttributes(options);
	},

  takePhoto() {
    var that = this;
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
				let tempImagePath = res.tempImagePath
        that.setData({
          src: tempImagePath
        })
        common.confirmPublish(tempImagePath, function(data){
          that.setData({
            imgUrl: common.wxUrl() + 'uploadFile/' + data
          })
        });
      }
    })
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
	getAttributes: function (options) {
		var that = this;
    wx.showLoading({
			title: '数据请求中',
			mask: true
		})

		var criteria = new Object();
		criteria._entity = 'com.md.djxmZs.djxmZs.AppPropertiesInfo';
    var expr = new Array();
		var expr1 = new Object();
		expr1.equipmentCode = options.equipmentCode;
		expr1._op = "=";
		expr.push(expr1);
		var expr2 = new Object();
		expr2.attributeType = options.attributeType;
		expr2._op = "=";
		expr.push(expr2);
		criteria._expr = expr;
		common.httpPost('executivesLog/djxmZs/com.md.djxmZs.apppropertiesinfobiz.queryAppPropertiesInfos.biz.ext', {
			criteria: criteria,
      pageSize: 20,
			sessionId: sessionId
		}, function (data) {
			wx.hideLoading();
			that.setData({
				attributes: data.apppropertiesinfos
			});
		});
	},

	//提交点检数据
	formSubmit: function (e) {
		var that = this;
		var data = e.detail.value;

		if (null == userName || '' == userName) {
			wx.showModal({
				title: '提示',
				content: '用户名缓存失效，请重新登录',
				showCancel: false
			})

			return;
		}

	 	wx.showLoading({
			title: '数据保存中'
	  });

		var list = [];
		var str = '';
		for (var key in data) {
			if (key.indexOf('atrributes') >= 0) {
				var obj = new Object();
				var id = Number(key.match(/\d/g).join(''));
				var value = data[key].toString();

				obj.attributeId = id;
				obj.attribute2 = data['equipmentCode'];
				obj.attribute3 = data['equipmentName'];
				obj.attribute4 = data['attributeType'];
				obj.attribute6 = data['attribute6'];					//厂区
				obj.attribute7 = data['faultReason' + id];		//故障原因
				obj.attribute8 = that.data.imgUrl;						//故障图片
				obj.attributeName = data['attributeName' + id];
				obj.checkResult = value;
				obj.attribute1 = data.checkDate;
				obj.isFault = (0 == data['fault' + id].length ? 'N' : data['fault' + id][0]);
				obj.attribute5 = userName;
				list.push(obj);

				if ('' == value) {	
					wx.hideLoading();
					wx.showToast({
						title: '点检结果不可为空',
						icon: "none"
					})
					return false;
				}

				str = '【设备编码：' + data['equipmentCode'] + '，点检部位：' + data['attributeType']
					  + '，点检内容：' + data['attributeName' + id] + '，点检结果：' + value + '】；';
			}
		}
		log.info('点检员：' + userName + '，信息：' + str + '，点检时间：' + data.checkDate);

		common.httpPost('executivesLog/djxmZs/com.md.djxmZs.appcheckentrybiz.addAppCheckEntryArray.biz.ext', {
			appcheckentryArray: list,
			sessionId: sessionId
		}, function (data) {
			wx.hideLoading();
			if ("1" == data.retCode) {
				wx.showToast({
					title: '保存成功',
					icon: 'success',
					success: function() {
						wx.reLaunch({
							url: '../../../catalog/pages/catalog/catalog'
						})
					}
				})
			} else {
				wx.showModal({
					title: '保存失败',
					icon: 'none'
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

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})