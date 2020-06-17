// compenents/etable.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    config : {
      type : Object,
      value :{
        content: {
          type : Array,
          value : []
        },
        titles: {
          type: Array,
          value: []
        },
        columnWidths: {
          type: Array,
          value: []
        },
        border: {
          type: Boolean,
          value: true
        },
        stripe: {
          type: Boolean,
          value: true
        },
        headbgcolor :{
          type : String,
          value : '#ffffff'
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindChange: function(e){
      var data = e.currentTarget.dataset;

      if ('attribute' == data.typ) {
        wx.navigateTo({
          url: '../attributeAdd/attributeAdd?equipmentCode=null&equipmentName=null&attributeType=null&equipment='+JSON.stringify(data.content)
        })
      } else if ('check' == data.typ) {
        var content = data.content;
        if ("Y" == content.isFault) {
          wx.navigateTo({
            url: '/page/repair/pages/repairAdd/repairAdd?checkId='+content.checkId
          })
        } else {
          wx.showToast({
            title: '点检结果无故障，不需修改',
            icon: "none"
          })
        }
      }
    }
  },

  /**
   * 声明周期函数
   */
  pageLifetimes:{
    
  }
})
