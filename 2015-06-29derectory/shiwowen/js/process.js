
function say(){
	console.log("say");
}
process.nextTick(function(){
	console.log("next");
});
say();

process.on("exit",function(){
	console.log("OMG,我死了");
});