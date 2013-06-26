var step = require("step"),
fs = require("fs"), 
_  = require("underscore")
,async = require("async")
,ejs = require('ejs')

function readit(name, cb) {
    step(
        function() {
            fs.readFile('./contents/'+name+'.json', 'utf8', this)
        },
        function(e, json) {
            if (e) { throw e }
            this.obj = JSON.parse(json)
            fs.readFile('./contents/'+name+'.ejs', 'utf8', this)
        },
        function(e, ejs) {
            if (e) { throw e }
            this.obj.name = name
            this.obj.content = ejs
            cb(null, this.obj)
        }
    )
}

function writeit(revelation, cb) {
    revelation.__boxes = JSON.stringify(revelation.__boxes)
    fs.writeFile('./out/'+revelation.name+'.html', ejs.render(revtemplate, revelation), 'utf8', cb)
}

var revtemplate;

step(
    function() {
        fs.readFile('./views/revelation.ejs', 'utf8', this)
    },
    function(e, rev) {
        if (e) { throw e }
        revtemplate = rev
        fs.readdir('./contents', this)
    },
    function(e, names) {
        var that = this
        if (e) { throw e }
        names = _.unique(names.map(function(n) { return n.replace(/(.+)\..+$/, '$1') }))
        console.log(names)
        async.map(names, readit, function(e, revelations) {
            if (e) { throw e }            
            async.each(revelations, writeit, function(e) {
                if (e) { throw e }
                that()
            });
        })
    },
    function(e) {
        if (e) { throw e }
        process.exit(0)
    }
)
    