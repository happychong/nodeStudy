/**
 * Created by Administrator on 2015/6/27.
 */
 var util = require("util");
function Father(){
    this.name = "father";
    this.age = 36;
    this.say = function(){
    	console.log("hello " + this.name);
    }
}
function Child(){
	Father.call(this);
	this.name = "child";
}
util.inherits(Child,Father);
var c = new Child();
c.say();