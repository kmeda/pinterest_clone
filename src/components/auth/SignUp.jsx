import React,{Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Link, withRouter} from 'react-router-dom';
import * as Redux from "react-redux";
import _ from 'lodash';
import TwitterLogin from 'react-twitter-auth';
import { push } from 'react-router-redux';

var actions = require('../../actions/actions.js');


class SignUp extends Component {
  constructor(props){
    super(props);
  }

  componentWillUnmount(){
    var {dispatch, auth} = this.props;
    if (auth.signIn || auth.signUp) {
      dispatch(actions.clearErrorMsg());
    }
  }


  handleSignUp(e){
    e.preventDefault();
    var {dispatch, auth} = this.props;

    var username = _.trim(this.refs.username.value);
    var fullname = _.trim(this.refs.fullname.value);
    var email = _.trim(this.refs.email.value);
    var password = this.refs.password.value;

    if (email === '' || password === '' || username === '' || fullname === '') {
      if (email === '') {
        dispatch(actions.emailErrorMsg(true));
      }
      if (password === '') {
        dispatch(actions.passwordErrorMsg(true));
      }
      if (username === '') {
        dispatch(actions.usernameErrorMsg(true));
      }
      if (fullname === '') {
        dispatch(actions.fullnameErrorMsg(true));
      }

      return;
    }

    var extractName = [];
    if(fullname.split(' ').length >= 1){
      extractName = fullname.split(' ').map((str)=> {
        if(str.length > 0){
          return str;
        }
      });
    }
    var name = extractName.slice(0,3);

    fullname = {firstname: name[0], lastname: name.slice(1,3).join(' ')}

    var credentials = {username, fullname, email, password};

    if (auth.signUp.emailValid && auth.signUp.passwordValid && auth.signUp.usernameValid && auth.signUp.fullnameValid) {

      dispatch(actions.serverUnreachable(false));
      dispatch(actions.startSignUp(credentials));
    }

  }

  handleFieldChange(){
    var {dispatch, auth} = this.props;
    var username = _.trim(this.refs.username.value);
    var fullname = _.trim(this.refs.fullname.value);
    var email = _.trim(this.refs.email.value);
    var password = this.refs.password.value;

    if(username !== '' && (/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(username)) && auth.signUp.usernameCheck){
      dispatch(actions.checkUsernameExists(username));
    }

    if (email.length === 0 || password.length === 0 || username.length === 0  || fullname.length === 0) {
      if (username.length === 0) {
        dispatch(actions.usernameValid(false));
        dispatch(actions.usernameInUse(false));
        this.refs.username.style.border = 'none';
      }
      if (fullname.length === 0) {
        dispatch(actions.fullnameValid(false));
        this.refs.fullname.style.border = 'none';
      }
      if (email.length === 0) {
        dispatch(actions.emailValid(false));
        dispatch(actions.emailInUse(false));
        this.refs.email.style.border = 'none';
      }
      if (password.length === 0) {
        dispatch(actions.passwordValid(false));
        this.refs.password.style.border = 'none';
      }
      return;
    }

  }

  handleusernameCheck(){
    var {dispatch} = this.props;
    dispatch(actions.usernameCheck(true));
  }

  handleUsernameValidity(){
    var {dispatch, auth} = this.props;
    var username = this.refs.username.value;
    //post username to server api and get response back
    dispatch(actions.usernameCheck(false));

    if (username.length === 0) {
      dispatch(actions.usernameErrorMsg(false));
      dispatch(actions.usernameValid(false));
      dispatch(actions.usernameInValid(false));
      this.refs.username.style.border = 'none';
      return;
    }

    if (username !== '' && !(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(username))){
      dispatch(actions.usernameErrorMsg(false));
      dispatch(actions.usernameInValid(true));
      dispatch(actions.usernameValid(false));
      this.refs.username.style.border = '1px solid #D50000';
    } else if (username !== '' && (/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(username))){
      dispatch(actions.usernameErrorMsg(false));
      dispatch(actions.usernameValid(true));
      dispatch(actions.usernameInValid(false));
      this.refs.username.style.border = 'none';
    }

    if(auth.signUp.usernameInUse){
      dispatch(actions.usernameValid(false));
    }
  }

  handleFullnameValidity(){
    var {dispatch} = this.props;
    var fullname = this.refs.fullname.value;

    if (fullname.length === 0) {
      dispatch(actions.fullnameErrorMsg(false));
      dispatch(actions.emailValid(false));
      dispatch(actions.emailInValid(false));
      this.refs.fullname.style.border = 'none';
      return;
    }

    if (fullname !== '' && !(/^[a-zA-Z ]{2,30}$/.test(fullname))) {
      dispatch(actions.fullnameErrorMsg(false));
      dispatch(actions.fullnameInValid(true));
      dispatch(actions.fullnameValid(false));
      this.refs.fullname.style.border = '1px solid #D50000';
    } else if(fullname !== '' && (/^[a-zA-Z ]{2,30}$/.test(fullname))) {
      dispatch(actions.fullnameErrorMsg(false));
      dispatch(actions.fullnameValid(true));
      dispatch(actions.fullnameInValid(false));
      this.refs.fullname.style.border = 'none';
    }


  }

  handleEmailValidity(){
    var {dispatch} = this.props;
    var email = this.refs.email.value;

    if (email.length === 0) {
      dispatch(actions.emailErrorMsg(false));
      dispatch(actions.emailValid(false));
      dispatch(actions.emailInValid(false));
      this.refs.email.style.border = 'none';
      return;
    }

    if (email !== '' && !(/\S+@\S+\.\S+/.test(email))) {
      dispatch(actions.emailErrorMsg(false));
      dispatch(actions.emailInValid(true));
      dispatch(actions.emailValid(false));
      this.refs.email.style.border = '1px solid #D50000';
    } else if(email !== '' && (/\S+@\S+\.\S+/.test(email))) {
      dispatch(actions.emailErrorMsg(false));
      dispatch(actions.emailValid(true));
      dispatch(actions.emailInValid(false));
      this.refs.email.style.border = 'none';
    }
  }

  handlePasswordValidity(){
    var {dispatch} = this.props;
    var password = this.refs.password.value;

    if (password.length === 0) {
      dispatch(actions.passwordValid(false));
      this.refs.password.style.border = 'none';
      return;
    }

    if (password.length !==0 && password.length < 6) {
      dispatch(actions.passwordErrorMsg(false));
      dispatch(actions.passwordInValid(true));
      dispatch(actions.passwordValid(false));
      this.refs.password.style.border = '1px solid #D50000';
    } else if(password.length >= 6){
      dispatch(actions.passwordErrorMsg(false));
      dispatch(actions.passwordValid(true));
      dispatch(actions.passwordInValid(false));
      this.refs.password.style.border = 'none';
    }
  }


  onSuccess = (response) => {
    var {dispatch} = this.props;
    const token = response.headers.get('x-auth-token');
    response.json().then(user => {
      if (token) {
        localStorage.setItem('token', token);
        dispatch(actions.setAuthenticated(true));
        dispatch(push('/'));
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

              <div className="bc-input-group">
              <fieldset>
                  {this.props.auth.signUp.noUsername ? <p className='bc-input-error'>Required</p> : null}
                  {this.props.auth.signUp.usernameInValid ? <p className='bc-input-error'>Invalid Username</p> : null}
                  {this.props.auth.signUp.usernameValid ? <i className="fa fa-check bc-input-username-valid"></i> : null}
                  {this.props.auth.signUp.usernameInUse ? <p className='bc-input-error'>Username already exists</p> : null}
                  <input placeholder="User Id" ref='username' className="bc-input-username"
                         onChange={_.debounce(this.handleFieldChange.bind(this), 250)}
                         onBlur={this.handleUsernameValidity.bind(this)}
                         onFocus={this.handleusernameCheck.bind(this)} />
                </fieldset>

                <fieldset>
                  {this.props.auth.signUp.noFirstName ? <p className='bc-input-error'>Required</p> : null}
                  {this.props.auth.signUp.fullnameInValid ? <p className='bc-input-error'>Invalid</p> : null}
                  {this.props.auth.signUp.fullnameValid ? <i className="fa fa-check bc-input-fullname-valid"></i> : null}
                  <input placeholder="Full Name - FML" ref='fullname' className="bc-input-fullname"
                         onChange={this.handleFieldChange.bind(this)}
                         onBlur={this.handleFullnameValidity.bind(this)} />
                </fieldset>

              </div>

                <br/>


                <fieldset>
                  {this.props.auth.signUp.noEmail ? <p className='bc-input-error'>Email Required</p> : null}
                  {this.props.auth.signUp.emailInValid ? <p className='bc-input-error'>Email Invalid</p> : null}
                  {this.props.auth.signUp.emailValid ? <i className="fa fa-check bc-input-valid"></i> : null}
                  {this.props.auth.signUp.emailInUse ? <p className='bc-input-error'>Email is in use</p> : null}
                  <input placeholder="Email" ref='email' className="bc-input-style"
                         onChange={this.handleFieldChange.bind(this)}
                         onBlur={this.handleEmailValidity.bind(this)} />
                </fieldset>

                <br/>

                <fieldset>
                  {this.props.auth.signUp.noPassword ? <p className='bc-input-error'>Password minimun 6 characters</p> : null}
                  {this.props.auth.signUp.passwordInValid ? <p className='bc-input-error'>Password minimun 6 characters</p> : null}
                  {this.props.auth.signUp.passwordValid ? <i className="fa fa-check bc-input-valid"></i> : null}
                  {this.props.auth.signUp.serverUnreachable ? <p className='bc-input-error'>Server Unreachable :(</p> : null}
                  <input placeholder="Password" type="password" ref='password' className="bc-input-style"
                          onChange={this.handleFieldChange.bind(this)}
                          onBlur={this.handlePasswordValidity.bind(this)}/>
                </fieldset>

                <br/>

                { this.props.auth.signingIn
                  ? <button onClick={(e)=>e.preventDefault()}><i className="fa fa-spinner fa-pulse"></i></button>
                  : <button onClick={this.handleSignUp.bind(this)}>Sign Up</button> }

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

              <div className="bc-auth-signup-txt">Already a member ?
                <Link to={"/signin"}><span className="bc-auth-signup-lnk">Sign In</span></Link>
              </div>
              </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Redux.connect(
  (state) => {
    return {
      auth: state.auth
    }
  }
)(SignUp));
