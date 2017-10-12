/**
 * Created by shen on 2017/10/11.
 * 数据监听和依赖收集
 */
var target, content;
class Dep {
    constructor() {
        this.watchs = []
    }
    addWatch() {
        target&&this.watchs.push(target)
    }
    notify() {
        this.watchs.forEach(w=>w.update())
    }
}
function observer(data) {
    if (Object.prototype.toString.call(data) === '[object Object]') {
        Object.keys(data).forEach(key=> {
            var dep = new Dep()
            var val = data[key]
            Object.defineProperty(data, key, {
                enumerable: true,
                configurable: true,
                get: function () {
                    dep.addWatch()
                    console.log(key)
                    return val
                },
                set: function (newVal) {
                    if (val === newVal) {
                        return
                    }
                    val = newVal
                    dep.notify()
                    observer(newVal)
                }
            })
            observer(data[key])
        })
    }
}
class Watch {
    constructor(exp, fn) {
        this.exp = exp
        this.update = fn
        target = this
        typeof exp === 'function' ? exp.call(content) : content[exp]
    }
}
/*
 test
 */
var testData = {
    "title": "海报标题",
    "pics": [
        {"url": "//p0.meituan.net/dprainbow/61daec840616895bc21a4a58cd68a38817000.png", "desc": "幼稚了"},
        {"url": "//p0.meituan.net/dprainbow/61daec840616895bc21a4a58cd68a38817000.png", "desc": "幼稚了"}
    ],
    "shop_info": {
        "shop_id": 9380423,
        "shop_name": "巴黎婚纱国际旗舰店",
        "branch_name": "松江店",
        "city_name": "上海"
    },
    "desc": "这是一段内容一段内容",
    "discount_info": "又回来了",
    "allow_fabulous": false, "$$id": "a0ccdf50-ae2a-11e7-88bc-89a8406df769"
}
content = testData
observer(testData)
new Watch('title',function(){
    console.log("todo update page title!")
})

new Watch('shop_info.shop_name',function(){
    console.log("todo update shop_info.shop_name!")
})

new Watch(function(){
    return this.shop_info.shop_name + "(" + this.shop_info.branch_name + ")"
},function(){
    console.log("todo update desc to dom" )
})
console.log("update title:")
testData.title = "第一次更新"
testData.title = "第二次更新"
console.log("update shop_info：")
testData.shop_info = {
    "shop_id": 1380423,
    "shop_name": "巴黎婚纱国际旗舰店",
    "branch_name": "昌平店",
    "city_name": "北京"
}



