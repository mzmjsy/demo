Page({
  data: {
    list: []
  },
  onLoad: function (options) {
    this.listContent(options.roleIds);
  },

  listContent: function (roleIds) {
    var list = new Array();
    var obj = new Object();

    if ('' == roleIds || roleIds.indexOf(581) >= 0 || roleIds.indexOf(582) >= 0 || roleIds.indexOf(583) >= 0) {
      obj = new Object();
      obj.imgUrl = '../../../../img/shebei2.png';
      obj.shortName = '设备点检';
      obj.datetime = '';
      obj.content = '玫德庚辰设备巡检工作录入';
      obj.url = '../catalog/catalog';

      list.push(obj);
    }

    if (roleIds.indexOf(601) >= 0) {
      obj = new Object();
      obj.imgUrl = '../../../../img/Online.png';
      obj.shortName = '产品验货';
      obj.datetime = '';
      obj.content = '玫德集团审核验货管理科验货结果录入';
      obj.url = '../tainerindex/tainerindex?roleId=' + 601;

      list.push(obj);
    }
    
    if (roleIds.indexOf(602) >= 0) {
      obj = new Object();
      obj.imgUrl = '../../../../img/medal.png';
      obj.shortName = '监装拍照';
      obj.datetime = '';
      obj.content = '业务员港口监装分柜信息拍照上传';
      obj.url = '../tainerindex/tainerindex?roleId=' + 602;
      list.push(obj);
    }
    
    if (roleIds.indexOf(603) >= 0) {
      obj = new Object();
      obj.imgUrl = '../../../../img/zhiliang.jpg';
      obj.shortName = '质量资料上传';
      obj.datetime = '';
      obj.content = '流程卡及相关检验资料的照片上传系统';
      obj.url = '../tainerindex/tainerindex?roleId=' + 603;
      list.push(obj);
    }

    this.setData({
      list: list
    })
  },

  //功能跳转
  rowTapped: function(e) {
    var url = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: url,
    })
  }
})