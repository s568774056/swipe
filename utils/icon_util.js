const app = getApp();

function iconList(that){
  
  var imagePath = app.globalData.imgPath;
  var icon = {};
  let time='?time=2019052802';
  //首页图标
  icon.address_icon = imagePath + 'applet/address_icon.png' + time;
  that.setData({icon:icon});
}

module.exports = {
  iconList: iconList
}