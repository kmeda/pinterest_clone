import React,{Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Link, withRouter} from 'react-router-dom';
import * as Redux from "react-redux";
import { push } from 'react-router-redux';
import axios from 'axios';

import TwitterLogin from 'react-twitter-auth';

var actions = require('../../actions/actions.js');

class SignIn extends Component {
  constructor(props){
    super(props);

    this.state = { isAuthenticated: false, user: null, token: ''};
  }

  componentWillMount(){
    var {dispatch, auth} = this.props;
    if (auth.authenticated) {
      dispatch(push('/'));
    }
  }

  componentWillUnmount(){
    var {dispatch, auth} = this.props;
    if (auth.signIn || auth.signUp) {
      dispatch(actions.clearErrorMsg());
    }

  }

  handleSignIn(e){
    e.preventDefault();
    var {dispatch, auth} = this.props;

    if (auth.signIn || auth.signUp) {
      dispatch(actions.clearErrorMsg());
    }

    let email = this.refs.username.value;
    let password = this.refs.password.value;

    let credentials = {email, password};

    if (email === '' || password === '') {
      if (email === '') {
        dispatch(actions.emptyEmailError());
      }
      if (password === '') {
        dispatch(actions.emptyPasswordError());
      }
      return;
    }

    dispatch(actions.startSignIn(credentials));
  }

  handleInputChange(e){
    var {dispatch, auth} = this.props;
    if (auth.signIn) {
      dispatch(actions.clearErrorMsg());
    }
  }


  onSuccess = (response) => {
    var {dispatch} = this.props;
    const token = response.headers.get('x-auth-token');
    console.log(token);
    response.json().then(user => {
      if (token) {
        dispatch(actions.setAuthenticated(true));
        localStorage.setItem({token});
        this.setState({isAuthenticated: true, user: user, token: token});
      }
    });
  };
  
  onFailed = (error) => {
    alert(error);
  };
  

  render(){

  var base_url = process.env.NODE_ENV === 'production' 
                  ? 'https://fcc-minterest.herokuapp.com'
                  : 'http://localhost:3050';

    return (
      <div>
        <div className="bc-background"></div>
        <div className="bc-background-overlay">
          <div className="bc-auth-container">

              <div className="bc-logo"></div>
              <div className="bc-auth-header">Welcome to Minterest<br/></div>

            <div className="bc-form-container">
            <form>
                <fieldset className="bc-input-style">
                  {this.props.auth.signIn.noEmail ? <p className='bc-input-error'>Email Required</p> : null}
                  <input placeholder="Email" ref="username"
                         onChange={this.handleInputChange.bind(this)} />
                </fieldset>

                <br/>

                <fieldset className="bc-input-style">
                    {this.props.auth.signIn.invalidCredentials ? <p className='bc-auth-error'>{this.props.auth.signIn.invalidCredentials}</p> : null}
                    {this.props.auth.signIn.noPassword ? <p className='bc-input-error'>Password Required</p> : null}
                    <input placeholder="Password" type="password" ref="password" />
                </fieldset>

                <br/>

                { this.props.auth.signingIn
                  ? <button onClick={(e)=>e.preventDefault()}><i className="fa fa-spinner fa-pulse"></i></button>
                  : <button onClick={this.handleSignIn.bind(this)}>Sign In</button> }

              </form>

              <div className="bc-or-text">OR</div>

              { this.props.auth.twitterSignIn
                ? <div className="bc-twitter-auth">
                  <i className="fa fa-twitter-square" aria-hidden="true"></i>
                  <div><i className="fa fa-spinner fa-pulse"></i></div>
                </div>
                : <div>
                  
                  <TwitterLogin className="bc-twitter-auth"  loginUrl={`${base_url}/auth/twitter`}
                    onFailure={this.onFailed} onSuccess={this.onSuccess}
                    requestTokenUrl={`${base_url}/auth/twitter/reverse`}/>
                </div> }

              <br/>

              <div className="bc-auth-signup-txt">Not a member yet ?
                <Link to={"/signup"}><span className="bc-auth-signup-lnk">Sign Up</span></Link>
              </div>
             </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Redux.connect(
  (state) => {
    return {
      auth: state.auth
    }
  }
)(SignIn);
