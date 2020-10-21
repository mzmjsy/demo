const common = require('../../../../utils/util.js');
const name = wx.getStorageSync('name');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: common.formatDate(new Date()),
    deliveryHeadId: '',
    deliveryCode: '',
    summaryId: '',
    containerSeq: '',
    imgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ctx = wx.createCameraContext();
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
  
  //跳转到订单选择页面
  toDelivery: function () {
    wx.navigateTo({
      url: '/page/container/pages/delivery/delivery'
    })
  },
  
  //跳转到分柜信息页面
  toLoading: function () {
    var deliveryHeadId = this.data.deliveryHeadId;
    if (null != deliveryHeadId && '' != deliveryHeadId) {
      wx.navigateTo({
        url: '/page/container/pages/loading/loading?deliveryHeadId=' + deliveryHeadId
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先选择发货单',
        confirmColor: '#b02923',
        showCancel: false
      })
    }
  },

  //监装日期
  bindDateChange(e) {
    let that = this;
    that.setData({
      date: e.detail.value,
    })
  },

  //保存监装信息
  addContainer:function(dt){
		var that = this;
    wx.showLoading({
			title: '保存中',
			mask: true
    })
    
    var PubAttachment = new Object();
    PubAttachment.docVersion = that.data.deliveryHeadId;
    PubAttachment.moduleName = dt.deliveryCode;
    PubAttachment.documentId = that.data.summaryId;
    PubAttachment.documentNo = dt.containerSeq;
    PubAttachment.uploadDate = that.data.date;
    PubAttachment.remark = dt.remark;
    PubAttachment.savedPath = that.data.imgUrl;
    PubAttachment.fileName = name;

    //提交
		common.httpP('com.sie.crm.pub.baseconfig.pubAttanchment.addPubAttachment.biz.ext', {
      PubAttachment: PubAttachment
		}, function (data) {
			if ("1" == data.code || '1' == data.count) {
      wx.hideLoading();
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
		});
  },
  
  //保存按钮执行
	formSubmit: function(e) {
		let that = this;
    let containerSeq = e.detail.value.containerSeq;
    let imgUrl = that.data.imgUrl;
    if (containerSeq == '' || containerSeq == null) {
			wx.showModal({
        title: '提示',
        content: '集装箱顺序号不可为空！',
        confirmColor: '#b02923',
        showCancel: false
      })
      return false;
    } else if (null == imgUrl || '' == imgUrl) {
      wx.showModal({
        title: '提示',
        content: '照片不可为空！',
        confirmColor: '#b02923',
        showCancel: false
      })
      return false;
    }
		that.addContainer(e.detail.value);
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

    if (currentPage.data.deliveryHeadId) {
      that.setData({
        deliveryHeadId: currentPage.data.deliveryHeadId
      })
    } else if (currentPage.data.summaryId) {
      that.setData({
        summaryId: currentPage.data.summaryId
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