  
const app = getApp();

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

function getStorageSync(key){
  
  let value = "";
  try {
    
    value = wx.getStorageSync(key);
    
  } catch (e) {
     
     console.error("获取本地缓存数据异常Key:"+key+"  错误信息:"+JSON.stringify(e));

  }
  return value; 
}

function login() {

  console.log("开始进行登录" + app.globalData.webPath);
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      //var url = urlPath + 'appcom/get_login_wxuser.htm';
      console.log("===========login=====" + res.code);
      if (res.code) {

        console.log("code:" + app.globalData.webPath);
        var url = app.globalData.webPath + 'soft_applet/login';
        //发起网络请求
        wx.request({
          url: url,
          data: {
            code: res.code,
            appId: app.globalData.appId
          }, success: function (msg) {
             
              var xcxLoginSession = {};
              
              xcxLoginSession["sessionKey"] = msg.data.data.session_key;
              xcxLoginSession["token"] = msg.data.data.token;
              wx.setStorageSync('xcxLoginSession', xcxLoginSession);
              
          }
        });
      }
    }
  })//登录结束
}



function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}

function post(that, url, param, callbackSuccess, callbackError) {

  if (param == null) {

      param = {};

  }
  
  var modalParam = {
    "type": "loading",
    "isShow": 'show',
    "isCloseBtn": false,
    "imgPath": that.data.imgPath,
    "title": "加载中"
  }
  
  that.setData({
    modalParam: modalParam
  });

  console.log("param ====" + JSON.stringify(getStorageSync("xcxLoginSession")));
  //param['token'] = token;
  var xcxLoginSession = getStorageSync("xcxLoginSession");
  param['token'] = xcxLoginSession.token;
  
  wx.request({
      url: app.globalData.webPath + url,
      method: 'POST',
      data: param,
     // header: {'content-type':'application/x-www-form-urlencoded'},
      success: function (msg) {
      
      console.log("==eee=" + JSON.stringify(msg));

      var data = msg.data;
      if (data.status == 'success') {
          if (callbackSuccess) {
            callbackSuccess(data);
          }
      } else if (data.status == 'xcx_x0000' || data.status == 'xcx_x0001') {

          console.log('未登录，需要弹出登录授权框');
          login();
          var loginModal = that.data.loginModal;
          loginModal['isHidden'] = '';

          that.setData({
            loginModal: loginModal
          });


      } else if (data.status == 'xcx_x0002') {

        // console.log('未认证，跳转至认证页面');
        // wx.navigateTo({
        //   url: '/pages/auth/auth'
        // })

      } else if (data.status == 'xcx_x0003') {   


      } else {
        if (callbackError) {
          callbackError(data);
        }
      }
    }, fail:function(msg){
        var errMsg = msg.errMsg;
        if (errMsg == 'request:fail timeout'){
          
          console.log("==网络请求超时=" + JSON.stringify(msg));
          var modalParam = {
            "type": "dialog",
            "isShow": 'show',
            "imgPath": that.data.imgPath,
            "title": "提示",
            "content": "请求超时，请稍后再试",
            "btnClose": {

              "isShow": true,
              "click": 'clickClose'

            },
            "btnCancel": {
              "text": "关闭",
              "isShow": true,
              "click": 'clickCancel'
            }

          }

          that.setData({
            modalParam: modalParam
          }); 



        }else{
          
          console.log("==发生了其它的错误=" + JSON.stringify(msg));
        }
        
    }
  });

}

function isNull(strValue) {

  var isTrue = false;
  if (strValue == undefined || strValue == null || strValue == '') {
    isTrue = true;
  }

  return isTrue;
}


module.exports = {
  formatTime: formatTime,
  getStorageSync:getStorageSync,
  post: post,
  login:login
}


