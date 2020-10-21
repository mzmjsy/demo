const common = require('../../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: common.formatDate(new Date()),
    date2: common.formatDate(new Date()),
    scrollHeight: wx.getSystemInfoSync().windowHeight,
    currentTab: 0,
    uhide: 0,
    visual: false,
    animation: '',
    orders: [],
    customerId: '',
    orderNum: '',
    saleName: '',
    empName: '',
    checkboxItems: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      customerId: options.customerId
    })
    this.getOrders('','');
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

  bindDateChange(e) {
    let that = this;
    that.setData({
      date: e.detail.value,
    })
  },

  bindDateChange2(e) {
    let that = this;
    that.setData({
      date2: e.detail.value,
    })
  },

	//根据设备编码，获取该设备点检的属性
	getOrders: function (beginDate,endDate) {
		wx.showLoading({
			title: '数据正在请求中',
			mask: true
		})
    var that = this;
		var criteria = new Object();

    var expr = new Array();
    var expr1 = new Object();
    expr1.customerId = that.data.customerId;
    expr1._op = "=";
    expr.push(expr1);

    if (null != beginDate && '' != beginDate) {
      var expr2 = new Object();
      expr2.deliveryDate = beginDate;
      expr2._op = ">=";
      expr.push(expr2);
    }
    
    if (null != endDate && '' != endDate) {
      var expr3 = new Object();
      expr3.deliveryDate = endDate;
      expr3._op = "<=";
      expr.push(expr3);
    }

    var expr4 = new Object();
    expr4.orderTypeId = "1101021";
    expr4._op = "<>";
    expr.push(expr4);

    var expr5 = new Object();
    expr5.deliveryStatus = "已发货";
    expr5._op = "<>";
    expr.push(expr5);
    criteria._expr = expr;

    var page = new Object();
    page.isCount = true;
    page.length = 500;

		var orderby = new Object();
		var orderbyArr = new Array();
		orderby._sort = "";
		orderby._property = "deliveryDate";
		orderbyArr.push(orderby);
    criteria._orderby = orderbyArr;

    var order = new Object();
		var orders = new Array();
    common.httpP('com.md.ims.mdso.order.getOuterOrderList.biz.ext', {
      criteria: criteria,
      page: page
		}, function (data) {
			if (null != data.page && 0 != data.page.size) {
        wx.hideLoading();

        for (var i in data.outerOrderList) {
          var orderList = data.outerOrderList[i];
          order = new Object();
          order.orderNum = orderList['orderNum'];
          order.saleName = orderList['salesAssistantName'];
          order.empName = orderList['empname'];
          order.deliveryDate = orderList['deliveryDate'];

          orders.push(order);
        }
        that.setData({
          orders: orders
        });
			} else {
				wx.showModal({
					title: '当前该客户下没有未发货数据',
					image: '../../../../img/fail.jpg'
				})
			}
		});
  },

  // 按日期段查询
  bindSearchData (e) {
    var that = this;
    // 调用接口数据
    that.getOrders(that.data.date, that.data.date2);
  },

  checkboxChange(e) {
    var checkboxItems = this.data.checkboxItems;
    var values = e.detail.value;
    var orderNum = e.currentTarget.dataset.name.split("@@")[0];
    var saleName = e.currentTarget.dataset.name.split("@@")[1];
    var empName = e.currentTarget.dataset.name.split("@@")[2];

    var items = new Object();
    items.id = orderNum;
    items.saleName = saleName;
    items.empName = empName;
    
    if (values.length != 0) {
      items.check = true;
      checkboxItems.push(items);
      for (var i = 0; i < checkboxItems.length; i++) {
        if (checkboxItems[i].id == orderNum && checkboxItems[i].check == false) {
          checkboxItems[i].check = true;
        }
      }
    } else {
      for (var i = 0; i < checkboxItems.length; i++) {
        if (checkboxItems[i].id == orderNum) {
          checkboxItems[i].check = false;
        }
      }
    }

    this.setData({
      checkboxItems: checkboxItems
    });
  },

  enter: function() {
    var that = this;
    var checkboxItems = that.data.checkboxItems;
    var selected = [];//当前选择到的值
    var orderNum = '';
    var saleName = '';
    var empName = '';

    for(var i = 0; i < checkboxItems.length; i++){
      if (checkboxItems[i].check == true) {
        selected.push(checkboxItems[i]);
      }
    }

    if (!Array.isArray(selected)) {
      return
    }
    
    let res = [selected[0]]
    for (let i = 1; i < selected.length; i++) {
      let flag = true
      for (let j = 0; j < res.length; j++) {
        if (selected[i].id === res[j].id) {
          flag = false;
          break
        }
      }
      if (flag) {
        res.push(selected[i])
      }
    }

    for (let i = 0; i < res.length; i++) {
      orderNum = orderNum + res[i]['id'] + ',';

      if (saleName.indexOf(res[i]['saleName']) < 0) {
        saleName = saleName + res[i]['saleName'] + ',';
      }

      if (empName.indexOf(res[i]['empName']) < 0) {
        empName = empName + res[i]['empName'] + ',';
      }
    }

    let pages = getCurrentPages();//获取所有页面
    let prevPage = null;          //上一个页面

    if (pages.length >= 2) {
      prevPage = pages[pages.length - 2]; //获取上一个页面，将其赋值
    }
    if (prevPage) {
      prevPage.setData({         
        orderNum: orderNum.substring(0, orderNum.length - 1),
        saleName: saleName.substring(0, saleName.length - 1),
        empName: empName.substring(0, empName.length - 1),
      })
      wx: wx.navigateBack({     //返回上一个页面
        delta: 1,
      })
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