
class RowData extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			dataSource:[],
			animating:true,
			kindScreen:0,
			dataSourceDanhSachRaVao:[],
			dataSourceListSubject:[]
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
		alert('Click')
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

	_onPressRemoveSV(value) {
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

	_onPressRemoveSubject(value) {
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
		if (namesubject!='' && hourstart!= '' && minutesstart!='' && hourend!='' && minutesend!='' && thu!='') {
			var params = new URLSearchParams();
			params.append('tenmonhoc', namesubject);
			params.append('timestart', hourstart+':'+minutesstart);
			params.append('timeend', hourend+':'+minutesend);
			params.append('thu',thu)
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
							<div style={{flex:1,alignItems:'center',textAlign:'center'}}>
								<button onClick={this._onPressItem.bind(this,value,index)} style={{flex:1,alignItems:'center',textAlign:'center'}}>SEEN</button>
								<button onClick={this._onPressRemoveSV.bind(this,value,index)} style={{flex:1,alignItems:'center',textAlign:'center'}}>REMOVE</button>
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
							<div style={{flex:1,alignItems:'center',textAlign:'center'}}>
								<button onClick={this._onPressItem.bind(this,value,index)} style={{flex:1,alignItems:'center',textAlign:'center'}}>SEEN</button>
								<button onClick={this._onPressRemoveSV.bind(this,value,index)} style={{flex:1,alignItems:'center',textAlign:'center'}}>REMOVE</button>
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
				<table style={{width:"100%"}}>
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
						<td >
							<div style={{flex:1,alignItems:'center',textAlign:'center'}}>
								<button onClick={this._onPressRemoveSubject.bind(this,value,index)} style={{flex:1,alignItems:'center',textAlign:'center'}}>REMOVE</button>
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
						<td >
							<div style={{flex:1,alignItems:'center',textAlign:'center'}}>
								<button onClick={this._onPressRemoveSubject.bind(this,value,index)} style={{flex:1,alignItems:'center',textAlign:'center'}}>REMOVE</button>
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
				<table style={{width:"100%"}}>
					<thead>
						<tr style={{color:'white',backgroundColor:'#157F90',height:50}}>
							<th>NAMESUBJECT</th>
							<th>TIMESTART</th>
							<th>TIMEEND</th>
							<th>DAYOFWEEK</th>
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
					<hr/>
					<p onClick={this._onPressDanhSachRaVao.bind(this)} style={{width:'100%',marginLeft:20,marginTop:20,marginBottom:20,color:'white',fontSize:20,fontWeight:'bold'}}>LISTTRIP</p>
					<hr/>
					<p onClick={this._onPressListSubject.bind(this)} style={{width:'100%',marginLeft:20,marginTop:20,marginBottom:20,color:'white',fontSize:20,fontWeight:'bold'}}>LISTSUBJECT</p>
					<p onClick={this._onPressAddSubject.bind(this)} style={{width:'100%',marginLeft:20,marginTop:20,marginBottom:20,color:'white',fontSize:20,fontWeight:'bold'}}>ADDSUBJECT</p>
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
			<div style={{height:'100%',flexDirection:'row',backgroundColor:'black',alignItems:'center',justifyContent:'center'}}>
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
