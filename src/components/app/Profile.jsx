import React,{Component} from 'react';
import * as Redux from "react-redux";

import MenuBar from './MenuBar.jsx';

var actions = require('../../actions/actions.js');


let images = [];
const imgId = [1011, 883, 1074, 823, 64, 65, 839, 314, 256, 316, 92, 643, 432, 23,45,99, 199];
for(let i = 0; i< imgId.length; i++){
	const ih = 350 + Math.floor(Math.random()*15)*15;
	images.push("https://unsplash.it/250/" + ih + "?image=" + imgId[i]);
}

class Profile extends Component {
  constructor(props){
    super(props);
    
    this.state = { 
      setClass: null, 
      hover: false
    };
   
  }

  componentWillMount(){
    var {dispatch} = this.props;
  }

  componentDidMount(){
    this.setState({setClass: "bc-mymints-active"});
  }

  componentWillUnmount(){
  }
  
  render(){

    var childElements = images.map(function(element, index){
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
               <img src="https://i.pinimg.com/originals/b5/24/c7/b524c7a54010df6ee096128c78f5d78d.jpg" />
           </div>
            <br/>
            <br/>
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
      books: state.books
    }
  }
)(Profile);

