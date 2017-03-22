var express = require('express');
var app = express();
var bp = require('body-parser');
var fs = require('fs');
var request = require('request');
var gm = require('gm');

app.set('port', (process.env.PORT || 5000));

var jsonParser = bp.json();

var groupId = '29852246';
var appId = '0deae2004936905f42d8f34baf';

function parse(body){
	console.log("Avater URL: ",body.avatar_url);
	return body.avatar_url;
}

function download(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

function upload(filename_,uri){
  	var formData = {
		custom_file: {
			value: fs.createReadStream(filename_),
			options: {
				filename: filename_,
				contentType: 'image/png'
			}
		}
  	};

	var retVal = '';
	request.post({url:uri,formData:formData}, function optionalCallback(err, httpResponse, body) {
  		if (err) {
    		return console.error('upload failed:', err);
  		}
  		console.log('Upload successful!  Server responded with:', body);
  		console.log('Upload successful!  Server responded with:', httpResponse);
		
	});
}

app.post('/', jsonParser, function(request, response) {
	//parse
	var image_url = parse(request.body);
	//download file
	download(image_url,"group_pic.png",function(){console.log('download complete');});
	//distort
	gm("group_pic.png").swirl(20);
	//upload and get url
	upload("group_pic.png","https://image.groupme.com/pictures");
	//post to group
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


