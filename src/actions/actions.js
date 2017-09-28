import axios from 'axios';
import { push } from 'react-router-redux';
import _ from "lodash";

import socket from '../app.jsx';

if (process.env.NODE_ENV === 'production') {
  var base_url = 'https://fcc-minterest.herokuapp.com';
} else {
  var base_url = 'http://localhost:3050';
}


module.exports
// SignIn Actions
export var signingInUser = (flag) => {
  return {
    type: "SIGNING_IN_USER",
    flag
  }
}

export var invalidEmailorPasswordError = (alert) => {
  return {
    type: "INVALID_EMAIL_PASSWORD_ERROR",
    alert
  }
}

export var emptyEmailError = () => {
  return {
    type: "EMPTY_EMAIL_ERROR"
  }
}

export var emptyPasswordError = () => {
  return {
    type: "EMPTY_PASSWORD_ERROR"
  }
}

export var clearErrorMsg = () => {
  return {
    type : "CLEAR_ERROR_MSG"
  }
}


export var setAuthenticated = (flag) => {
  return {
    type: "SET_AUTH_USER",
    flag
  }
}

export var nukeAuthData = () => {
  return {
    type: "NUKE_AUTH_DATA"
  }
}

export var startSignIn = (credentials) => {
  return (dispatch, getState) => {

    dispatch(signingInUser(true));


    axios.post(`${base_url}/signin_user`, JSON.stringify(credentials)).then((res)=>{
      if (res.data.token) {
        localStorage.setItem('email', credentials.email);
        localStorage.setItem('token', res.data.token);
        dispatch(setAuthenticated(true));
        dispatch(signingInUser(false));
        dispatch(push('/'));
      }
    }).catch((e) => {
      dispatch(signingInUser(false));
      if (e.response) {
        console.log(e);
        if (e.response.data === "Unauthorized") {
          dispatch(invalidEmailorPasswordError("Invalid Email or Password"));
        }
      } else {
        dispatch(invalidEmailorPasswordError("Server unreachable :("));
      }
    });
  }
}


// SignUp Actions

export var emailErrorMsg = (flag) => {
  return {
    type: "EMAIL_ERROR_MSG",
    flag
  }
}

export var passwordErrorMsg = (flag) => {
  return {
    type: "PASSWORD_ERROR_MSG",
    flag
  }
}

export var emailInValid = (flag) => {
  return {
    type: "EMAIL_INVALID",
    flag
  }
}

export var emailValid = (flag) => {
  return {
    type: "EMAIL_VALID",
    flag
  }
}

export var passwordInValid = (flag) => {
  return {
    type: "PASSWORD_INVALID",
    flag
  }
}

export var passwordValid = (flag) => {
  return {
    type: "PASSWORD_VALID",
    flag
  }
}

export var passwordConfirmed = (flag) => {
  return {
    type: "PASSWORD_CONFIRMATION",
    flag
  }
}

export var passwordConfirmedInvalid = (flag) => {
  return {
    type: "PASSWORD_CONFIRMATION_INVALID",
    flag
  }
}

export var startSignUp = (credentials) => {
  return (dispatch, getState) => {
    dispatch(signingInUser(true));
    axios.post(`${base_url}/signup_user`, JSON.stringify(credentials)).then((res)=>{

      if (res.data.token) {
        localStorage.setItem('email', credentials.email);
        localStorage.setItem('token', res.data.token);
        dispatch(clearErrorMsg());
        dispatch(setAuthenticated(true));
        dispatch(push('/'));
      } else if (res.data.error === "Email is in use") {
        dispatch(signingInUser(false));
        dispatch(invalidEmailorPasswordError(res.data.error));
      }
    }).catch((e) => {
      // handle dispatch error state
      dispatch(signingInUser(false));
      dispatch(invalidEmailorPasswordError("Server unreachable :("));
      console.log(e);
    });
  }
}

export var setUserDetails = (payload) => {
  return {
    type: "SET_USER_DETAILS",
    payload
  }
}

export var fetchUserDetails = (email) => {
  return (dispatch, getState) => {

    axios.get(`${base_url}/get_user?email=${email}`).then((res) => {
      dispatch(setUserDetails(res.data));
    }).catch((e)=>console.log(e));
  }
}



// Settings Reducer
export var showSettings = (flag) => {
  return {
    type: "SHOW_SETTINGS",
    flag
  }
}

export var saveSettings = (flag) => {
  return {
    type: "SAVE_SETTINGS",
    flag
  }
}


export var saveUserSettings = (settings) => {
  return(dispatch, getState) => {

    //set save progress
    dispatch(saveSettings(true));


    var headers = {
           "Content-Type": "application/json",
           'Accept' : 'application/json',
           "authorization": localStorage.getItem('token')
       }


    axios.post(`${base_url}/update_user`, JSON.stringify(settings), headers).then((res)=>{
        dispatch(setUserDetails(settings));
        dispatch(saveSettings(false));
        dispatch(showSettings(false));
      });
  }
}
