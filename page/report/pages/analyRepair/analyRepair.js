const common = require('../../../../utils/util.js');
const sessionId = wx.getStorageSync('sessionId');
var charts = require('../../../../mars/modules/charts')

Page({
  data: {
    deviceH: 0,
    deviceW: 0,
    pieDatas: [],
    dates: [],
    vmonth: []
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
    _this.getAnalysisRepair();
  },
  
	//获取信息
	getAnalysisRepair: function () {
		var that = this;
		wx.showLoading({
			title: '数据正在请求中',
			mask: true
		})
		var criteria = new Object();
    criteria._entity = 'com.md.djxmZs.djxmZs.AnalysisRepairV';

    common.httpPost('executivesLog/djxmZs/com.md.djxmZs.fzSt.queryAnalysisRepairVs.biz.ext', {
      criteria: criteria,
      sessionId: sessionId
		}, function (data) {
      wx.hideLoading();
      var analysisRepairVs = data.analysisRepairVs;
			if (0 !== Object.keys(analysisRepairVs).length) {
        var months = new Array();
        var datas1 = new Array();
        var datas2 = new Array();

        for (var dt in analysisRepairVs) {
          if ('今年维修' == analysisRepairVs[dt].vname) {
            months.push(analysisRepairVs[dt].vmonth);
            datas1.push(analysisRepairVs[dt].ncount);
          } else {
            datas2.push(analysisRepairVs[dt].ncount);
          }
        }

        var now = new Object();
        now.name = '今年维修';
        now.data = datas1;
        
        var last = new Object();
        last.name = '去年同期';
        last.data = datas2;

        var repairs = new Array();
        repairs.push(now);
        repairs.push(last);

        that.setData({
          pieDatas: repairs,
          vmonth: months
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
    params.width = this.data.deviceW

    params.canvas_id = 'lineGraph'
    params.ytitle = '维修频次统计'
    params.xcate = this.data.vmonth
    params.data = this.data.pieDatas
    charts.shapeLine(params)
  },

  onReady:function(){

  }
})