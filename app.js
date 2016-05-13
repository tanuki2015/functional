/**
 * Created by neo on 2016/4/6.
 * 函数式编程 练习代码，参考这篇教程
 * https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch5.html
 */

//第三章 纯函数
//函数是不同数值之间的特殊关系：每一个输入值返回且只返回一个输出值。
var toLowerCase = {"A":"a", "B": "b", "C": "c", "D": "d", "E": "e", "D": "d"};

toLowerCase["C"];
//=> "c"

var isPrime = {1:false, 2: true, 3: true, 4: false, 5: true, 6:false};

isPrime[3];
//=> true

//只要是跟函数外部环境发生的交互就都是副作用(产生bug的温床)
//原则：相同输入得到相同输出

//需要纯函数的理由
//1. 方便缓存：
var squareNumber = _.memoize(function(x){return x*x;});
squareNumber(3);
//9
squareNumber(3);
//9 第二次就不计算，直接取结果

//修改缓存后，证明结果确实被缓存
squareNumber.cache.set(3,6);
squareNumber(3);
// 6

//第四章 curry
//var map = _.curry(function(f, ary) {
//    return ary.map(f);
//});
//var map = Array.prototype.map;
//var children = document.getElementById("orderList");
//var allTheChildren = map.call(children.childNodes,function(node){return node;});
//console.log(allTheChildren);

//var getChildren = function(x) {
//    return x.childNodes;
//};
//var parent = document.getElementById("orderList");
//var allTheChildren = _.map(parent,getChildren);
////
////var allTheChildren = map(getChildren);
////
//console.log(allTheChildren);
//看不明白问什么要用map这个例子

// 练习 1
//==============
// 重构使之成为一个 curry 函数

//var words = function(str) {
//    return split(' ', str);
//};

//var words = _.curry(function(splitChar, str){
//    return str.split(splitChar);
//});
//
//splitC = words("c");
//console.log(splitC("abcdefg"));

// 练习 1a
//==============
// 使用 `map` 创建一个新函数，使之能够操作字符串数组
var toLowerCase = function(str){return str.toLowerCase()};
//var replace = function(reg, char){return char.replace(reg);};
var replace = _.curry(function(reg, char,str){return str.replace(reg,char)});
var replaceBlank = replace((/\s+/ig),"*");
var snakeCase = _.flowRight(replaceBlank, toLowerCase);
console.log(snakeCase("ab cd ef hig"));

//第五章 compose
//有序的组合，从右到左，利用_.flowRight
var head = function(x) { return x[0]; };
var reverse = function(arr){ return _.reverse(arr); };
var last = _.flowRight(head, reverse);

last(['jumpkick', 'roundhouse', 'uppercut']);
//=> 'uppercut'

//多个函数的情况，顺序还是很重要
var toUpperCase = function(str){return str.toUpperCase()};
var lastUpper = _.flowRight(toUpperCase,head, reverse);
//这样调用的话，toUpperCase必须最后，不能打乱
lastUpper((['jumpkick', 'roundhouse', 'uppercut']));
//=> 'uppercut'

//但是组合的顺序可以不同，只需要保证toUpperCae的组合在最后执行
var lastUpper2 = _.flowRight(_.flowRight(toUpperCase,head), reverse);
lastUpper2((['jumpkick', 'roundhouse', 'uppercut']));
//=> "UPPERCUT"

var exclaim = function(str){return str + "!"};
var exclaimLast = _.flowRight(exclaim, toUpperCase, head, reverse);
exclaimLast(['jumpkick', 'roundhouse', 'uppercut']);


// 示例数据
var CARS = [
    {name: "Ferrari FF", horsepower: 660, dollar_value: 700000, in_stock: true},
    {name: "Spyker C12 Zagato", horsepower: 650, dollar_value: 648000, in_stock: false},
    {name: "Jaguar XKR-S", horsepower: 550, dollar_value: 132000, in_stock: false},
    {name: "Audi R8", horsepower: 525, dollar_value: 114200, in_stock: false},
    {name: "Aston Martin One-77", horsepower: 750, dollar_value: 1850000, in_stock: true},
    {name: "Pagani Huayra", horsepower: 700, dollar_value: 1300000, in_stock: false}
];

// 练习 1:
// ============
// 使用 _.compose() 重写下面这个函数。提示：_.prop() 是 curry 函数
var isLastInStock = function(cars) {
    var last_car = _.last(cars);
    return _.prop('in_stock', last_car);
};

var lastOne = function(cars){
    return _.last(cars);
};

var inStock = function(car){
    return _.map(car, _.property("in_stock"));
};

var isLastInstock = _.flowRight(inStock, lastOne);
console.log(isLastInstock(CARS));

//数据是对象，哪有顺序？
//怪不得出这么多问题，原来是需要lodash或者ramda的自动curry才行。

//下面转去ramda。
