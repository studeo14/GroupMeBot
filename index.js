var express = require('express');
var app = express();
var bp = require('body-parser');
var request = require('request');

app.set('port', (process.env.PORT || 5000));

var jsonParser = bp.json();

var groupId = '29852246';
var appId = '0deae2004936905f42d8f34baf';

var urls = {
	"/steve":"https://i.groupme.com/384x293.png.df1367a456ca4def9613e440433c09d2",
	"/maks":"https://i.groupme.com/720x715.png.333b24832aee4eb597b81a6925423bfa",
	"/mike":"https://i.groupme.com/800x591.png.bdd605d278dc400da2bae52c1dbe51f8",
	"/whatsgood":"https://youtu.be/CNj8It2S8Cs",
	"/what":"https://i.ytimg.com/vi/MHwUQ9TQgbk/maxresdefault.jpg",
	"/norf":"http://boi-1da.net/wp-content/uploads/2015/03/vince-620x400.jpg",
	"/help":"Commands: /steve, /maks, /mike, /whatsgood, /what, /norf, /help",
	"err":"http://s.quickmeme.com/img/a8/a8022006b463b5ed9be5a62f1bdbac43b4f3dbd5c6b3bb44707fe5f5e26635b0.jpg"
};

function parse(body){
	return [body.text,body.name];
}

function send_msg(text){
	var fd = {
		"bot_id": appId,
		"text": text
	};
	request.post({url:"https://api.groupme.com/v3/bots/post",form:fd});
}

app.post('/', jsonParser, function(request, response) {
	//parse
	var text = parse(request.body);
	console.log("Got: ",text);
	if(text[0][0]=='/'){
		if(!urls.hasOwnProperty(text[0])){
			console.log("Bad Command");
			text = "Bad Command";
			send_msg(urls['err']);
		}
		else{
			console.log("Good Command");
			text = urls[text[0]];
			console.log(text);
			send_msg(text);
		}
	}
	response.end();
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


