var emmitter = require("events").EventEmitter;
var util = require("util");
function Person(){
	this.say = function(){
		console.log("hello world");
	}
}
util.inherits(Person,emmitter);
var p = new Person();
function listener (){
	console.log("hello world");
}
p.addListener("test",listener);
p.emit("test");
p.emit("test");
p.emit("test");
p.removeListener("test",listener);
console.log("remove listener");
p.emit("test");
function once(){
	console.log("生命只有一次，汪汪汪");
}
function sleep(){
 	console.log("中午要睡觉休息一下");
}


p.once("life",once);
p.once("life",sleep);
p.emit("life");
p.emit("life");

