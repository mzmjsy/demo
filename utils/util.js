var app = getApp();
const wxurl = app.globalData.wxUrl;
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function getUserName(){
	var username = wx.getStorageSync('username');
	if (!username) {
		app.register();
		username = wx.getStorageSync('username')
	}
	return username;
}
function httpG(url, data, callback) {
	wx.showLoading({
		title: '努力加载中^^...',
	})
	wx.request({
		url: wxurl+url,
		data: data,
		success: function (res) {
			callback(res.data);
		},
		fail: function (res) {
			console.log('request-get error:', res);
		},
		complete: function (res) {
			wx.hideLoading();
			  console.log("get-complete:", res.data)
			  if (res.data.code && res.data.code != 0) {
				wx.showToast({
					 title: res.data.msg,
				})
			}
		}
	})
}
function httpP(url, data, callback) {
  wx.request({
    url: wxurl + url,
    data: data,
    method: "post",
    success: function (res) {
      if (res.data.code == 0) {
        callback(res.data);
      }
    },
    fail: function (res) {
      console.log('request-post error:', res);
    },
    complete: function (res) {
      console.log("post-complete:", res.data)
      if (res.data.code  && res.data.code != 0) {
        wx.showToast({
           title: res.data.msg,
       })
      }
    }
  })
}

function httpPost(url, data, callback){
  console.log(wxurl + url);
  wx.request({
    url: wxurl + url,
    data: data,
    method: 'POST',
    dataType: 'json',
    header: {
        'content-type': 'application/json'
    },
    success:function(res){
        if (res.statusCode == 200) {
          wx.hideLoading({
            complete(){
              callback(res.data);
            }
          });
        }
    },
    fail: function(res){				
      wx.hideLoading({
        complete(){
          wx.showModal({
            title: '获取失败',
            content: '链接不正确',
            confirmColor: '#b02923',
            showCancel: false
          })
        }
      });
    }
  })
}

module.exports = {
  formatTime: formatTime,
  httpP: httpP,
  httpG: httpG,
  httpPost: httpPost,
  getUserName: getUserName,
  formatNumber: formatNumber
}
