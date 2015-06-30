var fs = require("fs");
var url = "../file/test.txt";
fs.readFile(url,"utf-8",function(err,data){
	console.log(data);	
});

fs.writeFile(url,"data da da dad ad a da","utf-8",function(err){
	console.log("录入完毕");	
});

	


