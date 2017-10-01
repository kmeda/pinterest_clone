import React,{Component} from 'react';
import * as Redux from "react-redux";
import Modal from 'react-modal';
import _ from 'lodash';
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
    var {dispatch} = this.props;
    e.preventDefault();
    var title = this.refs.imageTitle.value;
    var imageURL = this.refs.imagePreview.value;

    if (_.trim(title).length <=0 && _.trim(imageURL).length <= 0) {
      this.refs.imagePreview.style.border = '1px solid #D50000';
      this.refs.imageTitle.style.border = '1px solid #D50000';
    }
    
    if (_.trim(title).length >=0 && _.trim(imageURL).length <= 0) {
      this.refs.imagePreview.style.border = '1px solid #D50000';
    }

    if (_.trim(title).length <=0 && _.trim(imageURL).length > 0) {
      this.refs.imageTitle.style.border = '1px solid #D50000';
    }

    if (_.trim(title).length > 0 && _.trim(imageURL).length > 0) {
      console.log({title, imageURL});
      this.setState({modalIsOpen: false});
      return;
    }


    
    
  }
//http://orig13.deviantart.net/d632/f/2014/325/9/c/9c2f55cab2a77d16b3aad1e7cb2a997b-d87525z.jpg
  render(){

    var childElements = this.state.images.map(function(element, index){
      return (
           <div key={index} className="bc-img-grid">
               <img src={element} />
               <div className="bc-mint-attr">
                  <div className="bc-mint-title">Mirana Cosplay</div>
                  <div className="bc-mint-user-likes">
                    <div className="bc-mint-username"><i>kmeda9</i></div>
                    <div className="bc-mint-like"><i className="fa fa-heart"></i> <span>120</span></div>
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
              <button className="modal-input-btn" onClick={this.handleImageAdd.bind(this)}>Ok</button>
              <button className= "modal-input-btn modal-close" onClick={this.closeModal.bind(this)}>Cancel</button>
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

