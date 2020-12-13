const common = require('../../../../utils/util.js');
const name = wx.getStorageSync('name');
var src_array = [], imgUrlUpload = []; //上传图片路径数组

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
    imgUrl: '',
    src: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ctx = wx.createCameraContext();
  },

  /**
   * 拍照
   */
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
  
  /**
   * 从相册中选择
   */
  choosePhoto: function(){
    var that = this;
    wx.chooseImage({
      count: 9, 
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'],      // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res){
        src_array = src_array.concat(res.tempFilePaths)
        that.setData({
          src: src_array
        })
      }
    })
  },

  //点击小图预览大图
  previewImage: (e) => {
    var index = e.currentTarget.dataset.index;
    wx.previewImage({  
      //当前显示下表   
      current: src_array[index],
      //数据源   
      urls: src_array  
    }) 
  },

  //删除图片
  deleteImg: function(e){
    let that = this;
    let deleteImg = e.currentTarget.dataset.img;
    let pics = that.data.src;
    let newPics = [];
    for (let i = 0; i < pics.length; i++){
      //判断字符串是否相等
      if (pics[i] !== deleteImg){
        newPics.push(pics[i])
      }
    }
    
    that.setData({
      src: newPics,
      isShow: true
    })
    src_array = newPics;
  },

  //上传所选图片
  uploadImg: function() {
    wx.showLoading({
			title: '图片上传中',
			mask: true
    })

    for (var i = 0; i < src_array.length; i++) {
      common.confirmPublish(src_array[i], function(data){
        imgUrlUpload.push(common.wxUrl() + 'uploadFile/' + data);
      });
    }

    setTimeout(() => {
      wx.hideLoading();
    }, 5000);
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
  addContainer: function(dt, urls){
		var that = this;
    wx.showLoading({
			title: '保存中',
			mask: true
    })
console.log(urls)
    var PubAttachment = new Object();
    PubAttachment.docVersion = that.data.deliveryHeadId;
    PubAttachment.moduleName = dt.deliveryCode;
    PubAttachment.documentId = that.data.summaryId;
    PubAttachment.documentNo = dt.containerSeq;
    PubAttachment.uploadDate = that.data.date;
    PubAttachment.remark = dt.remark;
    PubAttachment.savedPath = urls;
    PubAttachment.fileName = name;
    console.log(urls.length)
    console.log(PubAttachment.savedPath)
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
        src_array = [];
        imgUrlUpload = [];
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
    let containerSeq = e.detail.value.containerSeq;

    if (containerSeq == '' || containerSeq == null) {
			wx.showModal({
        title: '提示',
        content: '集装箱顺序号不可为空！',
        confirmColor: '#b02923',
        showCancel: false
      })
      return false;
    } else if (imgUrlUpload.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请先上传图片再保存！',
        confirmColor: '#b02923',
        showCancel: false
      })
      return false;
    }
    var urls = imgUrlUpload.toString();
    this.addContainer(e.detail.value, urls);
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