var EventEmitter = require('events').EventEmitter;
var util = require('util');
function Person(name){
    this.name = name;
}
util.inherits(Person,EventEmitter);
/**
 * addListener(event,listener); 增加监听
 * on(event,listener)增加监听
 * once(event,listener) 只监听一次
 * removeListener 解除监听
 * removeAllListeners(event) 解除监听
 * emit(event) 发射事件
 * @type {Person}
 */

var me = new Person();
//
me.addListener('老板找我',function(msg){
    console.log('问问老板有什么事'+msg);
});
me.emit('老板找我','信息的内容');
me.on('微信有新消息了',function(){
    console.log('看看有谁给我发了新消息');
});
me.emit('微信有新消息了');
//
me.once('中午饿了',function(){
    console.log('快吃午饭吧');
});
me.emit('中午饿了');
function eatDinner(){
    console.log('快吃晚饭吧');
}
function eatCookie(){
    console.log('吃点小饼干吧');
}
me.once('晚上饿了',eatDinner);
me.once('晚上饿了',eatCookie);
for(var i=0;i<10;i++)
    me.once('晚上饿了',eatCookie);
//要减肥，晚上不吃东西
//me.removeListener('晚上饿了',eat);
//me.removeAllListeners('晚上饿了');

me.emit('晚上饿了');
console.log(me.listeners('晚上饿了'));
//注册的事件数量
console.log(EventEmitter.listenerCount(me,'晚上饿了'));














