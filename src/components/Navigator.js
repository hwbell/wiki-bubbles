import React from 'react';

// styling
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';

import AnchorLink from 'react-anchor-link-smooth-scroll'

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
              <AnchorLink href="#search">Search</AnchorLink>
            </div>
            <div style={styles.navLink} className="nav-link">
              <AnchorLink href="#tophits">Top Hits</AnchorLink>
            </div>
          </div>


        </div>
    );
  }
}

const styles = {
  main: {
    width: '100%',
    margin: '0px auto',
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