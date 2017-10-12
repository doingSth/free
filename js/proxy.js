/**
 * Created by shen on 2017/10/12.
 */
function observer(data) {
    if (Object.prototype.toString.call(data) === '[object Object]') {
        Object.keys(data).forEach(key=>{
            data[key] = observer(data[key])
        })
        var obj = new Proxy(data, {
            get: function (target, key, receiver) {
                console.log(`getting :`);
                console.log(key);
                return Reflect.get(target, key, receiver);
            },
            set: function (target, key, value, receiver) {
                if (value === target[key]) {
                    return
                }
                console.log(`setting :`)
                console.log(key);
                return Reflect.set(target, key,observer(value), receiver);
            }
        });
        return obj
    }
    return data
}
//test
var testData = {
    "shop_info": {
        "branch_name": "松江店"
    },
    "discount_info": "又回来了"
}

testData=observer(testData)
console.log("update testData.shop_info.branch_name:")
testData.shop_info.branch_name =  "昌平店"
console.log("update testData.shop_info.discount_info:")
testData.shop_info.discount_info = {c:0.9}
console.log("get testData.shop_info.discount_info.c:")
testData.shop_info.discount_info.c

