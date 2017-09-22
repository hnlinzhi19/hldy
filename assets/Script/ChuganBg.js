var Global =require('Global');
var DiaoyuAction = require('DiaoyuAction');
cc.Class({
    extends: cc.Component,

    properties: {
        anim: {
            default: null,
            type: cc.Animation
        },
        yugan: {
            default: null,
            type:cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        this.anim = this.getComponent(cc.Animation);
    },
    chugan: function () {
        var self = this;
        
        var state = this.anim.getAnimationState('ChuganBg');
        state.duration = 6;
        this.anim.play('ChuganBg');
    },
    // 背景动画完成回调
    chuganCb: function () {
        // 已获得后端数据 且 保存钓鱼的列表已经被清空  且 后端数据跟上钩数据 一样
        if (Global.isAjaxGeted && Global.saveFishList.length === 0 && Global.targetFishList.length === Global.getedFishLen ) {
            var yugan = this.yugan.getComponent('DiaoyuAction')
            yugan.shougan();
            console.log('开始收杆'); 
            Global.isChuganIng = false;
            Global.isChuganIngAnimation = false;
            Global.isAjaxGeted = false;
            Global.targetFishList = [];
            Global.saveFishList = [];
            Global.currentGetedFish = [];
            Global.getedFishLen = 0;
            Global.getedFishListPos.splice(1,Global.getedFishListPos.length - 1);

        } else {
            // 没钓到鱼 又循环一次
            this.anim.play('ChuganBg');
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
