import React,{Component} from 'react';
import * as Redux from 'react-redux';
import {BrowserRouter as Redirect, Router, Route, Switch, Link} from 'react-router-dom';
import { push } from 'react-router-redux';
import _ from 'lodash';
import axios from 'axios';
var actions = require('../../actions/actions.js');

class MenuBar extends Component {
  constructor(props){
    super(props);

  }

  componentWillMount(){
    var {dispatch, auth} = this.props;
    if (!auth.user) {
      var email = localStorage.getItem("email");
      dispatch(actions.fetchUserDetails(email));
    }
  }

  componentWillUnmount(){
    var {dispatch, settings} = this.props;
    if (settings.showSettings) {
      dispatch(actions.showSettings(false));
    }
  }

  showSettings(){
    var {dispatch, settings} = this.props;
    settings.showSettings ? dispatch(actions.showSettings(false)) : dispatch(actions.showSettings(true));
  }

  saveSettings(e){
    e.preventDefault();
    var {dispatch, auth} = this.props;

    var email = localStorage.getItem("email");
    var firstName = _.trim(this.refs.firstname.value);
    var lastName = _.trim(this.refs.lastname.value);
    var location = _.trim(this.refs.location.value);

    if (firstName === '' || lastName === '' || location === '') {
      return;
    }
    var settings = {email, firstName, lastName, location};
    dispatch(actions.saveUserSettings(settings));
  }

  signOutUser(){
    var {dispatch} = this.props;
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    dispatch(actions.nukeAuthData());
    dispatch(push('/'));
  }

  render(){

    if (!this.props.auth.user) {
      return (
      <div>
          <div className="bc-menu-bar">
            <div className="logo-container">
              <a href='https://www.freecodecamp.org/challenges/build-a-pinterest-clone' target="_blank"><img className="bc-fcclogo"/></a>
            </div>
          <div className="links-container">
          <Link to='/home'><div className={this.props.allBooksActive + " bc-allbooks"}>Login</div></Link>
          </div>
        </div>
      </div>
    )
    }

    var renderSettingsBox = () => {
      return (
        <div className="bc-settings-box">
            <form className="bc-settings-form">
              <div>Profile Settings</div>
              <br/>
              <input className="bc-settings-input" type="text" placeholder={(Object.keys(this.props.auth.user)).length <= 1 ? "First Name" : "First Name -" + this.props.auth.user.firstName} ref="firstname"/>
              <input className="bc-settings-input" type="text" placeholder={(Object.keys(this.props.auth.user)).length <= 1 ? "Last Name" : "Last Name -" + this.props.auth.user.lastName} ref="lastname"/>
              <input className="bc-settings-input" type="text" placeholder={(Object.keys(this.props.auth.user)).length <= 1 ? "Location" : "Location -" + this.props.auth.user.location} ref="location"/>
                <br/>
                {
                  this.props.settings.saveSettings ?
                  <button onClick={(e)=>e.preventDefault()}><i className="fa fa-spinner fa-pulse"></i></button> :
                  <button onClick={this.saveSettings.bind(this)}>Save</button>
                }
            </form>
        </div>
      )
    }


    return (
      <div>
          <div className="bc-menu-bar">
            <div className="logo-container">
                <a href='https://www.freecodecamp.org/challenges/build-a-pinterest-clone' target="_blank"><img className="bc-fcclogo"/></a>
              </div>
            <div className="links-container">
            <Link to='/'><div className={this.props.myBooksActive + " bc-allbooks"}>Home</div></Link>

            <div className="bc-profile">
              {(Object.keys(this.props.auth.user)).length <= 1 ? null : this.props.auth.user.firstName }
            </div>

            <div className={this.props.settings.showSettings ? "bc-settings bc-settings-clicked" : "bc-settings" }
                onClick={this.showSettings.bind(this)}>
              <i className="fa fa-cog" aria-hidden="true" >
                {(Object.keys(this.props.auth.user)).length <= 1 ? <div className="bc-settings-alert"><i className="fa fa-exclamation" aria-hidden="true"></i></div> : null }
              </i>
            </div>
            {this.props.settings.showSettings ? renderSettingsBox() : null}

            <div className="bc-signout"><i className="bc-animate-logout fa fa-sign-out" aria-hidden="true" onClick={this.signOutUser.bind(this)}></i></div>
            </div>
          
          
          

        </div>
      </div>
    )
  }
}

export default Redux.connect(
  (state) => {
    return {
      auth: state.auth,
      settings: state.settings
    }
  }
)(MenuBar);
