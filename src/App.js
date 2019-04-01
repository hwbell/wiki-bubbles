import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import posed from 'react-pose';

// components
import SearchPage from './components/SearchPage';
import Navigator from './components/Navigator';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // 
    }

  }

  render() {
    return (
      <div className="container">
        
        <Navigator/>

        <SearchPage/>
      
      </div>
    );
  }
}

export default App;
// 