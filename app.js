var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 9999;
var mongoose = require("mongoose");
var bodyParser=require("body-parser")
var urlencodedParser=bodyParser.urlencoded({extended:false})

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
    thu:String,
    datestart:String,
    dateend:String
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
var listDiemDanh = new Schema({
	id:String,
	hoten:String,
	tenmonhoc:String,
	time:String,
	date:String,
	thu:String
})
var account = mongoose.model("Account",accountSchema);
var danhSach = mongoose.model("DanhSach", vanTaySchema);
var danhSach2 = mongoose.model("DanhSach2", vanTaySchema2);
var monhoc = mongoose.model("MonHoc",monHocSchema);
var dangKyMon = mongoose.model("DangKyMonHoc",dangKyMonHoc);
var diemDanh = mongoose.model("listDiemDanh",listDiemDanh);

mongoose.connect("mongodb://root:123@ds147044.mlab.com:47044/vantay");


app.set("view engine", "ejs");
app.set("views","./views");
app.use(express.static("public"));





app.post("/trangchu",urlencodedParser,function(req,res){
  console.log(req.body.username)
  account.find({username:req.body.username}, function(err, data) {
    if (err) res.send('{\"status\":\"ERROR\"}')
    var k=[];
    for (var i=0;i<data.length;i++)
    {
      k.push({username:data[i].username,password:data[i].password});
    }
    if (k.length == 0) {
      res.send('{\"status\":\"ERROR\"}')
    } else {
      if (req.body.password != data[0].password) {
        res.render('signIn',{check:1})
      } else {
        res.render('trangchu',{username:req.body.username})
      }
    }
  })
})
//  /fakeDataDiemDanh?id=1&hoten=Thong&tenmonhoc=Hoa&time=12:20&date=14/9/1995&thu=Mon
app.get('/fakeDataDiemDanh',function(req,res) {
	var diemDanh1 = diemDanh({
	    	id:req.query.id,
			hoten:req.query.hoten,
			tenmonhoc:req.query.tenmonhoc,
			time:req.query.time,
			date:req.query.date,
			thu:req.query.thu
		});
		diemDanh1.save(function(err) {
		    if (err) {res.send({status:"ERROR"})};
		    res.send({status:'OK'})
		    console.log("Da them vao database");
		});
})
app.get('/dataDiemDanh',function(req,res) {
	  diemDanh.find({}, function(err, data) {
	  	res.json(data)
	  })
})
app.get('/xoaDiemDanh',function(req,res) {
		 	diemDanh.remove({},function(err){
		 		if (!err) {
		 			res.send({status:'OK'})
		 		} else {
		 			res.send({status:'ERROR'})
		 		}
		 	})

})

app.post("/listDiemDanh",urlencodedParser,function(req,res){
  var monHoc = req.body.monHoc
  var k0 = []
  dangKyMon.find({tenmonhoc:monHoc}, function(err, data) {
    if (!err) {
	    for (var i=0;i<data.length;i++)
	    {
	      k0.push({"id":data[i].id,"hoten":data[i].hoten,"tenmmonhoc":data[i].tenmonhoc});
	    }
	    bubbeSort(k0,true)
	    monhoc.find({tenmonhoc:monHoc}, function(err,data) {
			 if (!err) {
			 	if (data.length!=0) {
			 		var k1= []
				 	data.map((value)=>{
				 		k1.push({
				 			tenmonhoc:value.tenmonhoc,
						    timestart: value.timestart,
						    timeend:value.timeend,
						    thu:value.thu,
						    datestart:value.datestart,
						    dateend:value.dateend
				 		})
				 	})
				 	diemDanh.find({tenmonhoc:monHoc}, function(err,data) {
						if (!err) {
							var jsonXuat = []
							k0.map((value1)=> {
								var count = 0
								data.map((value2)=>{
									if (value2.id == value1.id) {
										count ++
									}
								})
								var mangsongay=getCountOf(k1[0].datestart,k1[0].dateend,k1[0].thu)
								console.log(count+" "+mangsongay.length+" "+k1[0].datestart+" "+k1[0].dateend)

								jsonXuat.push({
									percent: (parseFloat(((count *100)/mangsongay.length)).toPrecision(2))+'',
									tenmonhoc:monHoc,
									id:value1.id,
									hoten:value1.hoten
								})
							})
							res.json(jsonXuat)

						} else {
							res.send({status:"ERROR"})
						}
			 		})
			 	} else {
			 		res.send({status:"ERROR"})
			 	}

			 }
		    else {
		     	res.send({status:"ERROR"});
		    }
  		});
	} else {
		res.send({status:'ERROR'})
	}
  })
})


app.get('/check',function(req,res) {
  var ngayStart =req.query.start
  var ngayEnd = req.query.end
  var thu = req.query.thu
  res.json({day:getCountOf(ngayStart,ngayEnd,thu)})
})
function parseDate(input) {
  var parts = input.split('/');
  // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[2], parts[1]-1, parts[0]); // Note: months are 0-based
}

function getCountOf( date1, date2, dayToSearch ){

	var dateObj1 = parseDate(date1);
	var dateObj2 = parseDate(date2);

	var array = [];

	var week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	var dayIndex = week.indexOf( dayToSearch );

	while ( dateObj1.getTime() <= dateObj2.getTime() )
	{
	   if (dateObj1.getDay() == dayIndex )
	   {
		  array.push(dateObj1.getDate()+'/'+(dateObj1.getMonth()+1)+'/'+dateObj1.getFullYear())
	   }

	   dateObj1.setDate(dateObj1.getDate() + 1);
	}

	return array;
}
app.get('/signIn',function(req,res) {
  res.render('signIn',{check:0})
})

app.get('/', function(req, res) {
    res.render("trangchu");
});


function getTimeStamp() {
	var d = new Date();
  var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000*7)) / 1000;
}
function getDayOfWeek(timeStamp) {
  var date = new Date(timeStamp*1000)
  var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var dayOfWeek = days[date.getDay()]
  return dayOfWeek
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
      k.push({"id":data[i].id,"hoten":data[i].hoten,"mssv":data[i].mssv,
      "tenMonHoc":data[i].tenmonhoc,"timeStart":data[i].timestart,
      "timeEnd":data[i].timeend,"thu":data[i].thu,"nghihoc":data[i].nghihoc});
    }
      res.json(k);
  })
});
app.get("/getMonDangKy",function(req,res){
  dangKyMon.find({}, function(err, data) {
    if (err) res.send({status:"ERROR"});
      var k = []
      if (data.length!=0) {
        data.map((value,index) => {
          if (value.id == req.query.id) {
            const item = {
              tenMonHoc:value.tenmonhoc,
              timeStart:value.timestart,
              timeEnd:value.timeend,
              thu:value.thu
            }
            k.push(item)
          }
        })  
      }
      res.json(k);
  })
});


//  /saveJsonDangKyMon/?=[{"id":"2","hoten":"nguyenanhthong","mssv":"1313179","tenMonhoc":"hoa","timeStart":"321312","timeEnd":"312312","thu":"Mon"}]
app.post("/saveJsonDangKyMonSV/",urlencodedParser,function(req,res){
  var jsonObject = JSON.parse(req.body.json)
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
app.post("/deleteSubject/",urlencodedParser,function(req,res){
  monhoc.find({tenmonhoc:req.body.tenmonhoc}, function(err,data) {
   if (!err) {
    monhoc.remove({tenmonhoc:req.body.tenmonhoc},function(err){
      if (!err)
      diemDanh.remove({tenmonhoc:req.body.tenmonhoc},function(err){
        if (!err) {
          dangKyMon.remove({tenmonhoc:req.body.tenmonhoc}, function(err) {
             if (!err) {
                res.send({status:"OK"});
             }
                else {
                 res.send({status:"ERROR"});
                }
            });
        } else {
          res.send({status:'ERROR'})
        }
      })

        else
          res.send({status:"ERROR"})
    })
   }
    else {
      res.send({status:"ERROR"});
    }
    });
})
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
      k.push({"tenMonHoc":data[i].tenmonhoc,"timeStart":data[i].timestart,
      "timeEnd":data[i].timeend,"thu":data[i].thu,
      "dateStart":data[i].datestart,"dateEnd":data[i].dateend});
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
      thu:req.query.thu,
      datestart:req.query.datestart,
      dateend:req.query.dateend
  });
  monHoc2.save(function(err) {
      if (err) res.send({status:"ERROR"});
      console.log("Da them vao database");
      res.send({status:"OK"});
  });
});
app.post("/addMonHoc",urlencodedParser,function(req,res){
	var monHoc2 = monhoc({
      tenmonhoc: req.body.tenmonhoc,
      timestart: req.body.timestart,
      timeend:req.body.timeend,
      thu:req.body.thu,
      datestart:req.body.datestart,
      dateend:req.body.dateend
  });
  monHoc2.save(function(err) {
      if (err) res.send({status:"ERROR"});
      console.log("Da them vao database");
      res.send({status:"OK"});
  });
});
///-----------------------------------------------SIGN UP API

app.post("/dangKy",urlencodedParser,function(req,res){
 var account2 = account({
      username: req.body.username,
      password: req.body.password
  });
 account.find({}, function(err, data) {
    if (err) res.send({status:"ERROR"});
        var flag =false
    data.map((value) => {
      if (value.username == req.body.username) {
        flag = true
        res.send({status:"ERROR"})
      }
    })
    if (flag == false)
    account2.save(function(err) {
      if (err) res.send({status:"ERROR"});
      console.log("Da them vao database");
      res.send({status:"OK"});
    });
  })
})
app.post("/dangNhap",urlencodedParser,function(req,res){
 var account2 = account({
      username: req.body.username,
      password: req.body.password
  });
 account.find({}, function(err, data) {
    if (err) res.send({status:"ERROR"});
    var flag =false
    data.map((value) => {
      if (value.username == req.body.username && value.password == req.body.password) {
        res.send({status:"OK"})
        flag = true
      }
    })
    if (flag == false)
    res.send({status:"ERROR"})
  })
})



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
app.post("/saveSV/",urlencodedParser,function(req,res){
  var currDate = new Date();
  var danhSachs = danhSach({
      id: req.body.id,
      hoten: req.body.hoten,
      mssv: req.body.mssv
  });
  // //them thiet bi vao
  danhSachs.save(function(err) {
      if (err) res.send({status:"ERROR"});

      console.log("Da them vao database");
      res.send({status:"OK"});
  });
})
app.post("/deleteSV/",urlencodedParser,function(req,res){
  danhSach.remove({id:req.body.id}, function(err) {
     if (!err) {
       dangKyMon.remove({id:req.body.id}, function(err) {
          if (!err) {
            danhSach2.remove({id:req.body.id}, function(err) {
               if (!err) {
                 diemDanh.remove({id:req.body.id}, function(err,data) {
                   if (!err) {
                     res.send({status:"OK"});
                   } else {
                     res.send({status:"ERROR"});
                   }
                 })
                }
                else {
                    res.send({status:"ERROR"});
                }
            });
          }
             else {
              res.send({status:"ERROR"});
             }
         });
     }
        else {
         res.send({status:"ERROR"});
        }
    });
})
app.post("/saveTRIP/",urlencodedParser,function(req,res){
  var timeStamp = getTimeStamp()
  
      var danhSachs = danhSach2({
          id: req.body.id,
          time: timeStamp.toString(),//currDate.getHours()+":"+currDate.getMinutes()+":"+currDate.getSeconds()
          typeTrip:req.body.typeTrip // true: vao  false: ra
      });
      // //them thiet bi vao
      danhSachs.save(function(err) {
          if (err)  res.send("{status:\"ERROR\"}");
          console.log("Da them vao database");
          res.send("{status:\"OK\"}");
      });
});
  
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
app.get("/removeListTrip/",function(req,res){
  danhSach2.remove({id:req.query.id}, function(err) {
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
    bubbeSort(k,true)
      res.json(k);
  })
});
app.get("/allData11",function(req,res){
  danhSach.find({}, function(err, data) {
    var k=[];
    for (var i=0;i<data.length;i++)
    {
      k.push({"id":data[i].id,"hoten":data[i].hoten,"mssv":data[i].mssv});
    }
    bubbeSort(k,false)
      res.json(k);
  })
});
function bubbeSort(array,flag) {
    var temp,i,j;
    var swapped = false
    if (flag) {
      for (i=0;i<array.length-1;i++) {
        for (j=0;j<array.length-1-i;j++) {
          if (parseInt(array[j].id)>parseInt(array[j+1].id)) {
            temp = array[j]
            array[j]=array[j+1]
            array[j+1] = temp
            swapped = true
          }
        }
        if (!swapped) {
          break
        }
      }
    } else {
      for (i=0;i<array.length-1;i++) {
        for (j=0;j<array.length-1-i;j++) {
          if (parseInt(array[j].id)<parseInt(array[j+1].id)) {
            temp = array[j]
            array[j]=array[j+1]
            array[j+1] = temp
            swapped = true
          }
        }
        if (!swapped) {
          break
        }
      }
    }
}

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
