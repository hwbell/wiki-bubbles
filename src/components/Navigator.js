import React from 'react';
import {
  Button
} from 'reactstrap';

// styling
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

export default class Navigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 
    };
  }

  componentDidMount() {

  }

  render() {

    return (

        <div className="container fixed-top" style={styles.main}>

          <div style={styles.titleHolder} className="row">
            <div className="">
              <i style={styles.icon} className="fab fa-wikipedia-w"></i>
            </div>
            <div style={styles.title} className="nav-title">
              <p>ikipedia</p>
            </div>

            <div style={styles.navLink} className="nav-link">
              <p>Search</p>
            </div>
            <div style={styles.navLink} className="nav-link">
              <p>Top Hits</p>
            </div>
          </div>


        </div>
    );
  }
}

const styles = {
  main: {
    width: '100%',
    margin: '10px auto',
    backgroundColor: 'rgba(255,255,255,1)'
  },
  titleHolder: {
    width: '80%',
    margin: 'auto auto',
    marginTop: '10px'
  },
  icon: {
    fontSize: '45px'
  },
  title: {
    fontSize: '22px',
    padding: '8px',
    paddingLeft: '0px'
  },
  navLink: {
    fontSize: '22px',
    padding: '8px',
    marginLeft: '30px',
    color: ''
  }
}