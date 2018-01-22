class SignUp extends React.Component {
  _onClickSignUp() {
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
      <div class="container">
        <div class="card card-login mx-auto mt-5">
          <div class="card-header">SignUp</div>
          <div class="card-body">
            <form ref = 'form' action='/signUpWeb' method='post'>
              <div class="form-group">
                <label for="exampleInputEmail1">Email address</label>
                <input ref = 'user' name='username' class="form-control" id="exampleInputEmail1" type="email" aria-describedby="emailHelp" placeholder="Enter email"/>
              </div>
              <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input ref = 'pass'  name='password' class="form-control" id="exampleInputPassword1" type="password" placeholder="Password"/>
              </div>
              <a class="btn btn-primary btn-block" style={{color:'white'}} onClick={this._onClickSignUp.bind(this)}>SignUp</a>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
ReactDOM.render(
		<SignUp/>
,document.getElementById("root"));
