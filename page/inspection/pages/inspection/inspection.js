const common = require('../../../../utils/util.js');
const log = require('../../../../utils/log.js');
const userName = wx.getStorageSync('userName');
const name = wx.getStorageSync('name');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inspectionInfoId: '',
    date: common.formatDate(new Date()),
    inspectionCode: userName,
    inspectionName: name,
    customerId: '',
    customerShortName: '',
    orderNum: '',
    saleName: '',
    inspectionResult: 0,
    empCode: '',
    empName: '',
    remark: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let inspectionInfoId = options.inspectionInfoId;

    if ('N' == options.flag) {
      this.setData({
        inspectionInfoId: '',
        customerId: '',
        customerShortName: '',
        orderNum: '',
        saleName: '',
        empName: '',
        inspectionResult: 0,
        remark: ''
      })
    } else {
      this.setData({
        inspectionInfoId: inspectionInfoId
      })
      this.getInspections(inspectionInfoId);
    }
  },
  
  //跳转到客户选择页面
  toCustomer: function () {
    wx.navigateTo({
      url: '/page/inspection/pages/customer/customer'
    })
  },
  
  //跳转到订单选择页面
  toOrder: function () {
    var customerId = this.data.customerId;
    if (null != customerId && '' != customerId) {
      wx.navigateTo({
        url: '/page/inspection/pages/order/order?customerId=' + customerId
      })
    } else {
      wx.showToast({
        title: '请先选择客户',
        icon: 'none'
      })
    }
  },

  //验货日期
  bindDateChange(e) {
    let that = this;
    that.setData({
      date: e.detail.value,
    })
  },

  //验货结论
  radioChange: function(e) {
    var that = this;
    that.setData({
      inspectionResult: e.detail.value
    })
  },

  //根据ID获取明细
  getInspections: function (inspectionInfoId) {
    var that = this;
    wx.showLoading({
			title: '数据获取中',
			mask: true
    })
    
		var criteria = new Object();
    criteria._entity = 'com.md.ims.mdso.inspection.CrmInspectionInfo';

    var expr = new Array();
		var expr1 = new Object();
		expr1.inspectionInfoId = inspectionInfoId;
		expr1._op = "=";
		expr.push(expr1);
		criteria._expr = expr;

		common.httpP('com.md.ims.mdso.crmsoordertipbiz.getCrmInspectionInfo.biz.ext', {
      criteria: criteria
		}, function (data) {
      var CrmInspectionInfo = data.data[0];
      that.setData({
        customerId: CrmInspectionInfo.customerId,
        customerShortName: CrmInspectionInfo.customerShortName,
        orderNum: CrmInspectionInfo.orderNum,
        saleName: CrmInspectionInfo.saleName,
        empName: CrmInspectionInfo.empName,
        inspectionResult: CrmInspectionInfo.inspectionResult,
        remark: CrmInspectionInfo.remark
      })
		});
  },

  //保存验货内容
  addInspection:function(dt){
		var that = this;
    wx.showLoading({
			title: '保存中',
			mask: true
    })
    
    log.info('录入员：' + userName + '，信息：【' + dt + '】，时间：' + common.formatTime(new Date()));

    dt.customerId = that.data.customerId;
    dt.inspectionCode = that.data.inspectionCode;
    dt.inspectionDate = that.data.date;
    dt.inspectionResult = that.data.inspectionResult;

    var url = '' == dt['inspectionInfoId'] ? 'com.md.ims.mdso.crmsoordertipbiz.addCrmInspectionInfo.biz.ext' : 'com.md.ims.mdso.crmsoordertipbiz.updateCrmInspectionInfo.biz.ext';

    var content = "inspection_code='" + dt['inspectionCode'] 
                + "',inspection_name='" + dt['inspectionName']
                + "',inspection_date='" + dt['inspectionDate'] 
                + "',inspection_result=" + dt['inspectionResult'] + ",remark='" + dt['remark'] + "'";

    var insRe = 0 == dt['inspectionResult'] ? '合格' : (1 == dt['inspectionResult'] ? '不合格' : '待定');
    var result = that.data.empCode + '@订单：' + dt['orderNum'] + '\n验货结果：' + insRe + '\n备注：' + dt['remark'];

    //提交
		common.httpP(url, {
      CrmInspectionInfo: dt,
      tableName: 'Crm_Inspection_Info',
      content: content,
      idName: 'Inspection_Info_id',
      idValue: dt['inspectionInfoId']
		}, function (data) {
      that.pushInfo(result);
      setTimeout(() => {
        wx.hideLoading();
        if ("1" == data.code || '1' == data.count) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
          })
        } else {
          wx.showToast({
            title: '保存失败',
            image: '../../../../img/fail.jpg'
          })
        }
      }, 3000);
		});
  },

  //推送消息到业务员
  pushInfo: function(result) {
    common.httpP('com.sie.crm.pub.util.pubDatas.queryDataByNamingSql.biz.ext', {
      orderId: result,
      flag: 'pushInfo'
		}, function (data) {
      log.info('信息自动推送：' + result + '，返回结果' + data.message + '，时间：' + common.formatTime(new Date()));
		});
  },
  
  //保存按钮执行
	formSubmit: function(e) {
		let that = this;
    let inspection = e.detail.value;

    if (inspection.orderNum == '') {
      wx.showToast({
				title: '请先选择订单号',
				icon: "none"
			})
      return false;
    } else if (inspection.result == '' ) {
			wx.showToast({
				title: '验货结论不可为空',
				icon: "none"
			})
      return false;
    }
		that.addInspection(inspection);
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
    var that = this;
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1]; //获取当前页面，将其赋值

    if (currentPage.data.customerId) {
      that.setData({
        customerId: currentPage.data.customerId
      })
    } else if (currentPage.data.orderNum) {
      that.setData({
        orderNum: currentPage.data.orderNum
      })
    } else if (currentPage.data.saleName) {
      that.setData({
        saleName: currentPage.data.saleName
      })
    } else if (currentPage.data.empCode) {
      that.setData({
        empCode: currentPage.data.empCode
      })
    }
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