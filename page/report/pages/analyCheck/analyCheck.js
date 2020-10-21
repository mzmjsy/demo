const common = require('../../../../utils/util.js');
const sessionId = wx.getStorageSync('sessionId');
var charts = require('../../../../mars/modules/charts')

var chartData = {
  main: {
      title: '总成交量',
      data: [15, 20, 45, 37, 23, 56, 79],
      categories: ['15', '16', '17', '18', '19', '20', '21']
  }
};
Page({
  data: {
    deviceH: 0,
    deviceW: 0,
    pieDatas: [],
    xNames: [],
    yCounts: []
  },
  onLoad: function (options) {
    let _this = this

    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          deviceH: res.windowHeight,
          deviceW: res.windowWidth,
        })
      }
    });

    _this.getCheck(options.factory)
  },
  
	//获取信息
	getCheck: function (factory) {
		var that = this;
		wx.showLoading({
			title: '数据正在请求中',
			mask: true
		})
		var criteria = new Object();
    criteria._entity = 'com.md.djxmZs.djxmZs.AnalysisCheckV';

    var expr = new Array();
    var expr1 = new Object();
    expr1.factory = factory;
    expr1._op = "=";
    expr.push(expr1);
    criteria._expr = expr;

    common.httpPost('executivesLog/djxmZs/com.md.djxmZs.fzSt.queryAnalysisCheckVs.biz.ext', {
      criteria: criteria,
      sessionId: sessionId
		}, function (data) {
      wx.hideLoading();
      var analysisCheckVs = data.analysisCheckVs;
			if (0 !== Object.keys(analysisCheckVs).length) {
        var checks = new Array();
        var names = new Array();
        var counts = new Array();
        var obj = new Object();
        for (var dt in analysisCheckVs) {
          obj = new Object();
          obj.name = analysisCheckVs[dt].userName;
          obj.data = analysisCheckVs[dt].ncount;
          checks.push(obj)
          names.push(analysisCheckVs[dt].userName);
          counts.push(analysisCheckVs[dt].ncount);
        }
        that.setData({
          pieDatas: checks,
          xNames: names,
          yCounts: counts
        })
        that.initGraph()
			} else {
				wx.showToast({
					title: '当前没有维修数据',
					icon: "none"
				})
			}
		});
  },
  
  //初始化图表
  initGraph: function () {
    let params = {}
    params.canvas_id = 'pieGraph'
    params.data = this.data.pieDatas;
    params.width = this.data.deviceW
    charts.shapePie(params)

    params.canvas_id = 'columnGraph'
    params.ytitle = '最近七天巡检次数'
    params.xcate = this.data.xNames
    params.data = [{
      name: '次数',
      data: this.data.yCounts
    }]
    charts.shapeColumn(params)
  },

  onReady:function(){
    
  }
})