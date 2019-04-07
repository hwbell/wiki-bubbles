import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import posed from 'react-pose';

// components
import MainPage from './components/MainPage';
import Navigator from './components/Navigator';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // 
    }

  }

  componentDidMount () {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  render() {
    return (
      <div className="">

        <hr style={styles.hr} id="top"></hr>
        
        <Navigator/>

        <MainPage/>
      
      </div>
    );
  }
}

const styles = {
  hr: {
    borderColor: 'white',
    margin: '0px'
  }
}

export default App;
