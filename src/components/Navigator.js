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

        <div style={styles.titleHolder} className="text-center row">
          <div className="col">
            <div className="row" style={styles.combinedTitle}>
              <div className="">
                <i style={styles.icon} className="fab fa-wikipedia-w"></i>
              </div>
              <div className="" className="nav-title">
                <p style={styles.title}>ikipedia</p>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="row" style={styles.linkHolder}>
              <div style={styles.navLink} className="col">
                <AnchorLink href="#search" className="nav-link">Search</AnchorLink>
              </div>
              <div style={styles.navLink} className="col">
                <AnchorLink href="#tophits" className="nav-link">Trending</AnchorLink>
              </div>
            </div>
          </div>
        </div>


      </div>
    );
  }
}

const styles = {
  main: {
    width: '100%',
    // margin: '0px auto',
    backgroundColor: 'white'
  },
  titleHolder: {
    // width: '100%',
    // margin: 'auto auto',
    marginTop: '15px'
  },
  combinedTitle: {
    // border: '1px solid black',
    padding: '0px',
    paddingLeft: '20px',
    minWidth: '130px'
  },
  icon: {
    fontSize: '45px'
  },
  title: {
    fontSize: 'calc(14px + 1vw)',
    padding: '0px',
    paddingTop: '8px',
    // paddingRight: '8px'
  },
  linkHolder: {
    // border: '1px solid black',
    minWidth: ''
  },
  navLink: {
    // border: '1px solid black',
    textAlign: 'left',
    width: '10vw',
    fontSize: 'calc(14px + 1vw)',
    padding: '0px',
    margin: '0px',
  }
}