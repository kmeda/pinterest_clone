import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Redirect, Router, Route, Switch, Link} from 'react-router-dom';
import {Provider} from "react-redux";

import RequireAuth from './components/auth/require_auth.jsx';
import SignIn from './components/auth/SignIn.jsx';
import SignUp from './components/auth/SignUp.jsx';
import Profile from './components/app/Profile.jsx';
import AllMints from './components/app/AllMints.jsx';
import ThisUser from './components/app/ThisUser.jsx';

import * as actions from './actions/actions.js';

import '../styles/main.scss';

import * as Redux from 'redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux';



// Configure Redux Store ______________________________________________ //
import {  authReducer, settingsReducer, mintsReducer } from './reducers/reducers.js';

const history = createHistory();
const middleware = routerMiddleware(history);

const store = Redux.createStore(
  Redux.combineReducers({
    auth: authReducer,
    settings: settingsReducer,
    mints: mintsReducer,
    router: routerReducer
  }),
  Redux.compose(
    Redux.applyMiddleware(thunk, middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
)
// ____________________________________________________________________ //


// Authenticate TRUE if localStorage has a token and email //
if (localStorage.getItem("token")) {
  store.dispatch(actions.setAuthenticated(true));
}


ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={AllMints}/>
          <Route path="/user/:userid" component={ThisUser}/>
          <Route exact path="/profile" component={RequireAuth(Profile)}/>
          <Route exact path="/signup" component={SignUp}/>
          <Route exact path="/signin" component={SignIn}/>
          <Route render={()=> <h1>Page not found.</h1>}/>
        </Switch>
      </Router>
    </Provider>,
  document.getElementById('root'));
