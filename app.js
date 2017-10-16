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
var accountSchema = new Schema({
    username:String,
    password: String
});
var monHocSchema = new Schema({
    tenmonhoc:String,
    timestart: String,
    timeend:String,
    thu:String
});
var dangKyMonHoc = new Schema({
	id:String,
	hoten:String,
	tenmonhoc:String,
	timestart:String,
	timeend:String,
	thu:String,
	nghihoc:Boolean
})
var account = mongoose.model("Account",accountSchema);
var danhSach = mongoose.model("DanhSach", vanTaySchema);
var danhSach2 = mongoose.model("DanhSach2", vanTaySchema2);
var monhoc = mongoose.model("MonHoc",monHocSchema);
var dangKyMon = mongoose.model("DangKyMonHoc",dangKyMonHoc);

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
//API xoa dang ky mon hoc toan bo co ten mon hoc la 
// /removeDangKyMonHoc/?monHoc=hoa
app.get("/removeDangKyMonHoc/",function(req,res){
	dangKyMon.find({tenmonhoc:req.query.monHoc}, function(err,data) {
	 if (!err) {
	 	dangKyMon.remove({tenmonhoc:req.query.monHoc},function(err){
	 		if (!err)
	    		res.send({status:"OK"});
	    	else 
	    		res.send({status:"ERROR"})
	 	})
	 }
    else {
     	res.send({status:"ERROR"});
    }
    });
});

//Dang ky mon hoc cho sinh vien
app.get("/removeAllDangKyMon",function(req,res){
	dangKyMon.remove({}, function(err) {
     if (!err) {
        res.send({status:"OK"});
     }
        else {
         res.send({status:"ERROR"});
        }
    });
});
app.get("/dangKyMonHoc",function(req,res){
	dangKyMon.find({}, function(err, data) {
    if (err) res.send({status:"ERROR"});
    var k=[];
    for (var i=0;i<data.length;i++)
    {
      k.push({"id":data[i].id,"hoten":data[i].hoten,"mssv":data[i].mssv,"tenMonHoc":data[i].tenmonhoc,"timeStart":data[i].timestart,"timeEnd":data[i].timeend,"thu":data[i].thu,"nghihoc":data[i].nghihoc});
    }
      res.json(k);
  })
});
//  /saveJsonDangKyMon/?=[{"id":"2","hoten":"nguyenanhthong","mssv":"1313179","tenMonhoc":"hoa","timeStart":"321312","timeEnd":"312312","thu":"Mon"}]
app.get("/saveJsonDangKyMon/",function(req,res){
	var jsonObject = JSON.parse(req.query.json)
	jsonObject.map((value,index) => {
		var dangKyMon2 = dangKyMon({
	    	id:value.id,
			hoten:value.hoten,
			mssv:value.mssv,
			tenmonhoc:value.tenMonHoc,
			timestart:value.timeStart,
			timeend:value.timeEnd,
			thu:value.thu,
			nghihoc:false
		});
		dangKyMon2.save(function(err) {
		    if (err) {res.send({status:"ERROR"})};
		    console.log("Da them vao database");
		});
	})
	res.send({status:"OK"});
})
//localhost:9999/saveDangKyMon/?id=1&hoten=nguyenanhthong&mssv=1313179&tenmonhoc=hoa&timestart=1234&timeend=1345&thu=Mon
app.get("/saveDangKyMon/",function(req,res){
	var dangKyMon2 = dangKyMon({
    	id:req.query.id,
		hoten:req.query.hoten,
		mssv:req.query.mssv,
		tenmonhoc:req.query.tenmonhoc,
		timestart:req.query.timestart,
		timeend:req.query.timeend,
		thu:req.query.thu,
		nghihoc:false
  });
  dangKyMon2.save(function(err) {
      if (err) res.send({status:"ERROR"});
      console.log("Da them vao database");
      res.send({status:"OK"});
  });
});


///-----------------------------------------------MON HOC API

//API xoa Mon HOC

app.get("/removeAllMonHoc",function(req,res){
	monhoc.remove({}, function(err) {
     if (!err) {
        res.send({status:"OK"});
     }
        else {
         res.send({status:"ERROR"});
        }
    });
});


//Api Lay mon hoc
app.get("/monHoc",function(req,res){
	monhoc.find({}, function(err, data) {
    if (err) res.send({status:"ERROR"});
    var k=[];
    for (var i=0;i<data.length;i++)
    {
      k.push({"tenMonHoc":data[i].tenmonhoc,"timeStart":data[i].timestart,"timeEnd":data[i].timeend,"thu":data[i].thu});
    }
      res.json(k);
  })
});
//    /saveMonHoc/?tenmonhoc=hoa&timestart=12&timeend=1321&thu=Mon
app.get("/saveMonHoc/",function(req,res){
	var monHoc2 = monhoc({
      tenmonhoc: req.query.tenmonhoc,
      timestart: req.query.timestart,
      timeend:req.query.timeend,
      thu:req.query.thu
  });
  monHoc2.save(function(err) {
      if (err) res.send({status:"ERROR"});
      console.log("Da them vao database");
      res.send({status:"OK"});
  });
});
///-----------------------------------------------SIGN UP API

app.get("/signUp/",function(req,res){
  var account2 = account({
      username: req.query.username,
      password: req.query.password
  });
  account2.save(function(err) {
      if (err) res.send({status:"ERROR"});
      console.log("Da them vao database");
      res.send({status:"OK"});
  });
});

app.get("/account",function(req,res){
  account.find({}, function(err, data) {
    if (err) res.send({status:"ERROR"});
    var k=[];
    for (var i=0;i<data.length;i++)
    {
      k.push({"username":data[i].username,"password":data[i].password});
    }
      res.json(k);
  })
});
app.get("/getUsername/",function(req,res){
  account.find({username:req.query.username}, function(err, data) {
    if (err) res.send({status:"ERROR"});
    var k=[];
    for (var i=0;i<data.length;i++)
    {
      k.push({"username":data[i].username,"password":data[i].password});
    }
      res.json(k);
  })
});
app.get("/removeAccount",function(req,res){
  account.remove({}, function(err) {
     if (!err) {
        res.send({status:"OK"});
     }
        else {
         res.send({status:"ERROR"});
        }
    });
});
///-----------------------------------------------SAVE Danh SACH SV API

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
        if (err) res.send({status:"ERROR"});

        console.log("Da them vao database");
        res.send({status:"OK"});
    });
});
///-----------------------------------------------SAVE Lich su ra vao API

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


app.get("/removeDanhSach",function(req,res){
  danhSach.remove({}, function(err) {
     if (!err) {
        res.send({status:"OK"});
     }
        else {
         res.send({status:"ERROR"});
        }
    });
})
app.get("/removeLichSu",function(req,res){
  danhSach2.remove({}, function(err) {
     if (!err) {
        res.send({status:"OK"});
     }
        else {
         res.send({status:"ERROR"});
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
//Lấy thông tin vào ra theo id
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
//Count vào ra vào từng ngày theo id
app.get("/countId",function(req,res){
	danhSach2.find({id: req.query.id}, function(err, data) {
    var k=[];
    var temp = data
    for (var i=0;i<temp.length;i++)
    {
    	var count = 1;
    	var id = temp[i].id
    	var typeTrip = temp[i].typeTrip
    	var timeStamp = temp[i].time
		var ngay = getDay(timeStamp) +"/"+getMonth(timeStamp)+"/"+getYear(timeStamp)
		var time = getHours(timeStamp)+":"+getMinutes(timeStamp)+":"+getSeconds(timeStamp)
		temp.splice(i,1)
		i--;

    	for (var j = 0; j<temp.length;j++) {
    		var timeStamp2= (temp[j].time)
    		var ngay2 = getDay(timeStamp2) +"/"+getMonth(timeStamp2)+"/"+getYear(timeStamp2)
    		var typeTrip2 = temp[j].typeTrip
    		if (ngay == ngay2 && typeTrip == typeTrip2 && typeTrip == true) {
    			count = count + 1
       			temp.splice(j,1)
       			j--;
    		}
    	}
    	for (var j = 0; j<temp.length;j++) {
    		var timeStamp2= (temp[j].time)
    		var ngay2 = getDay(timeStamp2) +"/"+getMonth(timeStamp2)+"/"+getYear(timeStamp2)
    		var typeTrip2 = temp[j].typeTrip
    		if (ngay == ngay2 && typeTrip == typeTrip2 && typeTrip == false) {
    			count = count + 1
       			temp.splice(j,1)
       			j--;
    		}
    	}
        		console.log(JSON.stringify(temp)+"\n\n")
    	k.push({"id":id,"count":count,"date":ngay,"typeTrip":typeTrip});
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
