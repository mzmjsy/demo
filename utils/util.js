var app = getApp();
const wxurl = app.globalData.wxUrl;
const imsurl = app.globalData.imsUrl;
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

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
    url: imsurl + url,
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

function httpPost(url, data, callback){
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

function unique(arr) {
  if (!Array.isArray(arr)) {
    return
  }
  
  let res = [arr[0]]
  for (let i = 1; i < arr.length; i++) {
    let flag = true
    for (let j = 0; j < res.length; j++) {
      if (arr[i].equipmentCode === res[j].equipmentCode) {
        flag = false;
        break
      }
    }
    if (flag) {
      res.push(arr[i])
    }
  }
  return res
}

function wxUrl() {
  return wxurl;
}

const confirmPublish = (tempImagePath, callback) => {
  wx.uploadFile({
    url: wxurl + 'UploadServlet', //服务器地址
    header: {
      "content-Type": "multipart/form-data"
    },
    filePath: tempImagePath,  //要上传文件资源的路径
    name: "file", //文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
    formData: {
      method: 'POST'
    },
    success: (res) => {
      if (200 == res.statusCode && 'uploadFile:ok' == res.errMsg) {
        let newName = tempImagePath.replace('http://tmp/', '');
        let strLength = res.data.split(newName)[0].length;
        let imgName = res.data.substring(strLength - 15, strLength) + newName;
        callback(imgName);
      }
    },
    fail: (res) => {
      wx.showToast({
        title: '提示',
        content: '上传照相图片失败',
        confirmColor: '#b02923',
        showCancel: false
      })
    }
  })
}

module.exports = {
  formatDate: formatDate,
  formatTime: formatTime,
  httpP: httpP,
  httpG: httpG,
  httpPost: httpPost,
  unique: unique,
  getUserName: getUserName,
  formatNumber: formatNumber,
  wxUrl: wxUrl,
  confirmPublish: confirmPublish,
}
