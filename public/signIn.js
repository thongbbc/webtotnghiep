class Main extends React.Component {
  _onClickSignIn() {
    if (this.refs.user.value != '' && this.refs.pass.value!= '') {
        var form = this.refs.form
        form.submit();
    } else {
      alert('please press full information')
    }
  }
  componentDidMount() {
    if (check != null && check != '') {
      if (check == 1) {
        alert('YOUR PASSWORD OR USERNAME IS WRONG')
      }
    }
  }
  render() {
    return(
      <div style={{height:'100%',width:'100%',textAlign:'center'}}>
        <div style={{width:400,height:'auto',margin:'auto',padding:10}}>
          <div style={{marginTop:100,height:50,width:'100%',backgroundColor:'white'}}>
            <div style={{margin:'auto',width:100,top:25,padding:15}}>
              <span style={{color:'#00B5AD',fontWeight:'bold'}}>SIGN IN</span>
            </div>
          </div>
          <div style={{marginTop:20,height:'auto',width:'100%',backgroundColor:'white'}}>
            <form ref='form' action="http://localhost:9999/trangchu" method="post">
              <input placeholder="Username" ref='user' name="username" style={{width:'80%',margin:0,marginTop:50,padding:10}}/>
              <input placeholder="Password" ref='pass' name="password" style={{width:'80%',margin:0,marginTop:20,padding:10}}/>
              <div style={{width:'100%',margin:0,marginTop:20}}>
                <button onClick={this._onClickSignIn.bind(this)} style={{backgroundColor:'#00B5AD',flex:1,color:'white',fontSize:15,fontWeight:'bold',padding:10,margin:10,marginTop:20}}>SIGN IN</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
ReactDOM.render(
	<div style={{height:'100%',width:'100%',backgroundColor: 'rgba(0,0,0,0.2)'}}>
		<Main/>
	</div>
,document.getElementById("root"));
