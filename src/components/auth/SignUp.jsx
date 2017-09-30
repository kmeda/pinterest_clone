import React,{Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Link, withRouter} from 'react-router-dom';
import * as Redux from "react-redux";
import _ from 'lodash';
import TwitterLogin from 'react-twitter-auth';

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

    var email = _.trim(this.refs.userEmail.value);
    var password = this.refs.password.value;
    var passwordConfirm = this.refs.passwordConfirm.value;
    let credentials = {email, password};

    if (email === '' || password === '' || passwordConfirm === '') {
      if (email === '') {
        dispatch(actions.emailErrorMsg(true));
      }
      if (password === '') {
        dispatch(actions.passwordErrorMsg(true));
      }
      return;
    }

    if (auth.signUp.emailValid && auth.signUp.passwordValid && auth.signUp.passwordConfirmed) {
      dispatch(actions.startSignUp(credentials));
    }

  }

  handleFieldChange(){
    var {dispatch} = this.props;
    var email = this.refs.userEmail.value;
    var password = this.refs.password.value;
    var passwordConfirm = this.refs.passwordConfirm.value;

    if (email.length === 0 || password.length === 0) {
      if (email.length === 0) {
        dispatch(actions.emailValid(false));
      }
      if (password.length === 0) {
        dispatch(actions.passwordValid(false));
      }
      return;
    }

    if (passwordConfirm === password) {
      dispatch(actions.passwordConfirmedInvalid(false));
      dispatch(actions.passwordConfirmed(true));
    }

  }

  handleEmailValidity(){
    var {dispatch} = this.props;
    var email = this.refs.userEmail.value;

    if (email.length === 0) {
      dispatch(actions.emailErrorMsg(false));
      dispatch(actions.emailValid(false));
      dispatch(actions.emailInValid(false));
      return;
    }

    if (email !== '' && !(/\S+@\S+\.\S+/.test(email))) {
      dispatch(actions.emailErrorMsg(false));
      dispatch(actions.emailInValid(true));
      dispatch(actions.emailValid(false));
    } else if(email !== '' && (/\S+@\S+\.\S+/.test(email))) {
      dispatch(actions.emailErrorMsg(false));
      dispatch(actions.emailValid(true));
      dispatch(actions.emailInValid(false));
    }
  }

  handlePasswordValidity(){
    var {dispatch} = this.props;
    var password = this.refs.password.value;

    if (password.length === 0) {
      dispatch(actions.passwordValid(false));
      return;
    }

    if (password.length !==0 && password.length < 6) {
      dispatch(actions.passwordErrorMsg(false));
      dispatch(actions.passwordInValid(true));
      dispatch(actions.passwordValid(false));
    } else if(password.length >= 6){
      dispatch(actions.passwordErrorMsg(false));
      dispatch(actions.passwordValid(true));
      dispatch(actions.passwordInValid(false));
    }
  }

  handlePasswordConfirmValidity(){
    //error case onBlur
    var {dispatch} = this.props;
    var password = this.refs.password.value;
    var passwordConfirm = this.refs.passwordConfirm.value;

    if (passwordConfirm !== password ) {
      dispatch(actions.passwordConfirmed(false));
      dispatch(actions.passwordConfirmedInvalid(true));
    }

  }

  onSuccess = (response) => {
    var {dispatch} = this.props;
    const token = response.headers.get('x-auth-token');
    console.log(response);
    response.json().then(user => {
      if (token) {
        dispatch(actions.setAuthenticated(true));
        localStorage.setItem('token', token);
        localStorage.setItem('email', user.email || '');
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
                <fieldset className="bc-input-style">
                  {this.props.auth.signUp.noEmail ? <p className='bc-input-error'>Email Required</p> : null}
                  {this.props.auth.signUp.emailInValid ? <p className='bc-input-error'>Email Invalid</p> : null}
                  {this.props.auth.signUp.emailValid ? <i className="fa fa-check bc-input-valid"></i> : null}
                  {this.props.auth.signUp.emailInUse ? <p className='bc-input-error'>Email is in use</p> : null}
                  <input placeholder="Email" ref='userEmail'
                         onChange={this.handleFieldChange.bind(this)}
                         onBlur={this.handleEmailValidity.bind(this)} />
                </fieldset>

                <br/>

                <fieldset className="bc-input-style">
                  {this.props.auth.signUp.noPassword ? <p className='bc-input-error'>Password minimun 6 characters</p> : null}
                  {this.props.auth.signUp.passwordInValid ? <p className='bc-input-error'>Password minimun 6 characters</p> : null}
                  {this.props.auth.signUp.passwordValid ? <i className="fa fa-check bc-input-valid"></i> : null}
                  <input placeholder="Password" type="password" ref='password'
                          onChange={this.handleFieldChange.bind(this)}
                          onBlur={this.handlePasswordValidity.bind(this)}/>
                </fieldset>

                <br/>

                <fieldset className="bc-input-style">

                    {this.props.auth.signIn.invalidCredentials ? <p className='bc-auth-error'>{this.props.auth.signIn.invalidCredentials}</p> : null}
                    {this.props.auth.signUp.passwordConfirmed ? <i className="fa fa-check bc-input-valid"></i> : null}
                    {this.props.auth.signUp.passwordConfirmedInvalid ? <i className="fa fa-times bc-input-invalid"></i> : null}

                  <input placeholder="Confirm Password" type="password" ref='passwordConfirm'
                         onChange={this.handleFieldChange.bind(this)}
                         onBlur={this.handlePasswordConfirmValidity.bind(this)}/>
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
