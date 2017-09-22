var Global = require('Global');
var DiaoyuAction = require('DiaoyuAction');

cc.Class({
    extends: cc.Component,

    properties: {
        fishs: {
            default: [],
            type: [cc.Prefab]
        },
        fishList: {
            default: [],
            type: [cc.Prefab]
        },
        yugan: {
            default: null,
            type: cc.Node
        },
        yuer: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        var yugan = self.yugan.getComponent('DiaoyuAction');
        // yugan.chugan();

        // setTimeout(function() {
        //     yugan.shougan();        
        // }, 3000);

        var fishList = [];
        fishList = fishList.concat([0, 0, 0, 0, 0]);
        fishList = fishList.concat([1, 1, 1, 1]);
        fishList = fishList.concat([2, 2, 2, 2]);
        fishList = fishList.concat([3, 3, 3]);
        fishList = fishList.concat([4, 4, 4]);
        fishList = fishList.concat([5, 5]);
        fishList = fishList.concat([6]);
        for (var i = 0, len = fishList.length; i < len; i++) {
            this.generateFish(fishList[i]);
        }
    },
    generateFish: function (id) {
        var node = cc.instantiate(this.fishs[id]);
        node.parent = this.node;
        this.startMoving(node, id);
    },
    // 产生fish后开始动画
    startMoving: function (node, id) {
        var self = this;
        var randomTop = -Math.random() * 550 ;
        var fishWidth = node.width;
        var randomDirect = parseInt(100 * Math.random());
        var targetX = 0; //大与 50 左边处理
        var sequence = null;
        var action = null;
        var duration = parseInt(Math.random() * 30 + 40);
        var finished = cc.callFunc(function () {
            self.startMovingCb(node, id);
        }, this, 100);
        // randomDirect = 1;
        if (randomDirect > 50) {
            targetX = Math.random() * 450 + 200;
            node.setPosition(-fishWidth - this.node.width/2, randomTop);
        } else {
            targetX = -(Math.random() * 650 + 100);
            node.setPosition(this.node.width/2 + fishWidth, randomTop);
            node.scaleX = -1;
        }

        action = cc.moveBy(duration / 10, cc.p(targetX, 0)).easing(cc.easeBezierAction(0, 0, .28, 1));
        sequence = cc.sequence(action, finished);

        setTimeout(function () {
            node.runAction(sequence);
        }, 5000 * Math.random());
    },
    // 鱼跑走动画
    endMoving: function (node, id) {
        var self = this;
        var action = null;
        var sequence = null;
        var middleAction = null;
        var finished = cc.callFunc(function () {
            // self.endMoving(node);
            node.destroy();
            self.generateFish(id);
        }, this, 100);
        var randomDirect = parseInt(100 * Math.random());
        // 继续沿着左边走
        if (node.scaleX === 1) {
            if (randomDirect > 50) {
                action = cc.moveBy(2, cc.p(this.node.width/2-node.x + node.width, 0)).easing(cc.easeIn(1));
                sequence = cc.sequence(action, finished);
            } else {
                middleAction = cc.scaleBy(0.2, -1, 1);
                action = cc.moveBy(2, cc.p(-node.x - node.width - this.node.width / 2, 0)).easing(cc.easeIn(1));
                sequence = cc.sequence(middleAction, action, finished);
            }
        } else {
            if (randomDirect > 50) {
                middleAction = cc.scaleBy(0.2, -1, 1);
                action = cc.moveBy(2, cc.p(this.node.width/2-node.x + node.width, 0)).easing(cc.easeIn(1));
                sequence = cc.sequence(middleAction, action, finished);
            } else {
                action = cc.moveBy(2, cc.p(-node.width - node.x - this.node.width / 2, 0)).easing(cc.easeIn(1));
                sequence = cc.sequence(action, finished);
            }
        }

        setTimeout(function () {
            node.runAction(sequence);
        }, 1000);
    },
    // 鱼停下来 后判断是否上钩 还是继续游动
    startMovingCb: function (node, id) {
        var self = this;
        var fishListIndex = -1;
        var isGetedShanggouCondition = false; //是否达到上钩条件

        if (Global.isChuganIng && Global.isAjaxGeted) {
            // 不存在 上钩鱼数组里面的 
            var isGetedTarget = (node.scaleX > 0 && node.x < Global.getedFishListPos[0].x ) || (node.scaleX < 0 && node.x > Global.getedFishListPos[0].x);
            fishListIndex = Global.saveFishList.indexOf(id);
            if (fishListIndex < 0) {
                self.endMoving(node, id);
                return false;
            } else if (isGetedTarget) {
                this.shanggouAction(fishListIndex, node, id);
                return false;
            }
            // console.log(this.yuer.x);
            self.endMoving(node, id);
            return false;
        }
        self.endMoving(node, id);
    },
    // 鱼上钩 函数
    shanggouAction: function (fishListIndex, node, id) {
        var self = this;
        var yugan = this.yugan.getComponent('DiaoyuAction');
        var pos = Global.getedFishListPos;
       
        var finished = cc.callFunc(function () {
           Global.getedFishLen += 1;
           self.fishIntoYugan(id, node);
           node.destroy();           
           self.generateFish(id);
        }, this, 100);
        var rotateBody = cc.rotateBy(0.5, -90 * node.scaleX);
        var targetPos = {
            x: pos[pos.length - 1].x ,
            y: pos[pos.length - 1].y - node.height/3*2
        };
        Global.getedFishListPos.push(targetPos);
        var downOrUp = cc.moveTo(0.5, cc.p(targetPos.x, targetPos.y));
        // if (node.x) {

        // }
        Global.saveFishList.splice(fishListIndex, 1);
        Global.currentGetedFish.push(id);
        var sequence = cc.sequence(downOrUp,rotateBody, finished);
        node.runAction(sequence);
    },
    fishIntoYugan: function (id, node) {
        var yugan = this.yugan.getComponent('DiaoyuAction');
        yugan.node.emit('addFish', {
            id: id,
            node: node
        });
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});