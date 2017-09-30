import React,{Component} from 'react';
import * as Redux from "react-redux";
import Modal from 'react-modal';

import MenuBar from './MenuBar.jsx';

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
    height: '600px',
    fontFamily: 'Fira sans'
  }
};

class Profile extends Component {
  constructor(props){
    super(props);
    
    this.state = { 
      setClass: null, 
      hover: false,
      modalIsOpen: false,
      modalImagePreview: '',
      images : []
    };
  }

  componentWillMount(){
    var {dispatch} = this.props;
    
    let images = [];
    const imgId = [1011, 883, 1074, 823, 64, 65, 839, 314, 256, 316, 92, 643, 432, 23,45,99, 199];
    for(let i = 0; i< imgId.length; i++){
      const ih = 350 + Math.floor(Math.random()*15)*15;
      images.push("https://unsplash.it/250/" + ih + "?image=" + imgId[i]);
    }

    this.setState({images: this.state.images.concat(images)});

  }

  componentDidMount(){
    this.setState({setClass: "bc-mymints-active"});
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }
 
  afterOpenModal() {
    
    this.setState({modalImagePreview: ""});
    this.subtitle.style.textAlign = 'center';
    this.subtitle.style.fontFamily = 'Fira sans';
  }
 
  closeModal() {
    this.setState({modalIsOpen: false});
  }
  
  handleImagePreview(){
    var image = this.refs.imagePreview.value;
    this.setState({modalImagePreview: image});
  }

  handleImageAdd(e){
    e.preventDefault();
    var image = this.refs.imagePreview.value;
    if (image.length<=0) {
      this.setState({modalIsOpen: false});
      return;
    }
    var images = this.state.images;
    images.unshift(image);
    this.setState({images: images, modalIsOpen: false});
  }

  render(){

    var childElements = this.state.images.map(function(element, index){
      return (
           <div key={index} className="bc-img-grid">
               <img src={element} />
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
 
          <h2 ref={subtitle => this.subtitle = subtitle}>Add a new Mint</h2>
          <hr/>
          <i className= "modal-close fa fa-times" onClick={this.closeModal.bind(this)}></i>
          <div className="modal-image-container"><img src={this.state.modalImagePreview} alt=" "/></div>
          <br/>
          <form>
            <input className="modal-input" placeholder="Title" ref="imageTitle"/>
            <br/>
            <br/>
            <input className="modal-input" placeholder="Image source link" onChange={this.handleImagePreview.bind(this)} ref="imagePreview"/>
            <br/>
            <br/>
            <button className="modal-input-btn" onClick={this.handleImageAdd.bind(this)}>Add</button>
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

