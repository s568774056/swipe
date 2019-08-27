const app = getApp()
Component({
  properties: {
    data: {
      type: Object,
      value: {},
    },
    key: {
      type: String,
      value: "text"
    },
    isIndex: {
      type: Number,
      value: 0
    }
  }, options: {
    addGlobalClass: true
  },
  methods: {
    getIndex(e) {
      this.setData({
        isIndex: e.currentTarget.dataset.index
      });
      this.triggerEvent('onClick', e.currentTarget.dataset.index);
    }
  }, getStr() {
    return ">>>>>>>";
  }
})
