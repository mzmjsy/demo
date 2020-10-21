const common = require('../../../../utils/util.js');
const sessionId = wx.getStorageSync('sessionId');
Page({
  data: {
    scrollHeight: wx.getSystemInfoSync().windowHeight,
    listData: [],
    title: '',
    factory: '',
    imgUrl: '',
    uhide: 0,
    visual: false,
    animation: ''
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
  
  onLoad: function (options) {
    this.setData({
      title: options.title,
      factory: options.factory,
      imgUrl: common.wxUrl() + 'image/' + "equipment1.jpg"
    });

    this.getAttributes(options.factory, '');
  },

  //根据设备编码，获取该设备点检的属性
	getAttributes: function (factory, equipmentCode) {
    wx.showLoading({
			title: '数据正在请求中',
			mask: true
		})
    var that = this;
		var criteria = new Object();
    criteria._entity = 'com.md.djxmZs.djxmZs.AppPropertiesInfo';

    var expr = new Array();
    var expr1 = new Object();
    expr1.attribute1 = factory;
    expr1._op = "=";
    expr.push(expr1);

    if ('' != equipmentCode) {
      var expr2 = new Object();
      expr2.equipmentCode = equipmentCode;
      expr2._op = "like";
      expr.push(expr2);
    }
    criteria._expr = expr;

		var orderby = new Object();
		var orderbyArr = new Array();
		orderby._sort = "";
		orderby._property = "equipmentCode";
		orderbyArr.push(orderby);
    criteria._orderby = orderbyArr;
    
    common.httpPost('com.md.djxmZs.apppropertiesinfobiz.queryAppPropertiesInfos.biz.ext', {
      criteria: criteria,
      pageSize: 5000,
      sessionId: sessionId
		}, function (data) {
			if (0 != data.total) {
        wx.hideLoading();
        that.setData({
          listData: common.unique(data.apppropertiesinfos)
        });
			} else {
				wx.showModal({
					title: '当前厂区没有该设备',
					image: '../../../../img/fail.jpg'
				})
			}
		});
  },

  //切换隐藏和显示 
  toggleBtn: function (event) {
    var that = this;
    var toggleBtnVal = that.data.uhide;
    var itemId = event.currentTarget.id;
    var name = event.target.dataset.name;

    if ('undefined' == typeof(name)) {
      if (toggleBtnVal == itemId) {
        that.setData({
          uhide: 0
        })
      } else {
        that.setData({
          uhide: itemId
        })
      }
    }
  },

  // 搜索输入完成时触发
  keywords(e) {
    var that = this;
    // 调用接口数据
    that.getAttributes(this.data.factory, e.detail.value);
  },

  //查看明细
  getDetail: function(e) {
    let title = this.data.title;
    var equipmentCode = e.target.dataset.name;

    var url = '';
    if ("attribute" == title) {
      url = "/page/attribute/pages/attributeList/attributeList"
      // url = "/page/attribute/pages/class/classroom"
    } else if("check" == title || "scan" == title) {
      url = "/page/check/pages/checkList/checkList"
    } else if ("repair" == title) {
      url = "/page/repair/pages/repairList/repairList"
    }

    wx.navigateTo({
      url: url + '?equipmentCode=' + equipmentCode + "&title=" + title
    })
  }
})