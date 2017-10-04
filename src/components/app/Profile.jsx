import React,{Component} from 'react';
import * as Redux from "react-redux";
import Modal from 'react-modal';
import _ from 'lodash';
import MenuBar from './MenuBar.jsx';
import imagePlaceholder from '../../assets/no-image-available.png';

import openSocket from 'socket.io-client';

if (process.env.NODE_ENV === 'production') {
  var socket_url = 'https://fcc-minterest.herokuapp.com';
} else {
  var socket_url = 'http://localhost:3050';
}

const socket = openSocket(socket_url);

var actions = require('../../actions/actions.js');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width: '550px',
    height: 'auto',
    fontFamily: 'Fira sans',
    padding: '0',
    border: 'none'
  }
};

class Profile extends Component {
  constructor(props){
    super(props);

    this.state = {
      setClass: null,
      hover: false,
      modalIsOpen: false,
      modalImagePreview: ''
    };

    socket.on('fetch_my_mints', ()=>{
      var {dispatch} = this.props;
        dispatch(actions.fetchMyMints());
    });

  }

  componentWillMount(){
    var {dispatch} = this.props;
      dispatch(actions.fetchMyMints());
  }

  componentDidMount(){
    var {dispatch} = this.props;
    this.setState({setClass: "bc-mymints-active"});

  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {

    this.setState({modalImagePreview: ""});
    this.refs.title.style.textAlign = 'center';
    this.refs.title.style.fontFamily = 'Fira sans';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleImagePreview(){
    var image = this.refs.imagePreview.value;
    if(image.length > 0){
      this.refs.imagePreview.style.border = '1px solid #FAFAFA';
    }
    this.refs.imgContainer.style.display = 'flex';
    this.setState({modalImagePreview: image});
  }

  handleTitle(){
    var title = this.refs.imageTitle.value;
    if(title.length > 0){
      this.refs.imageTitle.style.border = '1px solid #FAFAFA';
    }
  }

  handleImageAdd(e){
    var {dispatch, auth} = this.props;
    e.preventDefault();
    var title = this.refs.imageTitle.value;
    var imageURL = this.refs.imagePreview.value;

    if (_.trim(title).length <=0 || _.trim(imageURL).length <= 0 || _.trim(imageURL).match(/\.(jpeg|jpg|gif|png)$/) === null){
      if (_.trim(title).length <=0) {
        this.refs.imageTitle.style.border = '1px solid #D50000';
      }
      if (_.trim(imageURL).length <= 0 || _.trim(imageURL).match(/\.(jpeg|jpg|gif|png)$/) === null) {
        this.refs.imagePreview.style.border = '1px solid #D50000';
      }

    }

    if (_.trim(title).length > 0 && _.trim(imageURL).match(/\.(jpeg|jpg|gif|png)$/) !== null) {
      var payload = {title, imageURL};
      console.log(payload);
      dispatch(actions.saveMintToDB(payload));
      this.setState({modalIsOpen: false});
      return;
    }

  }

  handleDeleteMint(uid){
    var {dispatch} = this.props;
      dispatch(actions.deleteMint(uid));
  }

  imgError(e){
    e.target.src= imagePlaceholder;
  }

  render(){

    var myMints = this.props.mints.myMints;
        myMints = myMints.sort((a,b) => {
          return b.timestamp - a.timestamp;
        });

    var childElements = myMints.map((item, index) => {
      return (
           <div key={index} className="bc-img-grid">
               <img src={item.url} onError={this.imgError.bind(this)}/>
               <div className="bc-mint-attr">
                  <div className="bc-mint-title">{item.title}</div>
                  <div className="bc-mint-user-likes">
                    <div className="bc-mint-username"><i className="bc-mint-username-link-disabled">{item.username}</i></div>
                    <div className="bc-mint-like"><i className="bc-heart-disabled fa fa-heart"></i><span>{item.likes.length}</span></div>
                    <div className="bc-mint-delete"><i className="bc-delete fa fa-times" onClick={this.handleDeleteMint.bind(this, item.uid)}></i></div>
                  </div>
               </div>
           </div>
       );
   });


    return (
      <div className="bc-outer-wrapper">
        <MenuBar myMintsActive={this.state.setClass}/>

      <div className="bc-mints-wrapper">
          <div className="bc-add-mint">
            <div className="bc-minion">
              <img src="https://i.pinimg.com/originals/b5/24/c7/b524c7a54010df6ee096128c78f5d78d.jpg" />
              <div className="bc-add-mints" onClick={this.openModal.bind(this)}><i>+</i></div>
              <div className="bc-add-mints-text">Save Mint</div>
            </div>
          </div>
          <br/>
          <div className="bc-mints-columns">
            {childElements}
          <div/>

          <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal.bind(this)}
          onRequestClose={this.closeModal.bind(this)}
          style={customStyles}
          contentLabel="Example Modal"
        >

          <div className="modal-title" ref="title">Add a new Mint</div>
          <br/>
          <div ref= "imgContainer" className="modal-image-container"><img src={this.state.modalImagePreview} alt=" "/></div>
          <br/>
          <form>
            <input className="modal-input" placeholder="Title" onChange={this.handleTitle.bind(this)} ref="imageTitle"/>
            <i className="modal-link-icon fa fa-header" aria-hidden="true"></i>

            <br/>
            <br/>
            <input className="modal-input" placeholder="Image source link" onChange={this.handleImagePreview.bind(this)} ref="imagePreview"/>
            <i className="modal-link-icon fa fa-link" aria-hidden="true"></i>
            <br/>
            <br/>
            <div className="modal-button-group">
              <button className="modal-input-btn" onClick={this.handleImageAdd.bind(this)}>Save & Exit</button>
              <button className= "modal-input-btn modal-close" onClick={this.closeModal.bind(this)}>Close</button>
            </div>

          </form>
        </Modal>

      </div>
      </div>
      </div>
    )
  }
}

export default Redux.connect(
  (state) => {
    return {
      mints: state.mints
    }
  }
)(Profile);
