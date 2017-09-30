var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 9999;
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var vanTaySchema = new Schema({
    id:String,
    hoten: String,
    mssv: String
});
var vanTaySchema2 = new Schema({
    id:String,
    time: String,
    typeTrip: Boolean
});
var danhSach = mongoose.model("DanhSach", vanTaySchema);
var danhSach2 = mongoose.model("DanhSach2", vanTaySchema2);

mongoose.connect("mongodb://root:123@ds147044.mlab.com:47044/vantay");


app.use("/assets", express.static(__dirname + "/publics"));
app.set("view engine", "ejs");
app.get('/', function(req, res) {
    res.render("index");
});


function getTimeStamp() {
	return new Date().getTime() / 1000;
}
function getDay(timeStamp) {
	var date = new Date(timeStamp*1000)
	var day = date.getDate()
	return day
}
function getMonth(timeStamp) {
	var date = new Date(timeStamp*1000)
	var month = date.getMonth() + 1
	return month
}
function getYear(timeStamp) {
	var date = new Date(timeStamp*1000)
	var year = date.getFullYear()
	return year
}
function getHours(timeStamp) {
	var date = new Date(timeStamp*1000)
	var hours = date.getHours()
	return hours;
}
function getMinutes(timeStamp) {
	var date = new Date(timeStamp*1000)
	var minutes = date.getMinutes()
	return minutes;
}
function getSeconds(timeStamp) {
	var date = new Date(timeStamp*1000)
	var seconds = date.getSeconds()	
	return seconds;
}


app.get("/save1/", function(req, res) {
//http://localhost:9999/save1/?id=1&hoten=thong&mssv=1313179
    var currDate = new Date();
    var danhSachs = danhSach({
        id: req.query.id,
        hoten: req.query.hoten,
        mssv: req.query.mssv//currDate.getHours()+":"+currDate.getMinutes()+":"+currDate.getSeconds()
    });
    // //them thiet bi vao
    danhSachs.save(function(err) {
        if (err) res.send("{status:\"ERROR\"}");

        console.log("Da them vao database");
        res.send("{status:\"OK\"}");
    });
});
app.get("/save2/", function(req, res) {
//http://localhost:9999/save2/?id=1&typeTrip=true

	var timeStamp = getTimeStamp()
	
    var danhSachs = danhSach2({
        id: req.query.id,
        time: timeStamp.toString(),//currDate.getHours()+":"+currDate.getMinutes()+":"+currDate.getSeconds()
        typeTrip:req.query.typeTrip // true: vao  false: ra
    });
    // //them thiet bi vao 
    danhSachs.save(function(err) {
        if (err)  res.send("{status:\"ERROR\"}");
        console.log("Da them vao database");
        res.send("{status:\"OK\"}");
    });
});


app.get("/remove1",function(req,res){
  danhSach.remove({}, function(err) {
     if (!err) {
        res.send("{status:\"OK\"}");
     }
        else {
         res.send("{status:\"ERROR\"}");
        }
    });
})
app.get("/remove2",function(req,res){
  danhSach2.remove({}, function(err) {
     if (!err) {
        res.send("{status:\"OK\"}");
     }
        else {
         res.send("{status:\"ERROR\"}");
        }
    });
})

app.get("/allData1",function(req,res){
  danhSach.find({}, function(err, data) {
    var k=[];
    for (var i=0;i<data.length;i++)
    {
      k.push({"id":data[i].id,"hoten":data[i].hoten,"mssv":data[i].mssv});
    }
      res.json(k);
  })
});
app.get("/allData2",function(req,res){
  danhSach2.find({}, function(err, data) {
    var k=[];
    for (var i=0;i<data.length;i++)
    {
		var timeStamp = data[i].time
		var ngay = getDay(timeStamp) +"/"+getMonth(timeStamp)+"/"+getYear(timeStamp)
		var time = getHours(timeStamp)+":"+getMinutes(timeStamp)+":"+getSeconds(timeStamp)
		k.push({"id":data[i].id,"time":time,"date":ngay,"typeTrip":data[i].typeTrip});
    }
      res.json(k);
  })
});

app.get("/getId",function(req,res){
	danhSach2.find({id: req.query.id}, function(err, data) {
    var k=[];
    for (var i=0;i<data.length;i++)
    {
		var timeStamp = data[i].time
		var ngay = getDay(timeStamp) +"/"+getMonth(timeStamp)+"/"+getYear(timeStamp)
		var time = getHours(timeStamp)+":"+getMinutes(timeStamp)+":"+getSeconds(timeStamp)
		k.push({"id":data[i].id,"time":time,"date":ngay,"typeTrip":data[i].typeTrip});
    }
      res.json(k);
  })
})

io.on('connection', function(socket) {
    var username = "";
    console.log('A user connected');

});

http.listen(port, function() {
    console.log('listening on localhost:' + port);
});



// io.on('connection', function(socket) {
//     var username = "";
//     console.log('A user connected');
//     socket.on('setUsername', function(data) {
//         console.log(data);
//         username = data;
//         if (users.indexOf(data) > -1) {
//             socket.emit('userExists', data + ' username is taken! Try some other username.');
//         } else {
//             users.push(data);
//             socket.emit('userSet', {
//                 username: data
//             });
//         }
//     });
//     socket.on('msg', function(data) {
//         //Send message to everyone
//         io.sockets.emit('newmsg', data);
//     })
//     socket.on("disconnect", function() {
//         if (users.indexOf(username) > -1) {
//             users.splice(users.indexOf(username), 1);
//             console.log("disconnect user: " + username);
//         } else {
//             console.log("disconnect");
//         }
//     })
// });
