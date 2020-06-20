var common = require("../../../../utils/util.js");
const sessionId = wx.getStorageSync('sessionId');
const log = require('../../../../utils/log.js');
const userName = wx.getStorageSync('userName');

Page({
  data:{
    attributeId: '',
    equipmentCode: '',
    equipmentName: '',
		attributeType: '',
		attributeName: '',
    equipmentStandard: '',
    inputType: '',
		options: [{
      id: 'text',
      name: '文字输入'
    }, {
      id: 'radio',
      name: '单项选择'
    }, {
      id: 'number',
      name: '数字输入'
    }],
    selected: {}
  },
  onLoad:function(options){
    var equipment = null == options.equipment ? '' : JSON.parse(options.equipment);
    this.setData({
      attributeId: '' != equipment ? equipment['attributeId'] : '',
      equipmentCode: 'null' == options.equipmentCode ? equipment['equipmentCode'] : options.equipmentCode,
      equipmentName: 'null' == options.equipmentName ? equipment['equipmentName'] : options.equipmentName,
			attributeType: 'null' == options.attributeType ? equipment['attributeType'] : options.attributeType,
			attributeName: '' != equipment ? equipment['attributeName'] : '',
      equipmentStandard: '' != equipment ? equipment['equipmentStandard'] : '',
      inputType: '' != equipment ? equipment['inputType'] : '',
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
    let attributeId = this.data.attributeId;
    let url = (null == attributeId || '' == attributeId) ? '' : '../../';
    
    wx.reLaunch({
      url: url + '../attribute/pages/attributeList/attributeList'
    })
  }
})