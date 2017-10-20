
class RowData extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			dataSource:[],
			animating:true
		}
	}
	componentDidMount() {
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
		  		alert(JSON.stringify(this.state.dataSource))
		  	} else {

		  	}
		});
	}
	_onPressItem(data,index) {
		alert('Click')
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
							</div>
						</td>
					</tr>
				)
			}
		})
		return dulieu
	};
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
	render() {
		return(
			<div style={{height:'95%'}} >
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
}
class Header extends React.Component {
	_onClickSignIn() {
		window.location.assign("http://localhost:9999/signIn")
	}
	_onClickLogout() {
		window.location.assign("http://localhost:9999/signIn")
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