import React,{Component} from 'react';
import MenuBar from './MenuBar.jsx';
import * as Redux from "react-redux";
import TimeAgo from 'react-timeago';


var actions = require('../../actions/actions.js');

class Profile extends Component {
  constructor(props){
    super(props);
    this.state = { setClass: null, hover: false };
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

    return (
      <div className="bc-outer-wrapper">
        <MenuBar myMintsActive={this.state.setClass}/>
        <div className="bc-books-container">
          <div className="bc-books-requests-header">My Mints Go Here...</div>

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
