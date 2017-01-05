# js函数式编程
前两天在做交通灯的小demo，一个小小的东西却不好调试，关键是修改外部数据导致函数有依赖，还得搞清楚
输入的数据是如何被更改的，这大大增加了认知度，我觉得可能还是函数式编程能部分的解决这个问题，
使得程序的复杂度在可控的范围。

看到这篇文章，决定再学习一下，看能不能把函数式编程用起来。（关键还是我喜欢函数式，本能的就被他吸引）
http://randycoulman.com/blog/2016/05/24/thinking-in-ramda-getting-started/

## 1 getting started
第一篇比较简单，基本概念和 forEach, map, filter, reject, find, reduce的基本用法。

### forEach  返回数组中各项 [1,2,3,4,5]
`R.forEach(item => console.log(item), [1,2,3,4,5])`

### map 数组中各项乘以2
`R.map(x => x * 2, [1,2,3,4,5])`

### filter 找出数组中的偶数
```
R.filter(x => x % 2 ===0, [1,2,3,4,5,6])
// 或者这样
const even = x => x % 2 === 0;
R.filter(even, [1,2,3,4,5]);
```

### reject 与filter条件相反 找出奇数
```
R.reject(x => x % 2 ===0, [1,2,3,4,5,6])
// or...
R.reject(even, [1,2,3,4,5,6]);
```

### find 找第一个符合条件的内容
`R.find(even, [1,2,3,4,5])`

### reduce 归并 累加数组内容 乘积也行
```
R.reduce(R.add, 5, [1,2,3,4])；
R.reduce(R.multiply, 2, [1,2,3,4])
```

## 2 combining functions
第二篇是几个常用的函数组合的方式

### 简单的结合 complement(补集) 从数组中找到一个奇数
```
// 我们已经有了 even
const even = x => x % 2 === 0;
// 利用complement找补集
const odd = R.complement(even);
R.find(odd, [1,2,3,4,5]);
```

### both && either 函数间的 与（&&），或（||）
```
// 找出birthCountry为美国，或有naturalizationDate, 并且age大于18的有投票权的人
const person1 = {
  name: "nicolas",
  birthCountry: "America",
  naturalizationDate: 1212,
  age: 19,
}
const person2 = {
  name: "daqula",
  birthCountry: "china",
  naturalizationDate: null,
  age: 20,
}

const wasBirthInAmerica = person => person.birthCountry == "America";
const wasNaturalized = person => Boolean(person.naturalizationDate);
const isOver18 = person => person.age >= 18;

const isCitizen = R.either(wasBirthInAmerica, wasNaturalized);
const hasVoteRight = R.both(isCitizen, isOver18);

hasVoteRight(person1); // true
hasVoteRight(person2) // false
```

### pipe 按顺序执行多个函数
```
// 两个数先相乘，再加上1，再求这个数的平方
const double = x => x * x;

const operate = pipe(
  R.multiply,
  R.add(1),
  double
  );

operate(2, 3); // 49
```

### compose 顺序同pipe相反
```
const double = x => x * x;
const operate = compose(double, R.add(1), R.multiply);
operate(2, 3); // 49
```