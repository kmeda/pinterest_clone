import MenuBar from './MenuBar.jsx';
import React,{Component} from 'react';
import * as Redux from "react-redux";
import { push } from 'react-router-redux';

import openSocket from 'socket.io-client';

if (process.env.NODE_ENV === 'production') {
  var socket_url = 'https://fcc-minterest.herokuapp.com';
} else {
  var socket_url = 'http://localhost:3050';
}

const socket = openSocket(socket_url);

var actions = require('../../actions/actions.js');

class ThisUser extends Component {
  constructor(props){
    super(props);
    this.state = { setClass: null, hover: false };

    socket.on('fetch_this_user_mints', ()=>{
      var {dispatch} = this.props;
      var username = this.props.match.params.userid;
      dispatch(actions.fetchThisUserMints(username));
    });

  }


  componentWillMount(){
    var {dispatch} = this.props;
    var username = this.props.match.params.userid
    dispatch(actions.fetchThisUserMints(username));
  }

  componentDidMount(){
    this.setState({setClass: "bc-allmints-active"});
  }


  handleLike(mint){
    var {dispatch, auth} = this.props;

    var {uid, username} = mint;
    var payload = {uid, username};
    if (!auth.authenticated) {
      dispatch(push('/signin'));
      return;
    }

    if (_.includes(mint.likes, this.props.auth.user.username)) {
      // dispatch remove action
      dispatch(actions.updateDislikes(payload));
      console.log("remove");
    } else {
      // dispatch add like action
      dispatch(actions.updateLikes(payload));
      console.log("add");
    }
  }


  render(){

    var thisUserMints = this.props.mints.thisUserMints;
        thisUserMints = thisUserMints.sort((a,b) => {
          return b.timestamp - a.timestamp;
        });

    var childElementsUnauth = thisUserMints.map((item, index) => {
      return (
           <div key={index} className="bc-img-grid">
               <img src={item.url} />
               <div className="bc-mint-attr">
                  <div className="bc-mint-title">{item.title}</div>
                  <div className="bc-mint-user-likes">
                    <div className="bc-mint-username">
                      <i className="bc-mint-username-link-disabled">{item.username}</i>
                    </div>
                    <div className="bc-mint-like">
                      <i
                        className={"bc-heart fa fa-heart"}
                        onClick={this.handleLike.bind(this, item)}>
                      </i>
                      <span>{item.likes.length}</span>
                    </div>
                  </div>
               </div>
           </div>
       );
   });

    if (!this.props.auth.user) {
      return (
        <div className="bc-outer-wrapper">
          <MenuBar allMintsActive={this.state.setClass}/>
          <div className="bc-mints-wrapper">
            <div className="bc-mints-columns">
              {childElementsUnauth}
            <div/>
          </div>
        </div>
        </div>
      )
    }

    var childElements = thisUserMints.map((item, index) => {
      return (
           <div key={index} className="bc-img-grid">
               <img src={item.url} />
               <div className="bc-mint-attr">
                  <div className="bc-mint-title">{item.title}</div>
                  <div className="bc-mint-user-likes">
                    <div className="bc-mint-username">
                      <i className="bc-mint-username-link-disabled">{item.username}</i>
                    </div>
                    <div className="bc-mint-like">
                      {
                        _.includes(item, this.props.auth.user.username)
                        ? <i className="bc-heart-disabled fa fa-heart"></i>
                        : <i
                          className={_.includes(item.likes, this.props.auth.user.username) ? "bc-heart bc-heart-liked fa fa-heart" : "bc-heart fa fa-heart"}
                          onClick={this.handleLike.bind(this, item)}>
                        </i>
                      }
                      <span>{item.likes.length}</span>
                    </div>
                  </div>
               </div>
           </div>
       );
   });


  //   var childElements = this.props.mints.thisUserMints.map((item, index) => {
  //     return (
  //          <div key={index} className="bc-img-grid">
  //              <img src={item.url} />
  //              <div className="bc-mint-attr">
  //                 <div className="bc-mint-title">{item.title}</div>
  //                 <div className="bc-mint-user-likes">
  //                   <div className="bc-mint-username"><i>{item.username}</i></div>
  //                   <div className="bc-mint-like"><i className="bc-heart fa fa-heart" onClick={this.handleLike.bind(this, item.uid)}></i> <span>{item.likes.length}</span></div>
  //                 </div>
  //              </div>
  //          </div>
  //      );
  //  });

    return (
      <div className="bc-outer-wrapper">
        <MenuBar allMintsActive={this.state.setClass}/>
        <div className="bc-mints-wrapper">
          <div className="bc-mints-columns">
            {childElements}
          <div/>
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
      mints: state.mints
    }
  }
)(ThisUser);
