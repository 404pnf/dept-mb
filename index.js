var express = require('express'),
    logger = require('morgan'),
    app = express(),
    low = require('lowdb'),
    _ = require('lodash'),
    db = low('db.json'),
    records = db.object,
    multer  = require('multer');

// log requests
app.use(logger('dev'));

// upload file
// https://github.com/expressjs/multer
app.use(multer({
  dest: './mp3/'
  // rename: function (fieldname, filename) {
  //     return filename + '_' + Date.now(); // 防止相同文件名覆盖之前的上传
  //   }
  }));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/mp3'));

// use html as suffix for ejs views
app.engine('.html', require('ejs').__express);

// Without this you would need to
// supply the extension to res.render()
// ex: res.render('users.html').
app.set('view engine', 'html');

// render
app.get('/archive', function(req, res) {
  res.render('archive', {db: records});
});

app.get('/', function(req, res) {
  res.render('add_song');
});


app.post('/', function(req, res) {
  var body = req.body,
    msg = _.assign(body,
      {date: (new Date()).toISOString().slice(0,10)},
      {mp3url: req.files.mp3.name }, // 这个名字是个uuid
      {originalFilename: req.files.mp3.originalname}
    );
  // console.log(req.body)
  // console.log(req.files)
  // console.log(msg);
  records.unshift(msg);
  db.save();
  // console.log(db);
  res.redirect('/archive');
});

if (!module.parent) {
  app.listen(4000, function () {
    console.log("hmm'K port 4000");
  });
}