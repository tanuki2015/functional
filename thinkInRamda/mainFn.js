// import R from '../bower_components/ramda/dist/ramda.min.js';
const lis = document.querySelector("#wrapper ul").querySelectorAll("li");
const colors = ["red", "yellow", "green"];
console.log(lis);
console.log(colors);
const turnOn = index => lis[index].setAttribute('class', colors[index]);
const turnOff = index => lis[index].setAttribute('class', 'default');
const next = current => {
  if (current >= 2) {
    return 0;
  }
  current++;
  return current;
};

let curr = 0;
turnOn(curr);
setInterval(() => {
  turnOff(curr);
  curr = next(curr);
  turnOn(curr);
}, 2000);

// 本来想写一个函数式的版本，没想到都是副作用，纪要操作dom，还要有外部变量保存状态，哎...失败！
// 不过好像还是简化了不少，next函数是纯的了，turn on，off函数也只是读写dom，
// 只有一个变量curr记录状态, 貌似有点简化的效果， 以后找机会再试吧。
