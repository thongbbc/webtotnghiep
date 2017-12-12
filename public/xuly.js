
class RowData extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			dataSource:[],
			animating:true,
			kindScreen:0,
			dataSourceDanhSachRaVao:[],
			dataSourceListSubject:[],
			dataSourceRegisterSubject:[],
			selectedSubject:'',
			arrayMonHoc: [],
			selectedCheckTrip :0,
			listDetailCount:[],
			listCheck:[]
		}
	}
	componentDidMount() {
		this._loadDashBoard()
	}
	_renderLoading() {
		if (this.state.animating) {
			return  (
				<div style={{position:'absolute',height:'100',width:'100%',backgroundColor:'transparent',textAlign:'center'}}>
					<div>
					<img style={{backgroundColor:'transparent'}}  src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif" />
					</div>
				</div>)
		}
	}
	_loadDashBoard() {
		const self = this
     	axios({
		  method:'get',
		  url:'/allData1',
		  responseType:'jsonp'
		})
		  .then(function(response) {
		  	if (response.status == 200) {
		  		var data = response.data
		  		self.setState({
		  			dataSource:data,
		  			animating:false
		  		})
		  	} else {

		  	}
		});
	}

	_onPressItem(data,index) {
		this.setState({kindScreen:8,selectedCheckTrip:data})
		this._loadDetailCount(data.id)
	}

	_onPressOKAddSV() {
		const id = this.refs.id.value
		const name = this.refs.hoten.value
		const mssv = this.refs.mssv.value
		if (id != '' && name != '' && mssv != '') {
			var params = new URLSearchParams();
			params.append('id', id);
			params.append('hoten', name);
			params.append('mssv', mssv);
			axios.post('/saveSV/',params)
			  .then(response => {
					if (response.data.status == 'OK') {
						alert("ADD SUCCESS")
					} else {
						alert("ADD FAILED")
					}
			  })
			  .catch(error => {
			    console.log(error);
					alert("ADD FAILED")
			  });
		} else {
			alert("PLEASE PRESS FULL INFORMATION")
		}
	}

	_onPressDELETESV(value) {
		const self= this
		var params = new URLSearchParams();
		params.append('id', value.id);
		axios.post('/deleteSV/',params)
		  .then(response => {
				if (response.data.status == 'OK') {
					self._loadDashBoard()
					alert("DELETE SUCCESS")
				} else {
					alert("DELETE FAILED")
				}
		  })
		  .catch(error => {
		    console.log(error);
				alert("DELETE FAILED")
		  });

	}

	_onPressDELETESubject(value,index) {
		const self= this
		var params = new URLSearchParams();
		params.append('tenmonhoc', value.tenMonHoc);
		axios.post('/deleteSubject/',params)
		  .then(response => {
				if (response.data.status == 'OK') {
					self._loadDataListSubject()
					alert("DELETE SUCCESS")
				} else {
					alert("DELETE FAILED")
				}
		  })
		  .catch(error => {
		    console.log(error);
				alert("DELETE FAILED")
		  });

	}
	_onPressOkAddSubject(){
		const namesubject = this.refs.namesubject.value
		const hourstart = this.refs.hourstart.value
		const minutesstart = this.refs.minutesstart.value
		const hourend = this.refs.hourend.value
		const minutesend = this.refs.minutesend.value
		const thu = this.refs.thu.value

		const dayStart = this.refs.daystart.value
		const monthStart = this.refs.monthstart.value
		const yearStart = this.refs.yearstart.value

		const dayEnd = this.refs.dayend.value
		const monthEnd = this.refs.monthend.value
		const yearEnd = this.refs.yearend.value
		if (namesubject!='' && hourstart!= '' && minutesstart!=''
		&& hourend!='' && minutesend!='' && thu!=''
		&& dayStart!='' && monthStart!=''&&yearStart!=''
		&& dayEnd!='' && monthEnd!=''&&yearEnd!='') {
			var params = new URLSearchParams();
			params.append('tenmonhoc', namesubject);
			params.append('timestart', hourstart+':'+minutesstart);
			params.append('timeend', hourend+':'+minutesend);
			params.append('thu',thu)
			var start = dayStart+'/'+monthStart+'/'+yearStart
			var end = dayEnd+'/'+monthEnd+'/'+yearEnd

			params.append('datestart',start)
			params.append('dateend',end)

			axios.post('/addMonHoc',params)
			  .then(response => {
					if (response.data.status == 'OK') {
						alert("ADD SUCCESS")
					} else {
						alert("ADD FAILED")
					}
			  })
			  .catch(error => {
			    console.log(error);
					alert("ADD FAILED")
			  });
		} else {
			alert("PLEASE PRESS FULL INFORMATION")
		}
	}

	_renderRow() {
		const {dataSource} = this.state
		var dulieu = []
		dataSource.map((value,index) => {
			if (index%2 == 0) {
				dulieu.push(
					<tr key={index} style={{backgroundColor:'#EAF3F3',height:50}}>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.id}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.hoten}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.mssv}</div></td>
						<td >
							<div style={{flex:1,alignItems:'center',textAlign:'center',height:'100%',width:'100%'}}>
								<button onClick={this._onPressItem.bind(this,value,index)} style={{flex:1,alignItems:'center',textAlign:'center',height:'100%',width:'50%',display: 'inline-block'}}>SEEN</button>
								<button onClick={this._onPressDELETESV.bind(this,value,index)} style={{color:'white',backgroundColor:'rgba(244,66,66,0.7)',alignItems:'center',textAlign:'center',height:'100%',width:'50%',display: 'inline-block'}}>DELETE</button>
							</div>
						</td>
					</tr>
				)
			} else {
				dulieu.push(
					<tr key={index} style={{backgroundColor:'white',height:50}}>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.id}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.hoten}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.mssv}</div></td>
						<td >
							<div style={{display:'block',width:'100%',height:'100%',alignItems:'center',textAlign:'center'}}>
								<button onClick={this._onPressItem.bind(this,value,index)} style={{flex:1,alignItems:'center',textAlign:'center',height:'100%',width:'50%',display: 'inline-block'}}>SEEN</button>
								<button onClick={this._onPressDELETESV.bind(this,value,index)} style={{color:'white',backgroundColor:'rgba(244,66,66,0.7)',flex:1,alignItems:'center',textAlign:'center',height:'100%',width:'50%',display: 'inline-block'}}>DELETE</button>
							</div>
						</td>
					</tr>
				)
			}
		})
		return dulieu
	};
	_renderDashBoard() {
		return(
			<div>
				<table style={{width:"100%",height:'100%'}}>
					<thead>
						<tr style={{color:'white',backgroundColor:'#157F90',height:50}}>
							<th>ID</th>
							<th>NAME</th>
							<th>MSSV</th>
							<th>CHOOSE</th>
						</tr>
					</thead>
					<tbody>
						{this._renderRow()}
					</tbody>
				</table>
				{this._renderLoading()}
			</div>
		)
	}

	_renderAddSV () {
		return(
			<div>
				<div style={{padding:20,width:"100%"}}>
						<div>
							<table style={{width:"100%"}}>
								<tbody>
									<tr style={{width:"100%",color:'black',height:50}}>
										<td style={{width:'50%'}}>ID</td>
										<td style={{width:'50%'}}><input ref="id"  style={{width:'90%',height:50}}/></td>
									</tr>
									<tr style={{color:'black',height:50}}>
										<td style={{width:'50%'}}>NAME</td>
										<td style={{width:'50%'}}><input ref="hoten" style={{width:'90%',height:50}}/></td>
									</tr>
									<tr style={{color:'black',height:50}}>
										<td style={{width:'50%'}}>MSSV</td>
										<td style={{width:'50%'}}><input ref="mssv" style={{width:'90%',height:50}}/></td>
									</tr>
								</tbody>
							</table>
							<div style={{marginTop:30,width:'100%',height:50,textAlign:'center'}}>
								<button onClick={this._onPressOKAddSV.bind(this)}  style={{width:'30%',height:"100%",border:0,padding:20}}>OK!</button>
							</div>
						</div>
				</div>
				{this._renderLoading()}
			</div>
		)
	}

	_renderRowDanhSachRaVao() {
		const {dataSourceDanhSachRaVao} = this.state
		var dulieu = []
		dataSourceDanhSachRaVao.map((value,index) => {
			if (index%2 == 0) {
				dulieu.push(
					<tr key={index} style={{backgroundColor:'#EAF3F3',height:50}}>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.id}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.hoten}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.mssv}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.time}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.date}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.typeTrip==true?'Vào':'Ra'}</div></td>
					</tr>
				)
			} else {
				dulieu.push(
					<tr key={index} style={{backgroundColor:'white',height:50}}>
					<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.id}</div></td>
					<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.hoten}</div></td>
					<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.mssv}</div></td>
					<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.time}</div></td>
					<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.date}</div></td>
					<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.typeTrip==true?'Vào':'Ra'}</div></td>
					</tr>
				)
			}
		})
		return dulieu
	}
	_renderDanhSachRaVao(){
		return(
			<div>
				<table style={{width:"100%"}}>
					<thead>
						<tr style={{color:'white',backgroundColor:'#157F90',height:50}}>
							<th>ID</th>
							<th>NAME</th>
							<th>MSSV</th>
							<th>TIME</th>
							<th>DATE</th>
							<th>TYPETRIP</th>
						</tr>
					</thead>
					<tbody>
						{this._renderRowDanhSachRaVao()}
					</tbody>
				</table>
				{this._renderLoading()}
			</div>
		)
	}

	_renderRowListSubject() {
		const {dataSourceListSubject} = this.state
		var dulieu = []
		dataSourceListSubject.map((value,index) => {
			if (index%2 == 0) {
				dulieu.push(
					<tr key={index} style={{backgroundColor:'#EAF3F3',height:50}}>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.tenMonHoc}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.timeStart}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.timeEnd}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.thu}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.dateStart}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.dateEnd}</div></td>

						<td >
							<div style={{flex:1,width:'100%',height:'100%',alignItems:'center',textAlign:'center'}}>
								<button onClick={this._onPressDELETESubject.bind(this,value,index)} style={{color:'white',backgroundColor:'rgba(244,66,66,0.7)',alignItems:'center',textAlign:'center',height:'100%',width:'100%',display: 'inline-block'}}>DELETE</button>
							</div>
						</td>

					</tr>
				)
			} else {
				dulieu.push(
					<tr key={index} style={{backgroundColor:'white',height:50}}>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.tenMonHoc}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.timeStart}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.timeEnd}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.thu}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.dateStart}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.dateEnd}</div></td>

						<td >
							<div style={{height:'100%',width:'100%',alignItems:'center',textAlign:'center'}}>
								<button onClick={this._onPressDELETESubject.bind(this,value,index)} style={{color:'white',backgroundColor:'rgba(244,66,66,0.7)',alignItems:'center',textAlign:'center',height:'100%',width:'100%',display: 'inline-block'}}>DELETE</button>
							</div>
						</td>
					</tr>
				)
			}
		})
		return dulieu
	}
	_renderListSubject(){
		return(
			<div>
				<table style={{height:'100%',width:"100%"}}>
					<thead>
						<tr style={{color:'white',backgroundColor:'#157F90',height:50}}>
							<th>NAMESUBJECT</th>
							<th>TIMESTART</th>
							<th>TIMEEND</th>
							<th>DAYOFWEEK</th>
							<th>DATESTART</th>
							<th>DATEEND</th>
							<th></th>

						</tr>
					</thead>
					<tbody>
						{this._renderRowListSubject()}
					</tbody>
				</table>
				{this._renderLoading()}
			</div>
		)
	}
	_renderHours() {
		var dulieu = []
		for (var i =0 ;i<=24;i++) {
			if (i <=9) {
				dulieu.push(<option key={i}  value={'0'+i}>{'0'+i}</option>)
			} else {
				dulieu.push(<option key={i}  value={i+''}>{i+''}</option>)
			}
		}
		return dulieu
	}
	_renderMinutes() {
		var dulieu = []
		for (var i =0 ;i<=60;i++) {
			if (i <=9) {
				dulieu.push(<option key={i}  value={'0'+i}>{'0'+i}</option>)
			} else {
				dulieu.push(<option key={i}  value={i+''}>{i+''}</option>)
			}
		}
		return dulieu
	}
	_renderDayOfWeek() {
		var dulieu = []
		const thu = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
		for (var i = 0 ;i<thu.length;i++) {
			dulieu.push(<option key={i} value={thu[i]}>{thu[i]}</option>)
		}
		return dulieu
	}
	_renderDate() {
		var dulieu = []
		for (var i =1 ;i<=31;i++) {
			if (i <=9) {
				dulieu.push(<option key={i}  value={'0'+i}>{'0'+i}</option>)
			} else {
				dulieu.push(<option key={i}  value={i+''}>{i+''}</option>)
			}
		}
		return dulieu
	}
	_renderMonth() {
		var dulieu = []
		for (var i =1 ;i<=12;i++) {
			if (i <=9) {
				dulieu.push(<option key={i}  value={'0'+i}>{'0'+i}</option>)
			} else {
				dulieu.push(<option key={i}  value={i+''}>{i+''}</option>)
			}
		}
		return dulieu
	}
	_renderYear() {
		var dulieu = []
		for (var i =(new Date()).getFullYear() ;i<=(new Date()).getFullYear()+20;i++) {
			if (i <=9) {
				dulieu.push(<option key={i}  value={'0'+i}>{'0'+i}</option>)
			} else {
				dulieu.push(<option key={i}  value={i+''}>{i+''}</option>)
			}
		}
		return dulieu
	}
	_renderAddSubject() {
		return(
			<div>
				<div style={{padding:20,width:"100%"}}>
						<div>
							<table style={{width:"100%"}}>
								<tbody>
									<tr style={{width:"100%",color:'black',height:50}}>
										<td style={{width:'50%'}}>NAMESUBJECT</td>
										<td style={{width:'50%'}}><input ref="namesubject"  style={{width:'90%',height:50}}/></td>
									</tr>
									<tr style={{color:'black',height:50}}>
										<td style={{width:'50%'}}>TIMESTART</td>
										<td style={{width:'50%'}}>
											HOUR:	<select ref='hourstart'>{this._renderHours()}</select>
											/MINUTES:	<select ref='minutesstart'>{this._renderMinutes()}</select>
										</td>
										<td style={{width:100}}>	 </td>
									</tr>
									<tr style={{color:'black',height:50}}>
										<td style={{width:'50%'}}>TIMEEND</td>
										<td style={{width:'50%'}}>
											HOUR:	<select ref='hourend'>{this._renderHours()}</select>
											/MINUTES:	<select ref='minutesend'>{this._renderMinutes()}</select>
										</td>
									</tr>



									<tr style={{color:'black',height:50}}>
										<td style={{width:'50%'}}>DATESTART</td>
										<td style={{width:'50%'}}>
											DATE:	<select ref='daystart'>{this._renderDate()}</select>
											/MONTH:	<select ref='monthstart'>{this._renderMonth()}</select>
											/YEAR:	<select ref='yearstart'>{this._renderYear()}</select>
										</td>
									</tr>
									<tr style={{color:'black',height:50}}>
										<td style={{width:'50%'}}>DATEEND</td>
										<td style={{width:'50%'}}>
										DATE:	<select ref='dayend'>{this._renderDate()}</select>
										/MONTH:	<select ref='monthend'>{this._renderMonth()}</select>
										/YEAR:	<select ref='yearend'>{this._renderYear()}</select>
										</td>
									</tr>




									<tr style={{color:'black',height:50}}>
										<td style={{width:'50%'}}>DAYOFWEEK</td>
										<td style={{width:'50%'}}>
											<select ref='thu'>{this._renderDayOfWeek()}</select>
										</td>
									</tr>
								</tbody>
							</table>
							<div style={{marginTop:30,width:'100%',height:50,textAlign:'center'}}>
								<button onClick={this._onPressOkAddSubject.bind(this)}  style={{width:'30%',height:"100%",border:0,padding:20}}>OK!</button>
							</div>
						</div>
				</div>
				{this._renderLoading()}
			</div>
		)
	}
	_renderAllMonHoc() {
		const {arrayMonHoc} = this.state
		var dulieu = []
		for (var i =0 ;i<arrayMonHoc.length ;i++) {
			dulieu.push(<option key={i}  value={arrayMonHoc[i].tenMonHoc}>{arrayMonHoc[i].tenMonHoc}</option>)
		}
		return dulieu
	}
	_onChangeSelected(index1) {
		var dulieu = []
		const {dataSourceRegisterSubject} = this.state
		dataSourceRegisterSubject.map ((value,index) => {
			if (index == index1) {
				value.check = ! value.check
			}
			dulieu.push(value)
		})
		this.setState({dataSourceRegisterSubject:dulieu})
	}
	_renderRowRegisterSubject() {
		const {dataSourceRegisterSubject} = this.state
		var dulieu = []
		if (dataSourceRegisterSubject.length != 0 ){
			dataSourceRegisterSubject.map((value,index) => {
				if(value.check == undefined) value.check= false
				if (index%2 == 0) {
					dulieu.push(
						<tr key={index} style={{backgroundColor:'#EAF3F3',height:50}}>
							<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.id}</div></td>
							<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.hoten}</div></td>
							<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.mssv}</div></td>
							<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>
								<input type="checkbox" onChange={this._onChangeSelected.bind(this,index)} checked={value.check}/>
							</div></td>
						</tr>
					)
				} else {
					dulieu.push(
						<tr key={index} style={{backgroundColor:'white',height:50}}>
							<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.id}</div></td>
							<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.hoten}</div></td>
							<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.mssv}</div></td>
							<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>
								<input type="checkbox" onChange={this._onChangeSelected.bind(this,index)} checked={value.check}/>
							</div></td>
						</tr>
					)
				}
			})
		}
		return dulieu
	}
	_onPressAcceptRegisterSubject() {
		const self= this
		const {dataSourceRegisterSubject,dataSourceListSubject,selectedSubject,arrayMonHoc} = this.state
			axios({
			method:'get',
			url:'/removeDangKyMonHoc/?monHoc='+selectedSubject,
			responseType:'jsonp'
		})
			.then(function(response) {
				if (response.status == 200) {
					var data = response.data
					if (data.status == 'OK') {
						self.setState({
							animating:false
						})
						var json = []
						dataSourceRegisterSubject.map((value) => {
							if (value.check == true) {
								var monHoc = arrayMonHoc.find((value2) => value2.tenMonHoc == selectedSubject)
								const json2 ={id:value.id,
														 hoten:value.hoten,
														 mssv:value.mssv,
														 tenMonHoc:selectedSubject,
														 timeStart:monHoc.timeStart,
														 timeEnd:monHoc.timeEnd,
														 thu:monHoc.thu}
								json.push(json2)
							}
						})
						var params = new URLSearchParams();
						var stringJson = JSON.stringify(json)
						params.append('json', stringJson);
						axios.post('/saveJsonDangKyMonSV/',params)
						  .then(response => {
								if (response.status == 200) {
									json = response.data
									if (json.status == 'OK') {
										alert('UPDATE SUCCESS')
									} else {
										alert('UPDATE FAILED')
									}
								} else {
									alert("UPDATE FAILED")
								}
						  })
						  .catch(error => {
						    console.log(error);
								alert("UPDATE FAILED")
						  });
					} else {
						 alert('UPDATE FAILED')
					}
				} else {
					alert('UPDATE FAILED')
				}
		});
	}
	handleChangeSelectedMonHoc(event) {
		const self=this
		self.setState({selectedSubject:event.target.value,animating:true})
		axios({
		method:'get',
		url:'/allData1',
		responseType:'jsonp'
		})
		.then(function(response1) {
			if (response1.status == 200) {
				axios({
				method:'get',
				url:'/dangKyMonHoc',
				responseType:'jsonp'
				})
				.then(function(response) {
					if (response.status == 200) {
						const {selectedSubject} = self.state
						var data1 = response1.data
						var data = response.data
						data1.map((value) => {
							value.check = false
							data.map((value2) => {
								if (value.id == value2.id && selectedSubject == value2.tenMonHoc) {
									value.tenMonHoc = selectedSubject,
									value.timeStart = value2.timeStart,
									value.timeEnd = value2.timeEnd,
									value.thu = value2.thu,
									value.check = true
								}
							})
						})
						self.setState({
							dataSourceRegisterSubject:data1,
							animating:false
						})
					} else {
						alert("CANNOT GET DATA")
					}
				});
			}
		});
	}
	_renderRegisterSubjectSV() {
		return(
			<div style={{height:'100%'}}>
				<select style={{height:'30%',float:'left',display:'inline-block',width:200}} onChange={this.handleChangeSelectedMonHoc.bind(this)}>
					{this._renderAllMonHoc()}
				</select>
				<button onClick = {this._onPressAcceptRegisterSubject.bind(this)} style={{height:50,float:'left',width:'30%'}}>UPDATE</button>
				<table style={{width:"100%"}}>
					<thead>
						<tr style={{color:'white',backgroundColor:'#157F90',height:50}}>
							<th>ID</th>
							<th>NAME</th>
							<th>MSSV</th>
							<th>IS REGISTER</th>
						</tr>
					</thead>
					<tbody>
						{this._renderRowRegisterSubject()}
					</tbody>
				</table>
				{this._renderLoading()}
			</div>
		)
	}
	_onPressDeleteRegisterSubject(value,index) {
		axios({
			method:'get',
			url:'/removeDangKyMonHoc/?monHoc='+value.tenMonHoc,
			responseType:'jsonp'
		}).then(function(responseMonHoc) {
			if (responseMonHoc.status == 200) {
				if (responseMonHoc.data.status == 'OK') {
					alert("REMOVE REGISTER SUBJECT SUCCESS")
				} else {
					alert("REMOVE REGISTER SUBJECT FAILED!")
				}
			} else {
				alert("REMOVE REGISTER SUBJECT FAILED!")
			}
		})
	}
	_renderRowListDeleteRegisterSubject() {
		const {dataSourceListSubject} = this.state
		var dulieu = []
		dataSourceListSubject.map((value,index) => {
			if (index%2 == 0) {
				dulieu.push(
					<tr key={index} style={{backgroundColor:'#EAF3F3',height:50}}>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.tenMonHoc}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.timeStart}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.timeEnd}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.thu}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.dateStart}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.dateEnd}</div></td>

						<td >
							<div style={{flex:1,width:'100%',height:'100%',alignItems:'center',textAlign:'center'}}>
								<button onClick={this._onPressDeleteRegisterSubject.bind(this,value,index)} style={{color:'white',backgroundColor:'rgba(244,66,66,0.7)',alignItems:'center',textAlign:'center',height:'100%',width:'100%',display: 'inline-block'}}>DELETE</button>
							</div>
						</td>

					</tr>
				)
			} else {
				dulieu.push(
					<tr key={index} style={{backgroundColor:'white',height:50}}>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.tenMonHoc}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.timeStart}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.timeEnd}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.thu}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.dateStart}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.dateEnd}</div></td>

						<td >
							<div style={{height:'100%',width:'100%',alignItems:'center',textAlign:'center'}}>
								<button onClick={this._onPressDeleteRegisterSubject.bind(this,value,index)} style={{color:'white',backgroundColor:'rgba(244,66,66,0.7)',alignItems:'center',textAlign:'center',height:'100%',width:'100%',display: 'inline-block'}}>DELETE</button>
							</div>
						</td>
					</tr>
				)
			}
		})
		return dulieu
	}
	_renderRemoveRegisterSubject() {
		return(
			<div>
				<table style={{height:'100%',width:"100%"}}>
					<thead>
						<tr style={{color:'white',backgroundColor:'#157F90',height:50}}>
							<th>NAMESUBJECT</th>
							<th>TIMESTART</th>
							<th>TIMEEND</th>
							<th>DAYOFWEEK</th>
							<th>DATESTART</th>
							<th>DATEEND</th>
							<th></th>

						</tr>
					</thead>
					<tbody>
						{this._renderRowListDeleteRegisterSubject()}
					</tbody>
				</table>
				{this._renderLoading()}
			</div>
		)
	}
	_onAcceptPressClearListTrip() {
		axios({
			method:'get',
			url:'/removeLichSu',
			responseType:'jsonp'
		}).then(function(responseMonHoc) {
			if (responseMonHoc.status == 200) {
				if (responseMonHoc.data.status == 'OK') {
					alert("REMOVE CACHE LIST TRIP SUCCESS!")
				} else {
					alert("REMOVE CACHE LIST TRIP FAILED!")
				}
			} else {
				alert("REMOVE CACHE LIST TRIP FAILED!")
			}
		})
	}
	_renderClearListTrip() {
		return (
			<div style={{padding:10,left:20}}>
				Do You Want To Clear ALL Cache List Trip?
				<button style={{left:20,height:30,width:200}} onClick={this._onAcceptPressClearListTrip.bind(this)}>CLEAR LISTTRIP</button>
			</div>
		)
	}
	_renderRowDetailTrip() {
		const {selectedCheckTrip,listDetailCount} = this.state
		var dulieu = []
		listDetailCount.map((value,index) => {
			if (index%2 == 0) {
				dulieu.push(
					<tr key={index} style={{backgroundColor:'#EAF3F3',height:50}}>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{selectedCheckTrip.id}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{selectedCheckTrip.hoten}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{selectedCheckTrip.mssv}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.date}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.count}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.typeTrip==true?'Vào':'Ra'}</div></td>

						<td >
							<div style={{flex:1,width:'100%',height:'100%',alignItems:'center',textAlign:'center'}}>
								<button onClick={this._onPressDeleteRegisterSubject.bind(this,value,index)} style={{color:'white',backgroundColor:'rgba(244,66,66,0.7)',alignItems:'center',textAlign:'center',height:'100%',width:'100%',display: 'inline-block'}}>DELETE</button>
							</div>
						</td>

					</tr>
				)
			} else {
				dulieu.push(
					<tr key={index} style={{backgroundColor:'white',height:50}}>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{selectedCheckTrip.id}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{selectedCheckTrip.hoten}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{selectedCheckTrip.mssv}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.date}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.count}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.typeTrip==true?'Vào':'Ra'}</div></td>

						<td >
							<div style={{height:'100%',width:'100%',alignItems:'center',textAlign:'center'}}>
								<button onClick={this._onPressDeleteRegisterSubject.bind(this,value,index)} style={{color:'white',backgroundColor:'rgba(244,66,66,0.7)',alignItems:'center',textAlign:'center',height:'100%',width:'100%',display: 'inline-block'}}>DELETE</button>
							</div>
						</td>
					</tr>
				)
			}
		})
		return dulieu
	}
	_renderDetailTrip() {
		return(
			<div>
				<table style={{height:'100%',width:"100%"}}>
					<thead>
						<tr style={{color:'white',backgroundColor:'#157F90',height:50}}>
							<th>ID</th>
							<th>NAME</th>
							<th>MSSV</th>
							<th>DATE</th>
							<th>COUNT</th>
							<th>STATUS</th>
							<th></th>

						</tr>
					</thead>
					<tbody>
						{this._renderRowDetailTrip()}
					</tbody>
				</table>
				{this._renderLoading()}
			</div>
		)
	}
	_renderRowCheckSV() {
		const {listCheck} = this.state
		var dulieu = []
		listCheck.map((value,index) => {
			if (index%2 == 0) {
				dulieu.push(
					<tr key={index} style={{backgroundColor:'#EAF3F3',height:50}}>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.id}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.hoten}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.percent+' %'}</div></td>

						<td >
							<div style={{flex:1,width:'100%',height:'100%',alignItems:'center',textAlign:'center'}}>
								<button onClick={this._onPressDeleteRegisterSubject.bind(this,value,index)} style={{color:'white',backgroundColor:'rgba(244,66,66,0.7)',alignItems:'center',textAlign:'center',height:'100%',width:'100%',display: 'inline-block'}}>DELETE</button>
							</div>
						</td>

					</tr>
				)
			} else {
				dulieu.push(
					<tr key={index} style={{backgroundColor:'white',height:50}}>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.id}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.hoten}</div></td>
						<td ><div style={{flex:1,alignItems:'center',textAlign:'center'}}>{value.percent + ' %'}</div></td>

						<td >
							<div style={{height:'100%',width:'100%',alignItems:'center',textAlign:'center'}}>
								<button onClick={this._onPressDeleteRegisterSubject.bind(this,value,index)} style={{color:'white',backgroundColor:'rgba(244,66,66,0.7)',alignItems:'center',textAlign:'center',height:'100%',width:'100%',display: 'inline-block'}}>DELETE</button>
							</div>
						</td>
					</tr>
				)
			}
		})
		return dulieu
	}
	_renderAllMonHoc2() {
		const {dataSourceListSubject} = this.state
		var dulieu = []
		for (var i =0 ;i<dataSourceListSubject.length ;i++) {
			dulieu.push(<option key={i}  value={dataSourceListSubject[i].tenMonHoc}>{dataSourceListSubject[i].tenMonHoc}</option>)
		}
		return dulieu
	}
	_renderCheckSV() {
		return (
			<div style={{height:'100%'}}>
			<select style={{height:'30%',float:'left',display:'inline-block',width:200}} onChange={this._handleClickChooseSubjectCheck.bind(this)}>
				{this._renderAllMonHoc2()}
			</select>
			<table style={{width:"100%"}}>
					<thead>
						<tr style={{color:'white',backgroundColor:'#157F90',height:50}}>
							<th>ID</th>
							<th>NAME</th>
							<th>Percent</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{this._renderRowCheckSV()}
					</tbody>
			</table>
			{this._renderLoading()}
			</div>

		)
	}
	_renderScreen() {
		const {kindScreen} = this.state
		if (kindScreen == 0) {
			return this._renderDashBoard()
		} else if (kindScreen == 1) {
			return this._renderAddSV()
		} else if(kindScreen == 2) {
			return this._renderDanhSachRaVao()
		} else if(kindScreen == 3) {
			return this._renderListSubject()
		} else if(kindScreen == 4) {
			return this._renderAddSubject()
		} else if (kindScreen == 5 ) {
			return this._renderRegisterSubjectSV()
		} else if (kindScreen == 6 ) {
			return this._renderRemoveRegisterSubject()
		} else if(kindScreen == 7) {
			return this._renderClearListTrip()
		} else if(kindScreen == 8) {
			return this._renderDetailTrip()
		} else if (kindScreen == 10) {
			return this._renderCheckSV()
		}
	}
	_loadDataDanhSachRaVao() {
		const self = this
     	axios({
		  method:'get',
		  url:'/allData2',
		  responseType:'jsonp'
		})
		  .then(function(response) {
		  	if (response.status == 200) {
		  		var data = response.data
					const {dataSource} = self.state
					dataSource.map((value1,index) => {
						data.map((value2) => {
							if (value1.id == value2.id) {
								value2.hoten = value1.hoten
								value2.mssv = value1.mssv
							}
						})
					})
		  		self.setState({
		  			dataSourceDanhSachRaVao:data,
		  			animating:false
		  		})
		  	} else {

		  	}
		});
	}
	_loadDataListSubject() {
		const self = this
     	axios({
		  method:'get',
		  url:'/monHoc',
		  responseType:'jsonp'
		})
		  .then(function(response) {
		  	if (response.status == 200) {
		  		var data = response.data
		  		self.setState({
		  			dataSourceListSubject:data,
		  			animating:false
		  		})
		  	} else {

		  	}
		});
	}
	_loadRegisterSubject() {
		const self = this
			axios({
			method:'get',
			url:'/monHoc',
			responseType:'jsonp'
		}).then(function(responseMonHoc) {
			if (responseMonHoc.status == 200) {
				var monHoc = responseMonHoc.data
				if (monHoc.length !=0){
					self.setState({arrayMonHoc:monHoc,selectedSubject:monHoc[0].tenMonHoc})
					axios({
					method:'get',
					url:'/allData1',
					responseType:'jsonp'
					})
					.then(function(response1) {
						if (response1.status == 200) {
							axios({
							method:'get',
							url:'/dangKyMonHoc',
							responseType:'jsonp'
							})
							.then(function(response) {
								if (response.status == 200) {
									const {selectedSubject} = self.state
									var data1 = response1.data
									var data = response.data
									data1.map((value) => {
										value.check == false
										data.map((value2) => {
											if (value.id == value2.id && selectedSubject == value2.tenMonHoc) {
												value.tenMonHoc = selectedSubject
												value.timeStart = value2.timeStart
												value.timeEnd = value2.timeEnd
												value.dateStart = value2.dateStart
												value.dateEnd = value2.dateEnd
												value.thu = value2.thu
												value.check = true
											}
										})
									})
									self.setState({
										dataSourceRegisterSubject:data1,
										animating:false
									})
								} else {

								}
							});
						}
					});
				} else {
					alert("HAVEN'T ANY SUBJECT")
				}
			}
		})

	}
	_loadRemoveRegisterSubject() {
		const self = this
     	axios({
		  method:'get',
		  url:'/monHoc',
		  responseType:'jsonp'
		})
		  .then(function(response) {
		  	if (response.status == 200) {
		  		var data = response.data
		  		self.setState({
		  			dataSourceListSubject:data,
		  			animating:false
		  		})
		  	} else {

		  	}
		});
	}
	_loadDetailCount(id) {
		const self = this
			axios({
			method:'get',
			url:'/countId?id='+id,
			responseType:'jsonp'
		}).then(function(response) {
			if (response.status == 200) {
				self.setState({
					listDetailCount:response.data
				})
			} else {
				alert('GET DETAIL TRIP OF THIS ID FAILED')
			}
		})
	}
	_handleClickChooseSubjectCheck(event) {
		this.setState({animating:true})
		const self = this
		var params = new URLSearchParams();
		params.append('monHoc', event.target.value);
		axios.post('/listDiemDanh',params)
		  .then(response => {
				if (response.status == '200') {
					self.setState({
						listCheck:response.data,
						animating:false								 
					})
				} else {
					alert("CANNOT LOAD LIST CHECK")
				}
		  })
		  .catch(error => {
			console.log(error);
			alert("CANNOT LOAD LIST CHECK")
		});
	}
	_loadListCheck() {
		const self = this
		axios({
		 method:'get',
		 url:'/monHoc',
		 responseType:'jsonp'
	   })
		 .then(function(response) {
			 if (response.status == 200) {
				 var data = response.data
				 self.setState({
					 dataSourceListSubject:data,
				 })
				 var params = new URLSearchParams();
				 params.append('monHoc', data[0].tenMonHoc);
				 axios.post('/listDiemDanh',params)
				   .then(response => {
						 if (response.status == '200') {
							 self.setState({
								 listCheck:response.data,
								 animating:false								 
							 })
						 } else {
							 alert("CANNOT LOAD LIST CHECK")
						 }
				   })
				   .catch(error => {
					 console.log(error);
					 alert("CANNOT LOAD LIST CHECK")
				 });

			 } else {

			 }
	   });
		
	}
	_onPressCheckSV() {
		this._loadListCheck()		
		this.setState({kindScreen: 10,animating:true})	
	}
	_onPressClearListTrip() {
		this.setState({kindScreen:7})
	}
	_onPressRemoveSubject() {
		this.setState({kindScreen:6,animating:true})
		this._loadRemoveRegisterSubject()
	}
	_onPressRegisterSubjectSV() {
		this.setState({kindScreen:5})
		this._loadRegisterSubject()
	}
	_onPressAddSubject() {
		this.setState({kindScreen:4})
	}
	_onPressListSubject() {
		this.setState({kindScreen:3,animating:true})
		this._loadDataListSubject()
	}
	_onPressDashBoard() {
		this.setState({kindScreen:0})
		this._loadDashBoard()
	}
	_onPressAddSV() {
		this.setState({kindScreen:1})
	}
	_onPressDanhSachRaVao() {
		this._loadDataDanhSachRaVao()
		this.setState({kindScreen:2,animating:true})
	}
	
	render() {
		return(
			<div style={{height:'95%',width:'100%'}}>
				<div style={{float:'left',width:'20%',height:'100%',backgroundColor:'#157F90'}}>
					<p onClick={this._onPressDashBoard.bind(this)} style={{width:'100%',marginLeft:20,marginTop:20,marginBottom:20,color:'white',fontSize:20,fontWeight:'bold'}}>DASHBOARD</p>
					<p onClick={this._onPressAddSV.bind(this)} style={{width:'100%',marginLeft:20,marginTop:20,marginBottom:20,color:'white',fontSize:20,fontWeight:'bold'}}>ADDSTUDENT</p>
					<p onClick={this._onPressCheckSV.bind(this)} style={{width:'100%',marginLeft:20,marginTop:20,marginBottom:20,color:'white',fontSize:20,fontWeight:'bold'}}>CHECK</p>

					<hr/>
					<p onClick={this._onPressDanhSachRaVao.bind(this)} style={{width:'100%',marginLeft:20,marginTop:20,marginBottom:20,color:'white',fontSize:20,fontWeight:'bold'}}>LISTTRIP</p>
					<p onClick={this._onPressClearListTrip.bind(this)} style={{width:'100%',marginLeft:20,marginTop:20,marginBottom:20,color:'white',fontSize:20,fontWeight:'bold'}}>CLEAR CACHE LISTTRIP</p>

					<hr/>
					<p onClick={this._onPressListSubject.bind(this)} style={{width:'100%',marginLeft:20,marginTop:20,marginBottom:20,color:'white',fontSize:20,fontWeight:'bold'}}>LISTSUBJECT</p>
					<p onClick={this._onPressAddSubject.bind(this)} style={{width:'100%',marginLeft:20,marginTop:20,marginBottom:20,color:'white',fontSize:20,fontWeight:'bold'}}>ADDSUBJECT</p>
					<p onClick={this._onPressRegisterSubjectSV.bind(this)} style={{width:'100%',marginLeft:20,marginTop:20,marginBottom:20,color:'white',fontSize:20,fontWeight:'bold'}}>REGISTERSUBJECT</p>
					<p onClick={this._onPressRemoveSubject.bind(this)} style={{width:'100%',marginLeft:20,marginTop:20,marginBottom:20,color:'white',fontSize:20,fontWeight:'bold'}}>REMOVE REGISTER SUBJECT</p>
					<hr/>
					<p onClick={this._onPressAddSubject.bind(this)} style={{width:'100%',marginLeft:20,marginTop:20,marginBottom:20,color:'white',fontSize:20,fontWeight:'bold'}}>NULL</p>

				</div>
				<div style={{float:'left',width:'80%',height:'95%'}} >
					{this._renderScreen()}
				</div>
			</div>
		)
	}
}
class Header extends React.Component {
	_onClickSignIn() {
		window.location.assign("/signIn")
	}
	_onClickLogout() {
		window.location.assign("/signIn")
	}
	_onClickSignUp() {
	}
	render() {
		return(
			<div style={{height:'100%',flexDirection:'row',backgroundColor:'#157F90',alignItems:'center',justifyContent:'center'}}>
				<div style={{float:'left',height:null,padding:20,justifyContent:'center',position:'relative',margin:'auto',fontSize:15,width:'80%',color:'white',fontWeight:'bold'}}>VLTH {user}</div>
				<div style={{textAlign:'center',position:'absolute',top:20,right:0,width:'20%'}}>
					<div style={{display:'inline-block'}}>
						<button onClick = {this._onClickLogout.bind(this)} style={{float:'left',width:100,height:30}}>LOGOUT</button>
					</div>
				</div>
			</div>
		)
	}
}
ReactDOM.render(
	<div style={{height:'100%',backgroundColor:'#F0F1F1'}}>
		<div style={{width:"100%",height:'5%'}}>
			<Header/>
		</div>
		<RowData/>
	</div>
,document.getElementById("root"));
