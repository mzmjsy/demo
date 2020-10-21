const common = require('../../../../utils/util.js');

Page({
  data: {
    scrollHeight: wx.getSystemInfoSync().windowHeight,
    currentTab: 0,
    uhide: 0,
    visual: false,
    animation: '',
    crmCtmCustomers: [],
    customerId: '',
    customerShortName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCustomers('');
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
	getCustomers: function (name) {
		wx.showLoading({
			title: '数据正在请求中',
			mask: true
		})
    var that = this;
		var criteria = new Object();
    criteria._entity = 'com.sie.crm.ctm.ctm_md.CrmCtmCustomerV';

    var expr = new Array();
    var expr1 = new Object();
    expr1.doNotFilterOrg = 'Y';
    expr1._op = "=";
    expr.push(expr1);

    var expr2 = new Object();
    expr2.customerFlag = 'W';
    expr2._op = "=";
    expr.push(expr2);

    if (name != null && name != '') {
      var expr3 = new Object();
      expr3.customerShortName = name;
      expr3._op = "like";
      expr.push(expr3);
    }

    criteria._expr = expr;

    var page = new Object();
    page.isCount = true;
    page.length = 100;
    
		var orderby = new Object();
		var orderbyArr = new Array();
		orderby._sort = "desc";
		orderby._property = "creationDate";
		orderbyArr.push(orderby);
    criteria._orderby = orderbyArr;

    var customer = new Object();
		var customers = new Array();
    common.httpP('com.sie.crm.ctm.crmctmcustomerbiz.queryCrmCtmCustomers.biz.ext', {
      criteria: criteria,
      page: page,
      functionType: 'no',
		}, function (data) {
			if (null != data.page && 0 != data.page.size) {
        wx.hideLoading();

        for (var i in data.crmctmcustomers) {
          customer = new Object();
          customer.customerId = data.crmctmcustomers[i]['customerId'];
          customer.customerCode = data.crmctmcustomers[i]['customerCode'];
          customer.customerName = data.crmctmcustomers[i]['customerName'];
          customer.customerShortName = data.crmctmcustomers[i]['customerShortName'];

          customers.push(customer);
        }
        that.setData({
          crmCtmCustomers: customers
        });
			} else {
				wx.showModal({
					title: '当前没有客户数据',
					image: '../../../../img/fail.jpg'
				})
			}
		});
  },

  // 搜索输入完成时触发
  keywords(e) {
    var that = this;
    // 调用接口数据
    that.getCustomers(e.detail.value);
  },

  //单选事件
  radio: function(e){
    var customer = e.currentTarget.dataset.customer;

    this.setData({
      customerId: customer.split("@@")[0],
      customerShortName: customer.split("@@")[1],
    })
  },

  //确定选择
  enter: function (e) {
    let pages = getCurrentPages();//获取所有页面
    let prevPage = null;          //上一个页面
    let customerId = this.data.customerId;
    var customerShortName = this.data.customerShortName;
    if (pages.length >= 2) {
      prevPage = pages[pages.length - 2]; //获取上一个页面，将其赋值
    }
    if (prevPage) {
      if (null == customerId || '' == customerId) {
        wx.showModal({
          title: '提示',
          content: '请选择客户',
          confirmColor: '#b02923',
          showCancel: false
        })
      } else {
        prevPage.setData({         
          customerId: customerId,
          customerShortName: customerShortName
        })
        wx: wx.navigateBack({     //返回上一个页面
          delta: 1,
        })
      }
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