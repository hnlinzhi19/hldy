var Global =require('Global');
var ChuganBg = require('ChuganBg');

cc.Class({
    extends: cc.Component,

    properties: {
        yuganBg: {
            default: null,
            type:cc.Node
        },
        yuerList: {
            default: [],
            type: [cc.Node]
        },
        fishList: {
            default: [],
            type: [cc.Node]
        }
    },

    // use this for initialization
    onLoad: function () {
        var self = this
        // var anim = this.getComponent(cc.Animation);
        // console.log(this.node.children[1]);
        // this.addYuer();
        var fishListPos = this.node.getChildByName('FishList').getPosition();
        var nodePos = this.node.getPosition();
        Global.getedFishListPos.push({
            x: fishListPos.x + nodePos.x,
            y: fishListPos.y + nodePos.y
        });

        this.node.on('addFish', function (event) {
            var fishData = event.detail;
            var s = cc.pSub(cc.v2(fishData.node.x,fishData.node.y), cc.v2(self.node.x,self.node.y));
            cc.log(s);
            var test = cc.pSub(cc.v2(s.x,s.y), cc.v2(fishListPos.x,fishListPos.y));
            cc.log(test);
            
            var node =  cc.instantiate(self.fishList[fishData.id]);
            node.parent = self.node.getChildByName('FishList');
        });
    },
    chugan: function () {
        var self = this;
        var anim = this.getComponent(cc.Animation);
        var yuganBg = this.yuganBg.getComponent('ChuganBg');
        
        if (Global.isChuganIngAnimation) {
            return;
        }
        Global.isChuganIngAnimation = true;       
        anim.play('Yugan');
        yuganBg.chugan();

        this.yuganBg.on('lastframe', function () {
            console.log('est');
        });
        // ChuganBg.get
        // var yugan = self.yugan.getComponent('DiaoyuAction');
        
        // setTimeout(function() {
        //     self.shougan();
        // }, 6000);
        // 模拟异步请求
        setTimeout(function() {
            Global.isAjaxGeted = true;
            Global.targetFishList = [1];
            Global.saveFishList = [1];
        }, 400);
    },
    shougan: function() {
        var anim = this.getComponent(cc.Animation);
        anim.play('Shougan');
    },
    // 出杆完成回调
    chuganCb: function () {
        Global.isChuganIng = true;      
    },
    // 收杆完成回调
    shouganCb: function() {

    },
    // 添加鱼儿
    addYuer:function () {
        var node = cc.instantiate(this.yuerList[0]);
        node.parent = this.node.children[1];
        node.setPosition(0, 0);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
