import MenuBar from './MenuBar.jsx';
import React,{Component} from 'react';
import * as Redux from "react-redux";
import TimeAgo from 'react-timeago';


var actions = require('../../actions/actions.js');

class AllMints extends Component {
  constructor(props){
    super(props);
    this.state = { setClass: null, hover: false };
  }


  componentWillMount(){
    var {dispatch} = this.props;

  }

  componentDidMount(){
    this.setState({setClass: "bc-allmints-active"});
  }

  componentWillUnmount(){

  }


  render(){

    return (
      <div className="bc-outer-wrapper">
        <MenuBar allMintsActive={this.state.setClass}/>
        <div className="bc-mints-container">
          <div className="bc-books-requests-header">All Mints Go Here...</div>

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
)(AllMints);
