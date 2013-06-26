var express = require('express')
, http = require('http')
, fs = require('fs')
, path = require('path')
, step = require('step')
, open = require('open')


var app = express();

app.configure(function(){
    app.set('port', 3003);
    app.set('view engine', 'ejs');
    app.set('views', './views');
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static('./www'));
    app.use(express.static('./out'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});

app.post('/revelation', function(req, res) {
    step(
        function () {
            req.body = JSON.parse(req.body.data)
            fs.writeFile('./contents/'+req.body.name+'.ejs', req.body.content, 'utf8', this)
        },
        function (e) {
            if (e) { throw e}
            delete req.body.content
            fs.writeFile('./contents/'+req.body.name+'.json', JSON.stringify(req.body, null, 4), 'utf8', this)
        },
        function (e) {
            if (e) { throw e}
            res.send(200, 'ok')
            process.exit(0)
        }
    )
})

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'))
    open('http://localhost:3003/studio.html?name='+process.argv[2]+'&imgType='+process.argv[3])
})

