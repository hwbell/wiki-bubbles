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
      <div className="container" style={styles.main}>

        <div style={styles.titleHolder} className="text-center row">
          <div className="">
            <i style={styles.icon} className="fab fa-wikipedia-w"></i>
          </div>
          <div style={styles.title} className="nav-title">
            <p>ikipedia</p>
          </div>
        </div>

      </div>
    );
  }
}

const styles = {
  main: {
    width: '100%',
    marginTop: '20px'
  },
  titleHolder: {
    width: '80%',
    margin: 'auto auto'
  },
  icon: {
    fontSize: '45px'
  },
  title: {
    fontSize: '20px',
    paddingTop: '8px'
  }
}