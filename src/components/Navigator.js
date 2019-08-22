import React from 'react';

// styling
import '../App.css';
import 'bootstrap/dist/css/bootstrap.css';
// for media queries
import Media from 'react-media';

import AnchorLink from 'react-anchor-link-smooth-scroll'
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class Navigator extends React.Component {
  constructor(props) {
    super(props);
    this.renderLinks = this.renderLinks.bind(this);
    this.renderDropDown = this.renderDropDown.bind(this);
    this.toggle = this.toggle.bind(this);

    this.state = {
      // 
    };

  }

  renderLinks() {
    return (
      <div className="col-8">
        <div className="row" style={styles.linkHolder}>
          <div className="col-3">
            <AnchorLink offset='50' style={styles.navLink} href="#search" className="nav-link">Search</AnchorLink>
          </div>
          <div className="col-3">
            <AnchorLink offset='50' style={styles.navLink} href="#tophits" className="nav-link">Trending</AnchorLink>
          </div>
          <div className="col-3">
            <AnchorLink offset='50' style={styles.navLink} href="#topcountries" className="nav-link">Countries</AnchorLink>
          </div>
          <div className="col-3">
            <AnchorLink offset='50' style={styles.navLink} href="#topeditors" className="nav-link">Editors</AnchorLink>
          </div>
        </div>
      </div>
    )
  }

  renderDropDown() {
    return (
      <div className="col-8">
        <Dropdown className="float-right" style={styles.dropDownMenu} 
          isOpen={this.state.dropdownOpen} 
          toggle={this.toggle}>
          
          <DropdownToggle color='link'>
            <i style={styles.dropDownIcon} className="dropdown fas fa-align-justify"></i>
          </DropdownToggle>

          <DropdownMenu>
            <DropdownItem >
              <AnchorLink style={styles.dropDownLink} href="#search" className="nav-link">Search</AnchorLink>
            </DropdownItem>
            <DropdownItem >
              <AnchorLink style={styles.dropDownLink} href="#tophits" className="nav-link">Trending</AnchorLink>
            </DropdownItem>
            <DropdownItem >
              <AnchorLink style={styles.dropDownLink} href="#topcountries" className="nav-link">Countries</AnchorLink>
            </DropdownItem>
            <DropdownItem >
              <AnchorLink style={styles.dropDownLink} href="#topeditors" className="nav-link">Editors</AnchorLink>
            </DropdownItem>
          </DropdownMenu>
        
        </Dropdown>
      </div>
    )
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }

  componentDidMount() {

  }

  render() {

    return (

      <div className="fixed-top" style={styles.main}>

        <div style={styles.titleHolder} className="text-center row">
          <div className="col-4">
            <div className="row" style={styles.combinedTitle}>
              <div className="">
                <AnchorLink href="#top" className="nav-title-icon">
                  <i style={styles.icon} className="fab fa-wikipedia-w"></i>
                </AnchorLink>

              </div>
              <div className="nav-title-text">
                <p style={styles.title}>ikipedia</p>
              </div>
            </div>
          </div>

          <Media query="(max-width: 599px)">
            {matches =>
              matches ? (
                this.renderDropDown()
              ) : (
                  this.renderLinks()
                )
            }
          </Media>

        </div>


      </div>
    );
  }
}

const styles = {
  main: {
    // border: '1px solid black',
    width: '100%',
    // margin: '0px auto',
    backgroundColor: 'white'
  },
  titleHolder: {
    maxWidth: '750px',
    margin: '15px auto'
  },
  combinedTitle: {
    marginLeft: '30px',
    width: '180px'
  },
  icon: {
    fontSize: 'calc(40px + 1vw)'
  },
  
  title: {
    fontSize: 'calc(14px + 1vw)',
    padding: '0px',
    paddingTop: '8px',
    // paddingRight: '8px'
  },
  linkHolder: {
    // border: '1px solid black',
    margin: 'auto'
  },
  navLink: {
    textAlign: 'left',
    fontSize: 'calc(16px + 0.5vw)',
    marginRight: '10px',
  },
  dropDownIcon: {
    fontSize: 'calc(34px + 1vw)',
    // color: 'rgb(7, 100, 206)'
  },
  dropDownMenu: {
    marginRight: '2vw'
  },
  dropDownLink: {
    textAlign: 'left',
    fontSize: 'calc(14px + 0.5vw)',
  }
}