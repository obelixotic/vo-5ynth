// var express = require('express')
// var app = express()
// var fs = require("fs");
// app.use(express.static('.'));
//
// app.get('/', function(req, res) {
//   var fileToSend = "index.html";
//   res.sendfile(fileToSend, {
//     root: '.'
//   }); // Files inside "downloads/p5" folder
// });
//
// app.listen(8080, function() {
//   console.log('Example app listening on port 8080!')
// })
//
// app.get('/getfiles', function(req, res) {
//   // res.send('Hello World!');
//   fs.readdir('.', function(err, items) {
//     // console.log(items);
//     res.send(items);
//     // for (var i=0; i<items.length; i++) {
//     //     console.log(items[i]);
//     // }
//   });
// });

//simple four line server
var express = require('express'); // include the express library
var server = express(); // create a server using express
server.use('/', express.static('.')); // serve static files from /public
server.listen(8080); // start the server