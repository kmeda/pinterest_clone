import React,{Component} from 'react';
import * as Redux from 'react-redux';
import {BrowserRouter as Redirect, Router, Route, Switch, Link} from 'react-router-dom';
import { push } from 'react-router-redux';
import _ from 'lodash';
import axios from 'axios';
import Modal from 'react-modal';
var actions = require('../../actions/actions.js');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width: '400px',
    height: '300px',
    fontFamily: 'Fira sans',
    padding: '0',
    border: 'none'
  }
};

class MenuBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      modalIsOpen: false
    }
  }

  componentWillMount(){
    var {dispatch, auth} = this.props;
    if (auth.authenticated && !auth.user) {
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

  openModal() {
    this.setState({modalIsOpen: true});
  }
 
  afterOpenModal() {
        
  }
 
  closeModal() {
    this.setState({modalIsOpen: false});
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
              <a href='https://www.freecodecamp.org/challenges/build-a-pinterest-clone' target="_blank"><i className="bc-fcclogo fa fa-free-code-camp"></i></a>
            </div>
          <div className="links-container">
          <Link to='/signin'><div className={"bc-allbooks"}>Login</div></Link>
          </div>
        </div>
      </div>
    )
    }


    return (
      <div>
          <div className="bc-menu-bar">
            <div className="logo-container">
              <a href='https://www.freecodecamp.org/challenges/build-a-pinterest-clone' target="_blank"><i className="bc-fcclogo fa fa-free-code-camp"></i></a>
              </div>
            <div className="links-container">
              <Link to='/'><div className={this.props.allMintsActive + " bc-allbooks"}>Home</div></Link>
              <Link to="/profile">
                <div className={this.props.myMintsActive + " bc-profile"}>
                  <i className="bc-user-icon fa fa-user-circle" aria-hidden="true"></i>
                  {(Object.keys(this.props.auth.user)).length <= 1 ? "Profile" : this.props.auth.user.firstName }
                </div>
              </Link>
              
              <div className="bc-settings" onClick={this.openModal.bind(this)}>
                <i className="fa fa-cog" aria-hidden="true" ></i>
              </div>

              <Modal
                  isOpen={this.state.modalIsOpen}
                  onAfterOpen={this.afterOpenModal.bind(this)}
                  onRequestClose={this.closeModal.bind(this)}
                  style={customStyles}
                  contentLabel="Example Modal">
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
                      <button onClick={this.closeModal.bind(this)}>Close</button>
                  </form>
              </Modal>

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
