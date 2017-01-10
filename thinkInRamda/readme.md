# js函数式编程
前两天在做交通灯的小demo，一个小小的东西却不好调试，关键是修改外部数据导致函数有依赖，还得搞清楚
输入的数据是如何被更改的，这大大增加了认知度，我觉得可能还是函数式编程能部分的解决这个问题，
使得程序的复杂度在可控的范围。

看到这篇文章，决定再学习一下，看能不能把函数式编程用起来。（关键还是我喜欢函数式，本能的就被他吸引）
http://randycoulman.com/blog/2016/05/24/thinking-in-ramda-getting-started/

## 1 getting started
第一篇比较简单，基本概念和 forEach, map, filter, reject, find, reduce的基本用法。

### 关于list类型
list是函数式语言的中一种重要的数据类型，可以参看这篇文章：[《编程机制探析》第十七章 函数式编程](http://buaawhl.iteye.com/blog/1160429)

目前简单的当做array来理解就可以了。

### forEach  
接受两个参数，第一个是函数，第二个是list，返回值是输入的list

例：返回数组中各项 [1,2,3,4,5]
`R.forEach(item => console.log(item), [1,2,3,4,5])`

### map
参数同forEach一样，返回处理后的结果list

例：数组中各项乘以2
`R.map(x => x * 2, [1,2,3,4,5])`

### filter
参数同上， 返回结果为true的list

例：找出数组中的偶数
```
R.filter(x => x % 2 ===0, [1,2,3,4,5,6])
// 或者这样
const even = x => x % 2 === 0;
R.filter(even, [1,2,3,4,5]);
```

### reject
反转filter的筛选条件

例：与filter条件相反 找出奇数
```
R.reject(x => x % 2 ===0, [1,2,3,4,5,6])
// or...
R.reject(even, [1,2,3,4,5,6]);
```

### find
例：找第一个符合条件的内容
`R.find(even, [1,2,3,4,5])`

### reduce 归并
例：累加数组内容 乘积也行
```
R.reduce(R.add, 5, [1,2,3,4])；
R.reduce(R.multiply, 2, [1,2,3,4])
```

## 2 combining functions
第二篇是几个常用的函数组合的方式

### 简单的结合 complement(补集)
例：从数组中找到一个奇数
```
// 我们已经有了 even
const even = x => x % 2 === 0;
// 利用complement找补集
const odd = R.complement(even);
R.find(odd, [1,2,3,4,5]);
```

### both && either 用在函数上的 与（&&），或（||）
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

## 3 partial application
如何应用多个参数， 使用curry就够了， partial和 partialRight省略。
```
// 一个books对象， 找出特定年份出版的书，打印出书名
const book0 = {
  title: "ramda programing",
  year: 2016,
  author: "randy",
};
const book1 = {
  title: "html5 programing",
  year: 2010,
  author: "randy",
};
const books = [book0, book1];
const year = 2016;

// 在特定book对象中找特定年份的，函数返回Boolean
const pYear = R.curry((year, book) => book.year === year);

// 为方便后面操作，把year配置项先curry进函数
const publishedYear = pYear(year);

// 这里有问题，filter被执行了，返回的不是函数，是结果, 明天有时间再改
// 已经搞定，必须curry后，再组合
const filterArr = R.curry(filter(publishedYear));

// 把map的配置项，即处理函数先curry
const mapArr = R.curry(map(book => book.title))

// 组合完函数
const titlesForYear = compose(mapArr, filterArr);

// 一顺溜执行
titlesForYear(books);

// 今天没时间了，明天再整理
```
### 把上面的整理了一下
跟教程不一样，但我觉得这样更容易理解。

#### 关键的地方是：
1. compose中的函数都只有一个参数，或者被curry为一个参数
2. ramda提供的函数都是自动curry，所以filter、map等等都很方便被curry
```
// 一个books对象， 找出特定年份出版的书，打印出书名
const book0 = {
  title: "ramda programing",
  year: 2016,
  author: "randy",
};
const book1 = {
  title: "html5 programing",
  year: 2010,
  author: "randy",
};
const books = [book0, book1];
const year = 2016;

// 在特定book对象中找特定年份的，函数返回Boolean
const isTheYear = R.curry((year, book) => book.year === year);

// 为方便后面操作，把year配置项先curry进函数
const isPublishedYear = isTheYear(year);

// 把处理函数curry进filter，让filter找到特定年份的对象数组
const getYearsArray = filter(isPublishedYear);

// 把处理函数curry进map
const getTitles = map(book => book.title)

// 组合这两个函数
const titlesForYear = compose(getTitles, getYearsArray);

titlesForYear(books);
```
根据函数式可替换的原则，也可以把getTitles和getYears直接代入
`const titlesForYear = compose(map(book => book.title), filter(isPublishedYear));
`
这种不需要中间变量，语义化不好，但直观的表示出这个程序的组成.
1. 需要从数组中挑出特定的内容，用filter(...)。
2. filter需要一个判断是否满足条件的函数，作为filter的第一个参数，于是又有isPublishedYear.
3. isPublishedYear是isTheYear这个函数curry了参数year后的函数。
4. 根据上面上步拿到结果数组后，map出title，就有getTitles.

思路梳理清晰后发现还是比较好理解的，整个过程跟我自己的思路还是很契合的。也就是说，通过这种函数式
的编程，比较容易表达出思考的过程。

### partial partialRight flip placeholder
partial 和 partialRight 用curry代替了，而flip的作用是交换函数的参数位置。
```
// 下面这个参数year在前，book在后
const isTheYear = R.curry((year, book) => book.year === year);
// curry的时候进去的是第一个参数
const isPublishedYear = isTheYear(year);

// 如果写成这样，curry后进去的是book了
// const isTheYear = R.curry((book, year) => book.year === year);
// 这个时候先用下flip
// const isPublishedYear = flip(isTheYear)(year);

// 用placeholder站位(两个下划线)，把这个参数留到最后一个（只能用于curry过的函数）
// 实现上面flip的效果
const isPublishedYear = isTheYear(__, year);
```

第三章结束，原来后面他用的是pipe，而我用的是compose。

## 4 Declarative Programming
直译过来是宣告式编程，其实就是编程的时候说我想做什么，有点像sql语句。
### 函数式中的运算符
简单的说就是用函数来代替命令中的数学：+，-，\*，/；
流程控制：if-then-else ；比较：===, >, <, etc；逻辑运算：&&, ||, !等操作。

### Arithmetic
* add +
* subtract -
* multiply *
* divide /
* inc ++
* dec --

### Comparison
* equals ==
* gt  >
* lt <
* gte >=
* lte <=
* identical ===
```
var o = {};
R.identical(o, o); //=> true
R.identical(1, 1); //=> true
R.identical(1, '1'); //=> false
R.identical([], []); //=> false
R.identical(0, -0); //=> false
R.identical(NaN, NaN); //=> true
```

* isEmpty `str === ''`
* isNil `arr.length === 0`

### logic
应用于函数：
* both  &&
* either ||
* complement !

应用于变量
* and
* or
* not
* defaultTo
```
const settings = {
  lineWidth: null,
}
const lineWidth = defaultTo(80, settings.lineWidth)

// 可以避免下面的参数为零的问题
const lineWidth = settings.lineWidth || 80

// 这样写也是有问题的
const lineWidth = R.or(settings.lineWidth 80);
```

### Conditionals
ifElse 用于函数
```
const forever21 = age => age >= 21 ? 21 : age + 1

// 重写一下，把三元变成函数，再用上ifElse
const age = 1;
const forever21 = ifElse(gte(__, 21), () => 21, inc)
forever21(age);
```
可以看出来ifElse第一个参数是条件，第二个是条件true时的执行函数，第二个是false时。

### Constants
#### 常数  always 本身是一个函数
返回一个函数，这个函数返回给定的参数
```
// 上面的可以改成：
const forever21 = ifElse(gte(__, 21), always(21), inc)
```

#### T(true) F(false)
```
// 可以这样
T() // 返回true
F() // 返回false
```

#### identity
返回输入的值

`const alwaysDriveAge = ifElse(lt(__, 16), always(16), identity)`

#### when unless
如果ifElse中有一个分支是identity, 如上边的例子，则可以用 when， identity成为默认项
`const alwaysDriveAge = when(lt(__, 16), always(16))`

如果第一个分支是identity，则用unless
`const alwaysDriveAge = unless(gt(__, 16), always(16))`

还有一个cond，作为switch用，因为基本没用到，略过。

#### 第四章总结下来，就是函数式的各种运算符，他们运算的对象是函数而已，这是跟普通运算符的区别


## 第五章 Pointfree Style
pointfree 也就是数据作为最后的参数传入，因为以前学过，所以上面我已经提前用了。

总结后还要加入一条：

1. Put the data last
2. Curry all the things

## 第六章 immutability and Objects
prop 用于读取对象中的属性
```
// 下面对象属性的操作是命令式实现，他的问题是两个
// 1.显式操作数据person，不符合pointfree。
// 2.本来想说看起来不清晰，但其实我觉得这种显式的传入person更加清晰，否则还得去想想pointfree隐藏的是啥？
const wasBornInCountry = person => person.birthCountry === OUR_COUNTRY
const wasNaturalized = person => Boolean(person.naturalizationDate)
const isOver18 = person => person.age >= 18

const isCitizen = either(wasBornInCountry, wasNaturalized)
const isEligibleToVote = both(isOver18, isCitizen)

// pointfree样式
const wasBornInCountry = compose(equals(OUR_COUNTRY), prop('birthCountry'))
const wasNaturalized = compose(Boolean, prop('naturalizationDate'))
const isOver18 = compose(gte(__, 18), prop('age'))
```
但是使用prop等一系列的函数式的对象操作的好处，在于immutability,他不会改变原对象，而是会返回一个新拷贝，这有利于保持函数的纯度。

后面的内容已经看完，但感觉最有用的还是curry和compose，能够用到实际中的可能还是函数式的思维方式。

像王垠说的，用任何语言都能写出函数式代码.....

在前端中有很多dom、ajax操作，这都不是纯函数，如果硬要用纯函数来做，反而是麻烦。
倒不如能做纯函数的时候尽量纯函数，IO这类操作就直接命令式，能够利用到着两种编程方式的有点，复杂度可控，
看起来也清晰，用起来也可行，也不用引入ramda类库，在当前的团队中比较容易应用。
