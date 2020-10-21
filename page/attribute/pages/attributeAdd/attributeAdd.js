var common = require("../../../../utils/util.js");
const sessionId = wx.getStorageSync('sessionId');
const log = require('../../../../utils/log.js');
const userName = wx.getStorageSync('userName');

Page({
  data:{
    equipment: [],
    inputType: 'radio'
  },

  onLoad:function(options){
    this.setData({
      equipment: JSON.parse(options.equipment)
    })
  },

  //输入方式
  radioChange: function(e) {
    var that = this;
    that.setData({
      inputType: e.detail.value
    })
  },

  addAttribute:function(dt){
		var that = this;
    wx.showLoading({
			title: '保存中',
			mask: true
    })
    
    var url = '' == dt['attributeId'] ? 'executivesLog/djxmZs/com.md.djxmZs.apppropertiesinfobiz.addAppPropertiesInfo.biz.ext' : 'executivesLog/djxmZs/com.md.djxmZs.apppropertiesinfobiz.updateAppPropertiesInfo.biz.ext';

    log.info('录入员：' + userName + '，信息：【' + dt + '】，时间：' + common.formatTime(new Date()));
    dt.inputType = that.data.inputType;
    //提交
		common.httpPost(url, {
      apppropertiesinfo: dt,
      sessionId: sessionId
		}, function (data) {
			if ("1" == data.retCode) {
				wx.showToast({
					title: '保存成功',
					icon: 'success',
        })

        var obj = that.data.equipment;
        obj.attributeName = '';
        obj.equipmentStandard = '';
				that.setData({
					equipment: obj
				})
			} else {
				wx.showModal({
					title: '保存失败',
					image: '../../../../img/fail.jpg'
				})
			}
		});
  },
  
	formSubmit: function(e) {
		let that = this;
    let attributeName = e.detail.value.attributeName;
    if(attributeName == '' ){
			wx.showToast({
				title: '点检内容不可为空',
				icon: "none"
			})
      return false;
    }
		that.addAttribute(e.detail.value);
	},
  onReady:function(){
    // 页面渲染完成
    
  },
  onShow:function(){
    // 页面显示
    
  },
  onHide:function(){
    // 页面隐藏
    
  },
  onUnload:function(){

  }
})