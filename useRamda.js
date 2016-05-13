/**
 * Created by neo on 2016/4/9.
 */
var _ = R;

var toUpperCase = function(str) { return str.toUpperCase(); };
var exclaim = function(str) { return str + '!'; };

var angry = _.compose(exclaim, toUpperCase);

//var latin = _.compose(_.map, angry, _.reverse);

//latin(["frog", "eyes"]);
// error

var latin = _.compose(_.map(angry), _.reverse);

var add = _.curry(function(a,b){return a + b});
var add10 = add(10);

var arr = [1,2,3,4,5,6,7,8,9];
_.reduce(add,0,[1,2,3,4,5,6,7,8,9]);


var Container = function(x) {
    this.__value = x;
}

Container.of = function(x) { return new Container(x); };

// (a -> b) -> Container a -> Container b
Container.prototype.map = function(f){
    return Container.of(f(this.__value))
}

Container.of("bombs").map(_.concat(' away'));

//第八章

var Left = function(x) {
    this.__value = x;
}

Left.of = function(x) {
    return new Left(x);
}

Left.prototype.map = function(f) {
    return this;
}

var Right = function(x) {
    this.__value = x;
}

Right.of = function(x) {
    return new Right(x);
}

Right.prototype.map = function(f) {
    return Right.of(f(this.__value));
}

//  getAge :: Date -> User -> Either(String, Number)
var getAge = _.curry(function(now, user) {
    var birthdate = moment(user.birthdate, 'YYYY-MM-DD');
    if(!birthdate.isValid()) return Left.of("Birth date could not be parsed");
    return Right.of(now.diff(birthdate, 'years'));
});

getAge(moment(), {birthdate: '2005-12-12'});
// Right(9)

getAge(moment(), {birthdate: '123456789'});
// Left("Birth date could not be parsed")

//连接字符串数组
var strArr = ['1','2','3','4','5'];
var concatChar = function(a,b){return a + b};
var arrToStr = _.reduce(concatChar,[]);
arrToStr(strArr);

var minus5 = _.subtract(_.__, 5);
console.log(minus5(17));

var validUsersNamedBuzz = R.filter(R.where({name: 'Buzz', errors: R.isEmpty}))
