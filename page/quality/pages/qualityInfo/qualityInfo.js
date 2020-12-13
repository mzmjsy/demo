const common = require('../../../../utils/util.js');
const log = require('../../../../utils/log.js');
const userName = wx.getStorageSync('userName');
const sessionId = wx.getStorageSync('sessionId');
var src_array = []; //上传图片路径数组

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		src: [],
    multiArray: [['管材', '管件', '半成品', '焊接产品'], ['制管', '涡流探伤', '热处理', '瓶口', '压力测试', '表面处理', '喷码', '覆塑', '包装']],
    multiIndex: [0, 0],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		src_array = [];
		this.setData({
			src: []
		})
    this.ctx = wx.createCameraContext();
	},
	
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
		data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['制管', '涡流探伤', '热处理', '瓶口', '压力测试', '表面处理', '喷码', '覆塑', '包装'];
            break;
          case 1:
            data.multiArray[1] = ['切管', '打毛刺', '成型', '弯管', '弯后切', '扩口', '扩口平', '拉鼓', '压力测试', '固熔', '表面处理', '包装'];
            break;
					case 2:
						data.multiArray[1] = ['切管', '打毛刺', '扩碗', '成型', '弯管', '磨口', '冲口', '弯后切', '成型', '烧口', '扩口', '切半接头', '拉口', '扩后平', '拉鼓', '瓶口'];
						break;
					case 3:
						data.multiArray[1] = ['焊接', '压力测试', '固熔', '表面处理', '包装'];
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },

  takePhoto() {
		var that = this;
    wx.showLoading({
			title: '数据请求中',
			mask: true
		})
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
				let tempImagePath = res.tempImagePath
        common.confirmPublish(tempImagePath, function(data){
					src_array.push(common.wxUrl() + 'uploadFile/' + data);
        });

				setTimeout(function() {
					wx.hideLoading();
					that.setData({
						src: src_array
					})
				}, 1000)
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

	//提交点检数据
	formSubmit: function (e) {
		var that = this;
		var data = e.detail.value;

	 	wx.showLoading({
			title: '数据保存中'
	  });

		var list = [];
		for (var key in src_array) {
			var obj = new Object();

			obj.srcUrl = src_array[key];
			obj.productClass = data['productClass'];
			obj.gongBu = data['gongBu'];
			obj.infoName = data['infoName'];
			obj.remark = data['remark'];
			obj.attribute1 = src_array.toString();
			list.push(obj);
		}

		common.httpP('com.md.ims.mdso.quality.addCrmQualityInfo.biz.ext', {
			crmQualityInfo: list,
			sessionId: sessionId
		}, function (data) {
			wx.hideLoading();
			if ("1" == data.code) {
				wx.showToast({
					title: '保存成功',
					icon: 'success'
				})
				src_array = [];
				that.setData({
					src: []
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