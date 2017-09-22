module.exports = {
    isChuganIng: false, //是否在出杆状态
    isChuganIngAnimation: false, //是否在出杆状态
    targetFishList: [], // 应该上钩到的鱼
    saveFishList: [], //用来做中间变量的鱼列表
    currentGetedFish: [], // 当前已经上钩的鱼
    isAjaxGeted:false, //是否已经 获取到后端数据
    isTuoguan: false, //托管状态
    timesMoney: 100, //每次下注金额
    getedFishListPos: [], //上钩鱼的位置
    getedFishLen: 0 //上钩的鱼 数量
};
