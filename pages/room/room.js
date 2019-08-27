const iconUtil = require('../../utils/icon_util.js');
Page({
  data: {
    roomList: ['Room1', 'Room2', 'Room3'],
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    swiper_height: 0,
    isIndex:0
  },
  onLoad: function () {
    this.autoHeight();
  },
  changeNavBar: function (e) {
    this.setData({
      isIndex: e.detail
    });
  },
  swiperChange: function (e) {
    this.setData({
      isIndex: e.detail.current
    });
    this.autoHeight();
  },
  autoHeight() {
    let {
      isIndex
    } = this.data;
      wx.createSelectorQuery()
        .select('#end' + isIndex).boundingClientRect()
        .select('#start' + isIndex).boundingClientRect().exec(rect => {
          let _space = rect[0].top - rect[1].top;
          _space =  _space + 'px';
          this.setData({
            swiper_height: _space
          });
        })
  }
})
