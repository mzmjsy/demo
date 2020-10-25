Page({
  /**
   * 页面的初始数据
   */
  data: {
    url1: '',
    url2: '',
    name1: '',
    name2: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var roleId = options.roleId;
    if (601 == roleId) {
      this.setData({
        url1: '/page/inspection/pages/inspectionList/inspectionList',
        url2: '/page/inspection/pages/inspection/inspection?flag=N',
        name1: '验货列表',
        name2: '产品验货'
      })
    } else if (602 == roleId){
      this.setData({
        url1: '/page/container/pages/loadingList/loadingList',
        url2: '/page/container/pages/container/container?flag=N',
        name1: '监装列表',
        name2: '信息录入'
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