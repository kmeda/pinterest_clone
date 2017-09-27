import React, { Component } from 'react';
import * as Redux from 'react-redux';
import { push } from 'react-router-redux';

export default function(ComposedComponent) {
  class Authentication extends Component {

    componentWillMount() {
      var {dispatch} = this.props;
      
      if (!this.props.auth.authenticated) {
        dispatch(push('/signin'));
      }

    }

    componentWillUpdate(nextProps) {
      var {dispatch} = this.props;

      if (!nextProps.auth.authenticated) {
        dispatch(push('/signin'));
      }
    }

    render() {

      return <ComposedComponent {...this.props} />
    }
  }


  return Redux.connect(
    (state) => {
      return {
        auth: state.auth
      }
    }
  )(Authentication);
}
