import React,{Component} from 'react';
import MenuBar from './MenuBar.jsx';
import * as Redux from "react-redux";
import TimeAgo from 'react-timeago';


var actions = require('../../actions/actions.js');

class Home extends Component {
  constructor(props){
    super(props);

  }


  componentWillMount(){
    var {dispatch} = this.props;
  }

  componentDidMount(){

  }

  componentWillUnmount(){

  }


  render(){

    return (
      <div className="bc-outer-wrapper">
        <MenuBar/>
        <div className="bc-books-container">
          <div className="bc-books-requests-header">All Pins Go Here...</div>

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
)(Home);
